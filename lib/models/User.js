import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    location: { type: String },
    city: { type: String },
    level: { type: String, enum: ["beginner", "pro"], default: "beginner" },
    xp: { type: Number, default: 0 },
    xpLevel: { type: Number, default: 0 },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm" },
    onboarded: { type: Boolean, default: false },
    purchasedRewards: [{ type: String }],
    questsProgress: [
      {
        questId: { type: String },
        stageIndex: { type: Number },
        status: {
          type: String,
          enum: ["not-started", "in-progress", "submitted", "completed"],
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || model("User", UserSchema);

export default User;
