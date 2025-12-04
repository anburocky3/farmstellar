import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/serverAuth";

export async function POST(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    let userId = null;
    if (auth.startsWith("Bearer ")) {
      try {
        const token = auth.slice(7);
        const decoded = jwt.verify(token, getJwtSecret());
        userId = decoded.userId;
        console.log("User logged out:", userId);
      } catch (e) {
        console.warn("Failed to decode logout token for audit", e);
      }
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully logged out",
        userId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("logout error", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to logout",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
