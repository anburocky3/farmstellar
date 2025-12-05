import mongoose, { Schema, model } from "mongoose";

const FarmSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    address: { type: String },
    size: { type: Number },
    primaryCrop: { type: String },
  },
  { timestamps: true }
);

const Farm = mongoose.models.Farm || model("Farm", FarmSchema);

export default Farm;
