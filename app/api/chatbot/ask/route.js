import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";

const MODEL_ID = "gemini-2.0-flash-exp";
const SUPPORTED_LANGS = ["en", "hi", "ta", "ml", "mr"];

// Initialize Google Gen AI SDK
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

function detectLanguage(req) {
  // 1) Cookie set by ClientI18nLoader: farmstellar_lang
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/(^|;\s*)farmstellar_lang=([^;]+)/i);
  if (cookieMatch && cookieMatch[2]) {
    const code = cookieMatch[2].toLowerCase();
    const base = code.split("-")[0];
    if (SUPPORTED_LANGS.includes(base)) return base;
  }

  // 2) Accept-Language header
  const accept = req.headers.get("accept-language") || "";
  if (accept) {
    const parts = accept.split(",").map((p) => p.trim().split(";")[0]);
    for (const part of parts) {
      const base = part.toLowerCase().split("-")[0];
      if (SUPPORTED_LANGS.includes(base)) return base;
    }
  }

  return "en";
}

/**
 * Multilingual AI Moderator - checks if query is farm-related
 * @param {string} query - User's question
 * @returns {Promise<boolean>} True if farm-related, false otherwise
 */
async function isFarmRelatedLLM(query) {
  const moderationPrompt = `
You are a multilingual classifier. Understand the question in ANY language.
You are FarmStellar, an agricultural expert chatbot.
You ALWAYS use previous conversation context.
If the user's question is unclear or short (e.g., "what method?", "which one?", "how?"),
you infer the meaning from previous messages.

Do NOT refuse unless the user is clearly asking outside agriculture.
Your goal is to guide farmers clearly and helpfully.

Determine if this question is ONLY about:
✔ Farming, crops, soil, irrigation
✔ Seeds, fertilizers, pests
✔ Weather impact on crops
✔ Farm tools, tractors
✔ Sustainable agriculture
✔ FarmStellar app (login, rewards, quests)

If the question is not about these topics, answer: no  
If it is related, answer: yes

Question: "${query}"

Reply with only: yes or no.
`;

  try {
    const result = await genAI.models.generateContent({
      model: MODEL_ID,
      contents: moderationPrompt,
      config: { temperature: 0 },
    });

    const text = (result.text || "").trim().toLowerCase();
    return text === "yes";
  } catch (error) {
    console.error("Moderation error:", error);
    // Default to allowing the question if classifier fails
    return true;
  }
}

/**
 * POST /api/chatbot/ask
 * Main chat endpoint with moderation and conversation history
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      message,
      session_id = "default",
      userLocation = null,
      farmDetails = null,
    } = body;
    const lang = detectLanguage(req);

    // Validate input
    const userMsg = message?.trim();
    if (!userMsg) {
      return NextResponse.json(
        { answer: "Please type something to ask. 🌱" },
        { status: 400 }
      );
    }

    // Check if GOOGLE_API_KEY is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Moderation check
    const isFarmRelated = await isFarmRelatedLLM(userMsg);
    if (!isFarmRelated) {
      return NextResponse.json({
        answer:
          "❌ I can answer only **farming, agriculture, or FarmStellar app** related questions. Please ask about crops, soil, fertilizers, pests, irrigation, weather, or sustainable farming. 🌾",
        session_id,
      });
    }

    // Add user message to history
    sessionStore.addMessage(session_id, "user", userMsg);

    // Get conversation history context
    const historyContext = sessionStore.formatHistory(session_id);

    // Build context string from user location and farm details
    let userContext = "";
    if (userLocation || farmDetails) {
      userContext = "\n\nUser Context:";
      if (userLocation) {
        userContext += `\n- Location: ${
          userLocation.city || userLocation.location || "Not specified"
        }`;
      }
      if (farmDetails) {
        userContext += `\n- Farm: ${farmDetails.name || "Not specified"}`;
        userContext += `\n- Farm Size: ${
          farmDetails.size ? `${farmDetails.size} acres` : "Not specified"
        }`;
        userContext += `\n- Primary Crop: ${
          farmDetails.primaryCrop || "Not specified"
        }`;
        userContext += `\n- Address: ${farmDetails.address || "Not specified"}`;
      }
    }

    // System prompt
    const systemPrompt = `
You are FarmStellar Bot – a friendly farming assistant for Indian farmers.

Conversation history:
${historyContext}${userContext}

Follow these rules:
• Respond in the SAME language the user uses (preferred: ${lang})  
• Use simple, farmer-friendly words  
• Max 100–150 words  
• Use bullet points (• or -)  
• Bold important terms  
• **Give location-specific and farm-specific suggestions** based on their city, farm size, and primary crop
• Be kind and helpful 🌱  
`; // Generate response
    const prompt = `${systemPrompt}\n\nUser Question: ${userMsg}`;
    const result = await genAI.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: { temperature: 0 },
    });
    const botReply =
      result.text || "I'm here to help! Ask me anything about farming.";

    // Save bot response to history
    sessionStore.addMessage(session_id, "bot", botReply);

    return NextResponse.json({
      answer: botReply,
      session_id,
      language: lang,
      history_length: sessionStore.getHistory(session_id).length,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
