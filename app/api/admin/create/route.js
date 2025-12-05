import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password, organization, role } = await req.json();

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      name,
      email,
      passwordHash,
      organization,
      role: role || "admin",
    });
    await admin.save();

    console.log("Admin created:", admin._id);
    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          organization: admin.organization,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
