import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function GET(req) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const totalFarmers = await User.countDocuments();

    // Get new signups this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newSignups = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Get active users (users with quests progress)
    const activeUsers = await User.countDocuments({
      "questsProgress.0": { $exists: true },
    });

    // Get total quests completed
    const users = await User.find({}, "questsProgress");
    const totalQuestsCompleted = users.reduce((sum, user) => {
      return (
        sum +
        (user.questsProgress?.filter((q) => q.status === "completed").length ||
          0)
      );
    }, 0);

    return NextResponse.json(
      {
        totalFarmers,
        newSignups,
        activeUsers,
        totalQuestsCompleted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
