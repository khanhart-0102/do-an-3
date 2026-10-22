import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pdfAssignmentSubmissions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
      columns: { role: true },
    });
    if (user?.role !== "TEACHER" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const { submissionId: rawSubmissionId } = await context.params;
    const submissionId = Number(rawSubmissionId);
    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return NextResponse.json({ error: "Mã bài nộp không hợp lệ" }, { status: 400 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Dữ liệu chấm bài không hợp lệ" }, { status: 400 });
    }

    const input = body as { score?: unknown; feedback?: unknown };
    const score =
      input.score === null || input.score === ""
        ? null
        : typeof input.score === "number" && Number.isInteger(input.score)
          ? input.score
          : Number.NaN;
    const feedback = input.feedback ?? "";

    if (
      (score !== null && (!Number.isInteger(score) || score < 0 || score > 100)) ||
      typeof feedback !== "string" ||
      feedback.length > 5000
    ) {
      return NextResponse.json(
        { error: "Điểm phải từ 0 đến 100 và nhận xét tối đa 5.000 ký tự" },
        { status: 400 }
      );
    }

    const [submission] = await db
      .update(pdfAssignmentSubmissions)
      .set({
        score,
        feedback: feedback.trim() || null,
        status: "GRADED",
        gradedBy: userId,
        gradedAt: new Date(),
      })
      .where(eq(pdfAssignmentSubmissions.id, submissionId))
      .returning({ id: pdfAssignmentSubmissions.id });

    if (!submission) {
      return NextResponse.json({ error: "Không tìm thấy bài nộp" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error grading PDF assignment submission:", error);
    return NextResponse.json(
      { error: "Không thể lưu kết quả chấm bài" },
      { status: 500 }
    );
  }
}
