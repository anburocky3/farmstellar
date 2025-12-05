import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quest from "@/lib/models/Quest";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function GET(req) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(req);
    if (!authResult.valid) {
      return NextResponse.json(
        { message: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get search and filter parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = parseInt(searchParams.get("skip")) || 0;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Fetch quests with pagination
    const quests = await Quest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Quest.countDocuments(query);

    return NextResponse.json(
      {
        quests,
        total,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get quests error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Verify admin token
    const authResult = verifyAdminToken(req);
    if (!authResult.valid) {
      return NextResponse.json(
        { message: authResult.message },
        { status: 401 }
      );
    }

    await dbConnect();

    const { slug, title, description, difficulty, stages, totalXp, active } =
      await req.json();

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { message: "Slug and title are required" },
        { status: 400 }
      );
    }

    // Check if quest with slug exists
    const existingQuest = await Quest.findOne({ slug });
    if (existingQuest) {
      return NextResponse.json(
        { message: "Quest with this slug already exists" },
        { status: 400 }
      );
    }

    // Create quest
    const quest = new Quest({
      slug,
      title,
      description,
      difficulty: difficulty || "easy",
      stages: stages || [],
      totalXp: totalXp || 0,
      active: active !== false,
    });

    await quest.save();

    return NextResponse.json(
      {
        message: "Quest created successfully",
        quest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quest error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
