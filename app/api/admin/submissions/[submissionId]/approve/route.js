import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import User from "@/lib/models/User";
import Quest from "@/lib/models/Quest";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function POST(req, { params }) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const { submissionId } = params;

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: "approved",
        reviewedBy: adminAuth.adminId,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    // Fetch quest to get XP reward
    const quest = await Quest.findById(submission.questId);
    const xpReward = quest?.xpReward || 0;

    // Update user's quest progress and award XP
    const user = await User.findByIdAndUpdate(
      submission.userId,
      {
        $set: {
          "questsProgress.$[elem].status": "completed",
        },
        $inc: {
          xp: xpReward,
        },
        $addToSet: {
          completedQuests: submission.questId,
        },
      },
      {
        arrayFilters: [{ "elem.questId": submission.questId }],
        new: true,
      }
    );

    // Calculate new level based on XP
    if (user) {
      const newLevel = Math.floor(user.xp / 100) + 1;
      if (newLevel !== user.xpLevel) {
        await User.findByIdAndUpdate(submission.userId, { xpLevel: newLevel });
      }
    }

    console.log("Submission approved:", submissionId, "XP awarded:", xpReward);
    return NextResponse.json(
      {
        message: "Submission approved successfully",
        submission,
        xpAwarded: xpReward,
        updatedXP: user?.xp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve submission error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
