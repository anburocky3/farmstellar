import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";

/**
 * GET /api/chatbot/history
 * Retrieve conversation history for a session
 * Query param: session_id (optional, defaults to 'default')
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id") || "default";

    const history = sessionStore.getHistory(session_id);

    return NextResponse.json({
      session_id,
      history,
      total: history.length,
    });
  } catch (error) {
    console.error("History retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve chat history" },
      { status: 500 }
    );
  }
}
