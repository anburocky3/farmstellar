import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Reward from "@/lib/models/Reward";
import User from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/serverAuth";

export async function POST(req) {
  try {
    // Verify user token and get userId
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { rewardId } = await req.json();

    // Validate rewardId
    if (!rewardId) {
      return NextResponse.json(
        { message: "Reward ID is required" },
        { status: 400 }
      );
    }

    // Find user and reward
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!reward) {
      return NextResponse.json(
        { message: "Reward not found" },
        { status: 404 }
      );
    }

    // Check stock
    if (reward.stock <= 0) {
      return NextResponse.json(
        { message: "Reward out of stock" },
        { status: 400 }
      );
    }

    // Check if user has enough XP
    if (user.xp < reward.xpCost) {
      return NextResponse.json({ message: "Not enough XP" }, { status: 400 });
    }

    // Deduct XP from user and decrease stock
    user.xp -= reward.xpCost;
    reward.stock -= 1;

    // Save both documents
    await user.save();
    await reward.save();

    return NextResponse.json(
      {
        message: "Reward redeemed successfully",
        xpDeducted: reward.xpCost,
        updatedXP: user.xp,
        reward: {
          id: reward._id,
          title: reward.title,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Redeem reward error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
