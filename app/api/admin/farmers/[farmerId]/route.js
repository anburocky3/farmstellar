import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Farm from "@/lib/models/Farm";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function GET(req, { params }) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const { farmerId } = params;

    const farmer = await User.findById(farmerId)
      .populate({
        path: "farm",
        model: Farm,
      })
      .select("-passwordHash")
      .lean();

    if (!farmer) {
      return NextResponse.json(
        { message: "Farmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        farmer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get farmer error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const { farmerId } = params;
    const { name, email, phone, city, level, xp } = await req.json();

    // Build update object with only provided fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (city !== undefined) updateFields.city = city;
    if (level !== undefined) updateFields.level = level;
    if (xp !== undefined) updateFields.xp = xp;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: farmerId },
      });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const farmer = await User.findByIdAndUpdate(
      farmerId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!farmer) {
      return NextResponse.json(
        { message: "Farmer not found" },
        { status: 404 }
      );
    }

    console.log("Farmer updated:", farmerId);
    return NextResponse.json(
      {
        message: "Farmer updated successfully",
        farmer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update farmer error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
