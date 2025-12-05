import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import Quest from "@/lib/models/Quest";
import { verifyAdminToken } from "@/lib/serverAuth";
import { getSignedDownloadUrl } from "@/lib/services/s3Service";

export async function GET(req) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const submissions = await Submission.find({ status: "pending" })
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });

    // Fetch all quests for mapping
    const quests = await Quest.find();
    const questMap = {};
    quests.forEach((q) => {
      if (q._id) {
        questMap[q._id.toString()] = q.title;
      }
      if (q.slug) {
        questMap[q.slug] = q.title;
      }
    });

    // Generate signed URLs for images and add quest titles
    const submissionsWithSignedUrls = await Promise.all(
      submissions.map(async (submission) => {
        const submissionObj = submission.toObject();

        // Add quest title
        submissionObj.questTitle =
          questMap[submissionObj.questId] || submissionObj.questId;

        // If submission has media with S3 keys, generate signed URLs
        if (submissionObj.media && submissionObj.media.length > 0) {
          submissionObj.media = await Promise.all(
            submissionObj.media.map(async (item) => {
              if (item.key) {
                try {
                  const signedUrl = await getSignedDownloadUrl(item.key, 3600);
                  return { ...item, signedUrl };
                } catch (error) {
                  console.error("Error generating signed URL:", error);
                  return item;
                }
              }
              return item;
            })
          );

          // Update proofUrl with signed URL for backward compatibility
          if (submissionObj.media[0]?.signedUrl) {
            submissionObj.proofUrl = submissionObj.media[0].signedUrl;
          }
        } else if (
          submissionObj.proofUrl &&
          submissionObj.proofUrl.includes("s3.amazonaws.com")
        ) {
          // Extract S3 key from URL and generate signed URL
          try {
            const urlParts = submissionObj.proofUrl.split(".amazonaws.com/");
            if (urlParts.length > 1) {
              const key = urlParts[1].split("?")[0];
              submissionObj.proofUrl = await getSignedDownloadUrl(key, 3600);
            }
          } catch (error) {
            console.error("Error generating signed URL for proofUrl:", error);
          }
        }

        return submissionObj;
      })
    );

    return NextResponse.json(
      { submissions: submissionsWithSignedUrls },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
