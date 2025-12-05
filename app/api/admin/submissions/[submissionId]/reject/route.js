import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { verifyAdminToken } from "@/lib/serverAuth";

export async function POST(req, { params }) {
  try {
    const adminAuth = await verifyAdminToken(req);
    if (!adminAuth.valid) {
      return NextResponse.json({ message: adminAuth.message }, { status: 401 });
    }

    await dbConnect();

    const { submissionId } = params;
    const { feedback } = await req.json();

    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback is required" },
        { status: 400 }
      );
    }

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: "rejected",
        feedback,
        reviewedBy: adminAuth.adminId,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Submission rejected successfully",
        submission,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reject submission error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
