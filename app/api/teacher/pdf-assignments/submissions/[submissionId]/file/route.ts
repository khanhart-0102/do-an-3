import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pdfAssignmentSubmissions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  isSafeStoredFileName,
  PDF_ASSIGNMENT_UPLOAD_DIRECTORY,
} from "@/lib/utils/pdf-assignment-storage";

export async function GET(
  _request: Request,
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

    const [submission] = await db
      .select({
        storageName: pdfAssignmentSubmissions.storageName,
        originalFileName: pdfAssignmentSubmissions.originalFileName,
      })
      .from(pdfAssignmentSubmissions)
      .where(eq(pdfAssignmentSubmissions.id, submissionId))
      .limit(1);

    if (!submission?.storageName || !isSafeStoredFileName(submission.storageName)) {
      return NextResponse.json({ error: "Không tìm thấy file bài làm" }, { status: 404 });
    }

    const fileBuffer = await readFile(
      join(PDF_ASSIGNMENT_UPLOAD_DIRECTORY, submission.storageName)
    );
    const extension = submission.storageName.split(".").pop();
    const contentType =
      extension === "pdf"
        ? "application/pdf"
        : extension === "png"
          ? "image/png"
          : extension === "webp"
            ? "image/webp"
            : "image/jpeg";
    const fileName = submission.originalFileName || "bai-lam";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileBuffer.length),
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error downloading PDF assignment submission:", error);
    return NextResponse.json(
      { error: "Không thể tải file bài làm" },
      { status: 500 }
    );
  }
}
