import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quest from "@/lib/models/Quest";
import { verifyAdminToken } from "@/lib/serverAuth";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
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

    const { questId } = params;
    const updates = await req.json();

    // Validate ObjectId
    if (!ObjectId.isValid(questId)) {
      return NextResponse.json(
        { message: "Invalid quest ID" },
        { status: 400 }
      );
    }

    // Find and update quest
    const quest = await Quest.findByIdAndUpdate(questId, updates, {
      new: true,
      runValidators: true,
    });

    if (!quest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Quest updated successfully",
        quest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update quest error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
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

    const { questId } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(questId)) {
      return NextResponse.json(
        { message: "Invalid quest ID" },
        { status: 400 }
      );
    }

    // Delete quest
    const quest = await Quest.findByIdAndDelete(questId);

    if (!quest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Quest deleted successfully",
        quest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete quest error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
