import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(request) {
  try {
    await connectDB();

    // Get userId from JWT token
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get user context
    const user = await User.findById(userId).populate("farm");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate chatbot response
    const response = await generateChatbotResponse(message, user);

    return NextResponse.json({
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

// Simple response generator (replace with your AI integration)
async function generateChatbotResponse(message, user) {
  const lowerMessage = message.toLowerCase();

  // Greeting responses
  if (lowerMessage.match(/hello|hi|hey|namaste/)) {
    return `Namaste ${user.name}! 🙏 I'm here to help you with your farming journey. What would you like to know?`;
  }

  // Quest-related queries
  if (lowerMessage.match(/quest|task|mission/)) {
    const completedQuests =
      user.questsProgress?.filter((q) => q.status === "completed").length || 0;
    return `You've completed ${completedQuests} quests so far! 🎯 Check your dashboard to see available quests. Each quest teaches you sustainable farming practices and rewards you with XP!`;
  }

  // XP-related queries
  if (lowerMessage.match(/xp|points|level|score/)) {
    return `You currently have ${user.xp || 0} XP and you're at Level ${
      user.xpLevel || 1
    }! 🌟 Complete more quests to earn XP and level up. You can also redeem XP for rewards in the Reward Store!`;
  }

  // Reward-related queries
  if (lowerMessage.match(/reward|redeem|store|seeds/)) {
    return `Visit the Reward Store to redeem your XP for amazing rewards! 🎁 We offer:\n\n🌱 Premium Seeds (Tomato, Chili, Rice, etc.)\n🌾 Organic Manure (Compost, Vermicompost, Biofertilizers)\n\nYour current XP: ${
      user.xp || 0
    }`;
  }

  // Crop recommendations
  if (lowerMessage.match(/crop|plant|grow|vegetable/)) {
    return `Great question! 🌱 For ${
      user.city || "your area"
    }, I recommend:\n\n✅ Tomatoes - Easy to grow, high yield\n✅ Spinach - Grows quickly, nutritious\n✅ Chili - Thrives in warm weather\n✅ Beans - Nitrogen-fixing, soil-friendly\n\nCheck out the "Crops that Fit" quest to learn more!`;
  }

  // Soil-related queries
  if (lowerMessage.match(/soil|compost|fertilizer/)) {
    return `Healthy soil is the foundation of good farming! 🌍\n\nTips:\n• Test your soil pH (6-7 is ideal)\n• Add organic compost regularly\n• Practice crop rotation\n• Use mulch to retain moisture\n\nTry the "Soil Scout" and "Soil Booster" quests!`;
  }

  // Watering queries
  if (lowerMessage.match(/water|irrigation|rain/)) {
    return `Water management is crucial! 💧\n\nBest practices:\n• Water early morning or evening\n• Check soil moisture before watering\n• Use drip irrigation if possible\n• Collect rainwater\n\nCheck out the "Rainwater Hero" quest!`;
  }

  // Pest control
  if (lowerMessage.match(/pest|insect|bug|disease/)) {
    return `Natural pest control is the way to go! 🐛\n\nOrganic solutions:\n• Neem oil spray\n• Companion planting\n• Encourage beneficial insects\n• Regular crop inspection\n\nExplore our pest management quests!`;
  }

  // Weather queries
  if (lowerMessage.match(/weather|season|climate/)) {
    return `Understanding seasons is key! 🌦️\n\nIn India:\n• Kharif (June-Oct): Rice, Cotton, Soybean\n• Rabi (Oct-March): Wheat, Mustard, Peas\n• Zaid (March-June): Watermelon, Cucumber\n\nCheck your dashboard for weather updates!`;
  }

  // Farm details
  if (lowerMessage.match(/farm|land|field/)) {
    const farmName = user.farm?.name || "your farm";
    return `Your farm "${farmName}" is doing great! 🚜\n\nCurrent stats:\n• XP: ${
      user.xp || 0
    }\n• Level: ${user.xpLevel || 1}\n• Completed Quests: ${
      user.questsProgress?.filter((q) => q.status === "completed").length || 0
    }\n\nKeep up the good work!`;
  }

  // Help/general queries
  if (lowerMessage.match(/help|how|what|guide/)) {
    return `I can help you with:\n\n🌱 Crop recommendations\n💧 Watering & irrigation\n🌍 Soil health & composting\n🐛 Pest control\n📚 Quest guidance\n🎁 Reward redemption\n🌾 Seasonal farming tips\n\nWhat would you like to know more about?`;
  }

  // Default response
  return `That's an interesting question! 🤔 While I'm still learning, here's what I can help you with:\n\n• Quest guidance and tips\n• Crop recommendations for ${
    user.city || "your area"
  }\n• Soil and water management\n• Pest control solutions\n• XP and rewards info\n\nFeel free to ask me anything about sustainable farming!`;
}
