import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pdfAssignments, pdfAssignmentSubmissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const [assignments, submissions] = await Promise.all([
      db
        .select({
          id: pdfAssignments.id,
          title: pdfAssignments.title,
          description: pdfAssignments.description,
          exerciseFileName: pdfAssignments.exerciseFileName,
          exerciseFileUrl: pdfAssignments.exerciseFileUrl,
        })
        .from(pdfAssignments)
        .orderBy(pdfAssignments.id),
      db
        .select({
          id: pdfAssignmentSubmissions.id,
          assignmentId: pdfAssignmentSubmissions.assignmentId,
          answerText: pdfAssignmentSubmissions.answerText,
          originalFileName: pdfAssignmentSubmissions.originalFileName,
          score: pdfAssignmentSubmissions.score,
          feedback: pdfAssignmentSubmissions.feedback,
          status: pdfAssignmentSubmissions.status,
          submittedAt: pdfAssignmentSubmissions.submittedAt,
          gradedAt: pdfAssignmentSubmissions.gradedAt,
        })
        .from(pdfAssignmentSubmissions)
        .where(eq(pdfAssignmentSubmissions.userId, userId))
        .orderBy(desc(pdfAssignmentSubmissions.submittedAt)),
    ]);

    const latestSubmissionByAssignment = new Map<
      number,
      (typeof submissions)[number]
    >();
    for (const submission of submissions) {
      if (!latestSubmissionByAssignment.has(submission.assignmentId)) {
        latestSubmissionByAssignment.set(submission.assignmentId, submission);
      }
    }

    return NextResponse.json({
      assignments: assignments.map((assignment) => ({
        ...assignment,
        latestSubmission:
          latestSubmissionByAssignment.get(assignment.id) ?? null,
      })),
    });
  } catch (error) {
    console.error("Error fetching PDF assignments:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách bài tập" },
      { status: 500 }
    );
  }
}
