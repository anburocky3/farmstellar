import mongoose, { Schema, model } from "mongoose";

const OtpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Otp = mongoose.models.Otp || model("Otp", OtpSchema);

export default Otp;
