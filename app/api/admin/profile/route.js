import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function GET(req) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const admin = await Admin.findById(adminAuth.adminId).select(
      "-passwordHash"
    );
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ admin }, { status: 200 });
  } catch (error) {
    console.error("Get admin profile error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
