import twilio from "twilio";

// Check if Twilio is configured
const isTwilioConfigured = !!(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
);

let client;
if (isTwilioConfigured) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log("✓ Twilio configured successfully");
} else {
  console.warn(
    "⚠ Twilio not configured. Using development mode with console OTP."
  );
}

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio SMS
export const sendOTPService = async (phone, providedOtp) => {
  try {
    // Allow caller to supply an OTP (so callers can persist it in DB); otherwise generate one.
    const otp = providedOtp || generateOTP();

    // Store OTP with 5 minute expiry in the in-memory store used by this service
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
    });

    // Development mode - log OTP to console (and return it for convenience)
    if (!isTwilioConfigured) {
      console.log("═══════════════════════════════════════");
      console.log("📱 DEVELOPMENT MODE - OTP");
      console.log(`Phone: ${phone}`);
      console.log(`OTP Code: ${otp}`);
      console.log("Valid for: 5 minutes");
      console.log("═══════════════════════════════════════");
      return { success: true, message: "OTP sent (development mode)", otp };
    }

    // Format phone number (ensure it has country code)
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your FarmStellar verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("OTP sent successfully:", message.sid);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Twilio SMS error:", error);
    throw new Error("Failed to send OTP");
  }
};

// Verify OTP
export const verifyOTPService = (phone, otp) => {
  console.log("Verifying OTP for phone:", phone);
  console.log("OTP provided:", otp);
  console.log("Stored OTPs:", Array.from(otpStore.keys()));

  const stored = otpStore.get(phone);

  if (!stored) {
    console.log("OTP not found in store for phone:", phone);
    return { success: false, message: "OTP not found or expired" };
  }

  console.log("Stored OTP data:", {
    otp: stored.otp,
    expiresAt: new Date(stored.expiresAt),
    attempts: stored.attempts,
  });

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    console.log("OTP expired");
    otpStore.delete(phone);
    return { success: false, message: "OTP expired" };
  }

  // Check attempts
  if (stored.attempts >= 3) {
    console.log("Too many attempts");
    otpStore.delete(phone);
    return { success: false, message: "Too many failed attempts" };
  }

  // Verify OTP
  if (stored.otp === otp) {
    otpStore.delete(phone);
    return { success: true, message: "OTP verified successfully" };
  } else {
    stored.attempts += 1;
    otpStore.set(phone, stored);
    return { success: false, message: "Invalid OTP" };
  }
};

// Clean up expired OTPs (run periodically)
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60 * 1000); // Clean up every minute
