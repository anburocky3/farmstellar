import connectDb from "@/lib/db";
import Submission from "@/lib/models/Submission.js";
import User from "@/lib/models/User.js";
import { getUserIdFromRequest } from "@/lib/serverAuth.js";
import { headObject } from "@/lib/services/s3Service.js";

// XP rewards mapping (same as server one)
const QUEST_XP_REWARDS = {
  soil_scout: 10,
  crop_quest: 75,
  compost_kickoff: 40,
  zero_waste: 85,
  mini_garden: 100,
  mulch_master: 60,
  boll_keeper: 150,
  coconut_basin: 140,
  coconut_bioenzyme: 180,
  rust_shield: 160,
  biodiversity_strip: 190,
  rainwater_hero: 185,
  biochar_maker: 200,
  jeevamrutham: 150,
  crops: 75,
  soil: 10,
  compost: 40,
};

export async function POST(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId)
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

    const body = await req.json();
    const {
      questId,
      stageIndex,
      media,
      notes,
      checklist,
      proofType,
      proofUrl,
      description,
    } = body;

    await connectDb();

    // Validate S3 uploads if media keys are provided
    if (media && media.length > 0) {
      for (const m of media) {
        try {
          await headObject(m.key);
        } catch (error) {
          return new Response(
            JSON.stringify({ message: "File not found in S3 storage." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    const submission = new Submission({
      userId,
      questId: questId || "",
      stageIndex: stageIndex || 0,
      media: media || [],
      notes: notes || description || "",
      checklist: checklist || [],
      status: "pending",
      proofType: proofType || "text",
      proofUrl: proofUrl || "",
    });

    await submission.save();

    // Update user's quest progress to "submitted"
    const user = await User.findById(userId);
    const questProgress = user.questsProgress.find(
      (p) => p.questId === questId || p.questId.toString() === questId
    );
    if (questProgress) {
      questProgress.status = "submitted";
    } else {
      user.questsProgress.push({
        questId: questId,
        stageIndex: stageIndex || 0,
        status: "submitted",
      });
    }
    await user.save();

    return new Response(JSON.stringify(submission), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Create submission error:", err);
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
