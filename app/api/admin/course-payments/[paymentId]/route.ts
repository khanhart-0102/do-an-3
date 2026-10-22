import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { courseEnrollments, coursePayments } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    if (!(await getIsAdmin())) {
      return NextResponse.json({ error: "Không có quyền quản trị" }, { status: 403 });
    }

    const { paymentId: rawPaymentId } = await params;
    const paymentId = Number(rawPaymentId);
    if (!Number.isSafeInteger(paymentId) || paymentId <= 0) {
      return NextResponse.json({ error: "Mã thanh toán không hợp lệ" }, { status: 400 });
    }

    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("action" in body) ||
      (body.action !== "approve" && body.action !== "reject")
    ) {
      return NextResponse.json({ error: "Thao tác không hợp lệ" }, { status: 400 });
    }

    const [payment] = await db
      .select()
      .from(coursePayments)
      .where(eq(coursePayments.id, paymentId))
      .limit(1);
    if (!payment || payment.paymentMethod !== "BANK_TRANSFER") {
      return NextResponse.json({ error: "Không tìm thấy giao dịch chuyển khoản" }, { status: 404 });
    }

    if (body.action === "reject") {
      if (payment.status !== "PENDING") {
        return NextResponse.json({ error: "Chỉ có thể từ chối giao dịch đang chờ" }, { status: 409 });
      }

      const rejected = await db
        .update(coursePayments)
        .set({ status: "FAILED", reviewedBy: userId, reviewedAt: new Date() })
        .where(and(eq(coursePayments.id, paymentId), eq(coursePayments.status, "PENDING")))
        .returning({ id: coursePayments.id });
      if (rejected.length === 0) {
        return NextResponse.json({ error: "Giao dịch vừa được xử lý, hãy tải lại danh sách" }, { status: 409 });
      }
      return NextResponse.json({ success: true, status: "FAILED" });
    }

    if (payment.status === "FAILED" || payment.status === "REFUNDED") {
      return NextResponse.json({ error: "Giao dịch này không thể được duyệt" }, { status: 409 });
    }

    if (payment.status === "PENDING") {
      const updated = await db
        .update(coursePayments)
        .set({ status: "COMPLETED", reviewedBy: userId, reviewedAt: new Date(), paidAt: new Date() })
        .where(and(eq(coursePayments.id, paymentId), eq(coursePayments.status, "PENDING")))
        .returning({ id: coursePayments.id });
      if (updated.length === 0) {
        return NextResponse.json({ error: "Giao dịch vừa được xử lý, hãy tải lại danh sách" }, { status: 409 });
      }
    }

    const existingEnrollment = await db.query.courseEnrollments.findFirst({
      where: and(
        eq(courseEnrollments.userId, payment.userId),
        eq(courseEnrollments.courseId, payment.courseId)
      ),
    });
    if (!existingEnrollment) {
      await db.insert(courseEnrollments).values({
        userId: payment.userId,
        courseId: payment.courseId,
        enrollmentType: "PAID",
        status: "ACTIVE",
        progress: 0,
      });
    }

    return NextResponse.json({ success: true, status: "COMPLETED" });
  } catch (error) {
    console.error("Error reviewing course payment:", error);
    return NextResponse.json({ error: "Không thể cập nhật giao dịch" }, { status: 500 });
  }
}
