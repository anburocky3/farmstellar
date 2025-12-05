import mongoose, { Schema, model } from "mongoose";

const QuestSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    stages: [
      {
        title: { type: String },
        description: { type: String },
        requiredMediaTypes: [{ type: String }],
      },
    ],
    active: { type: Boolean, default: true },
    totalXp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Quest = mongoose.models.Quest || model("Quest", QuestSchema);

export default Quest;
