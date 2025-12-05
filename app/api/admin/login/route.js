import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, passkey } = await req.json();

    if (!email || !passkey) {
      return NextResponse.json(
        { message: "Email and passkey are required" },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if admin account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { message: "Admin account is deactivated" },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(passkey, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: admin.role,
        userType: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Admin logged in:", admin._id);
    return NextResponse.json(
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          organization: admin.organization,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
