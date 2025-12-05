import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Reward from "@/lib/models/Reward";

export async function GET(req) {
  try {
    await dbConnect();

    const rewards = await Reward.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        rewards,
        total: rewards.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get rewards error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
