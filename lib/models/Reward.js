import mongoose, { Schema, model } from "mongoose";

const RewardSchema = new Schema(
  {
    title: { type: String, required: true },
    xpCost: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Reward = mongoose.models.Reward || model("Reward", RewardSchema);
export default Reward;
