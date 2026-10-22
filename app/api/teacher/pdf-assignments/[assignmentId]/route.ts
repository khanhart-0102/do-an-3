import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pdfAssignments, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
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

    const { assignmentId: rawAssignmentId } = await context.params;
    const assignmentId = Number(rawAssignmentId);
    if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
      return NextResponse.json({ error: "Mã bài tập không hợp lệ" }, { status: 400 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("answerKey" in body)) {
      return NextResponse.json({ error: "Thiếu nội dung đáp án" }, { status: 400 });
    }

    const answerKey = (body as { answerKey: unknown }).answerKey;
    if (
      answerKey !== null &&
      (typeof answerKey !== "string" || answerKey.length > 30000)
    ) {
      return NextResponse.json(
        { error: "Đáp án phải là văn bản tối đa 30.000 ký tự" },
        { status: 400 }
      );
    }

    const [assignment] = await db
      .update(pdfAssignments)
      .set({
        answerKey: typeof answerKey === "string" ? answerKey : null,
        updatedAt: new Date(),
      })
      .where(eq(pdfAssignments.id, assignmentId))
      .returning({ id: pdfAssignments.id });

    if (!assignment) {
      return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving PDF assignment answer key:", error);
    return NextResponse.json(
      { error: "Không thể lưu đáp án" },
      { status: 500 }
    );
  }
}
