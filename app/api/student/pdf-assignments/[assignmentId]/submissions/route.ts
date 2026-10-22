import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { pdfAssignments, pdfAssignmentSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getSafeOriginalFileName,
  getSubmittedFileExtension,
  PDF_ASSIGNMENT_MAX_FILE_SIZE,
  PDF_ASSIGNMENT_UPLOAD_DIRECTORY,
} from "@/lib/utils/pdf-assignment-storage";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
) {
  let storedPath: string | undefined;

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { assignmentId: rawAssignmentId } = await context.params;
    const assignmentId = Number(rawAssignmentId);
    if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
      return NextResponse.json({ error: "Mã bài tập không hợp lệ" }, { status: 400 });
    }

    const [assignment] = await db
      .select({ id: pdfAssignments.id })
      .from(pdfAssignments)
      .where(eq(pdfAssignments.id, assignmentId))
      .limit(1);

    if (!assignment) {
      return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
    }

    const formData = await request.formData();
    const answerText = String(formData.get("answerText") ?? "").trim();
    if (answerText.length > 10000) {
      return NextResponse.json(
        { error: "Phần trả lời văn bản tối đa 10.000 ký tự" },
        { status: 400 }
      );
    }

    const fileEntry = formData.get("file");
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
    if (!file && !answerText) {
      return NextResponse.json(
        { error: "Vui lòng tải file bài làm hoặc nhập câu trả lời" },
        { status: 400 }
      );
    }

    let originalFileName: string | null = null;
    let storageName: string | null = null;

    if (file) {
      if (file.size > PDF_ASSIGNMENT_MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File bài làm phải nhỏ hơn hoặc bằng 15 MB" },
          { status: 400 }
        );
      }

      const extension = await getSubmittedFileExtension(file);
      if (!extension) {
        return NextResponse.json(
          { error: "Chỉ nhận file PDF, JPG, PNG hoặc WEBP hợp lệ" },
          { status: 400 }
        );
      }

      storageName = `${randomUUID()}${extension}`;
      originalFileName = getSafeOriginalFileName(file.name);
      storedPath = join(PDF_ASSIGNMENT_UPLOAD_DIRECTORY, storageName);
      await mkdir(PDF_ASSIGNMENT_UPLOAD_DIRECTORY, { recursive: true });
      await writeFile(storedPath, Buffer.from(await file.arrayBuffer()), {
        flag: "wx",
      });
    }

    const [submission] = await db
      .insert(pdfAssignmentSubmissions)
      .values({
        assignmentId,
        userId,
        answerText: answerText || null,
        storageName,
        originalFileName,
      })
      .returning({
        id: pdfAssignmentSubmissions.id,
        status: pdfAssignmentSubmissions.status,
        submittedAt: pdfAssignmentSubmissions.submittedAt,
        originalFileName: pdfAssignmentSubmissions.originalFileName,
      });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    if (storedPath) {
      await unlink(storedPath).catch((cleanupError: NodeJS.ErrnoException) => {
        if (cleanupError.code !== "ENOENT") {
          console.error("Failed to remove unlinked PDF assignment file:", cleanupError);
        }
      });
    }

    console.error("Error submitting PDF assignment:", error);
    return NextResponse.json(
      { error: "Không thể nộp bài. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
