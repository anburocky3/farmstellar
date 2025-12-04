import connectDb from "@/lib/db";
import Otp from "@/lib/models/Otp.js";
import User from "@/lib/models/User.js";
import { verifyOTPService } from "@/services/twilioService.js";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") return "dev_jwt_secret";
    throw new Error("JWT secret not configured");
  }
  return secret;
}

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp)
      return new Response(
        JSON.stringify({
          success: false,
          message: "Phone and OTP are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    if (!/^\d{10}$/.test(phone))
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid phone number format",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    if (!/^\d{6}$/.test(otp))
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    await connectDb();

    const otpEntry = await Otp.findOne({ phone, consumed: false }).sort({
      createdAt: -1,
    });

    let verified = false;
    let reason = "Invalid OTP";

    if (otpEntry) {
      if (Date.now() > new Date(otpEntry.expiresAt).getTime()) {
        reason = "OTP expired";
      } else if (otpEntry.otp === otp) {
        verified = true;
      } else {
        otpEntry.attempts = (otpEntry.attempts || 0) + 1;
        await otpEntry.save();
        if (otpEntry.attempts >= 3) reason = "Too many failed attempts";
      }
    } else {
      const external = verifyOTPService(phone, otp);
      if (external && external.success) verified = true;
      else
        reason =
          external && external.message
            ? external.message
            : "OTP not found or expired";
    }

    if (verified) {
      if (otpEntry) {
        otpEntry.consumed = true;
        await otpEntry.save();
      }
      const user = await User.findOne({ phone });
      if (user) {
        const token = jwt.sign({ userId: user._id }, getJwtSecret(), {
          expiresIn: "7d",
        });
        return new Response(
          JSON.stringify({
            success: true,
            token,
            isNewUser: false,
            message: "OTP verified successfully",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: true,
            isNewUser: true,
            message: "OTP verified. Please complete your profile.",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      return new Response(JSON.stringify({ success: false, message: reason }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("verify-otp error", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to verify OTP",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
