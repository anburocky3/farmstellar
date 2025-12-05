import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";

/**
 * POST /api/chatbot/clear
 * Clear conversation history for a session
 * Body: { session_id: string } (optional, defaults to 'default')
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { session_id = "default" } = body;

    sessionStore.clearHistory(session_id);

    return NextResponse.json({
      message: "Chat history cleared 🌱",
      session_id,
    });
  } catch (error) {
    console.error("Clear history error:", error);
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 }
    );
  }
}
