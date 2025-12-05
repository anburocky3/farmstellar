import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Farm from "@/lib/models/Farm";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function GET(req) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const experience = searchParams.get("experience");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (experience) {
      query.level = experience;
    }

    const farmers = await User.find(query)
      .populate({
        path: "farm",
        model: Farm,
      })
      .select("-passwordHash")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json(
      {
        farmers,
        total,
        hasMore: total > skip + farmers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get farmers error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
