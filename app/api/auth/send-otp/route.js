import connectDb from "@/lib/db";
import Otp from "@/lib/models/Otp.js";
import { sendOTPService } from "@/services/twilioService.js";

const DEFAULT_OTP_TTL_MS = 5 * 60 * 1000;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { phone } = body;
    if (!phone)
      return new Response(
        JSON.stringify({ success: false, message: "Phone number is required" }),
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

    await connectDb();

    const otp =
      process.env.NODE_ENV === "development" ? "123456" : generateOtp();
    const expiresAt = new Date(Date.now() + DEFAULT_OTP_TTL_MS);

    await Otp.findOneAndUpdate(
      { phone },
      { phone, otp, expiresAt, consumed: false, attempts: 0 },
      { upsert: true, new: true }
    );

    const sendResult = await sendOTPService(phone, otp);

    const response = { success: true, message: "OTP sent" };
    if (process.env.NODE_ENV === "development" && sendResult && sendResult.otp)
      response.sampleOtp = sendResult.otp;
    else if (process.env.NODE_ENV === "development") response.sampleOtp = otp;

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-otp error", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send OTP",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
