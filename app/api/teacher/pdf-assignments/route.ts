import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import {
  pdfAssignments,
  pdfAssignmentSubmissions,
  users,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";

async function isTeacherOrAdmin(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.userId, userId),
    columns: { role: true },
  });
  return user?.role === "TEACHER" || user?.role === "ADMIN";
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    if (!(await isTeacherOrAdmin(userId))) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const [assignments, submissions] = await Promise.all([
      db.select().from(pdfAssignments).orderBy(pdfAssignments.id),
      db
        .select({
          id: pdfAssignmentSubmissions.id,
          assignmentId: pdfAssignmentSubmissions.assignmentId,
          userId: pdfAssignmentSubmissions.userId,
          answerText: pdfAssignmentSubmissions.answerText,
          originalFileName: pdfAssignmentSubmissions.originalFileName,
          score: pdfAssignmentSubmissions.score,
          feedback: pdfAssignmentSubmissions.feedback,
          status: pdfAssignmentSubmissions.status,
          submittedAt: pdfAssignmentSubmissions.submittedAt,
          gradedAt: pdfAssignmentSubmissions.gradedAt,
          studentName: users.userName,
          studentEmail: users.email,
        })
        .from(pdfAssignmentSubmissions)
        .leftJoin(users, eq(pdfAssignmentSubmissions.userId, users.userId))
        .orderBy(desc(pdfAssignmentSubmissions.submittedAt)),
    ]);

    return NextResponse.json({
      assignments: assignments.map((assignment) => ({
        ...assignment,
        submissions: submissions.filter(
          (submission) => submission.assignmentId === assignment.id
        ),
      })),
    });
  } catch (error) {
    console.error("Error fetching teacher PDF assignments:", error);
    return NextResponse.json(
      { error: "Không thể tải bài tập và bài nộp" },
      { status: 500 }
    );
  }
}
