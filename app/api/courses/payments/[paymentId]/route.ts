import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { coursePayments, courses } from "@/db/schema";
import { createVietQrDataUrl, getBankTransferConfig } from "@/lib/payments/bank-transfer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { paymentId: rawPaymentId } = await params;
    const paymentId = Number(rawPaymentId);
    if (!Number.isSafeInteger(paymentId) || paymentId <= 0) {
      return NextResponse.json({ error: "Mã thanh toán không hợp lệ" }, { status: 400 });
    }

    const [payment] = await db
      .select({
        id: coursePayments.id,
        userId: coursePayments.userId,
        courseId: coursePayments.courseId,
        amount: coursePayments.amount,
        currency: coursePayments.currency,
        paymentMethod: coursePayments.paymentMethod,
        paymentReference: coursePayments.paymentReference,
        status: coursePayments.status,
        createdAt: coursePayments.createdAt,
        courseTitle: courses.title,
      })
      .from(coursePayments)
      .innerJoin(courses, eq(coursePayments.courseId, courses.id))
      .where(eq(coursePayments.id, paymentId))
      .limit(1);

    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ error: "Không tìm thấy yêu cầu thanh toán" }, { status: 404 });
    }

    if (payment.paymentMethod !== "BANK_TRANSFER" || !payment.paymentReference) {
      return NextResponse.json({ error: "Phương thức thanh toán không hợp lệ" }, { status: 400 });
    }

    const bank = getBankTransferConfig();
    if (!bank) {
      return NextResponse.json({ error: "Thông tin ngân hàng chưa được cấu hình" }, { status: 503 });
    }

    return NextResponse.json({
      ...payment,
      bank,
      qrUrl: await createVietQrDataUrl(bank, payment.amount, payment.paymentReference),
    });
  } catch (error) {
    console.error("Error loading course payment:", error);
    return NextResponse.json({ error: "Không thể tải thông tin thanh toán" }, { status: 500 });
  }
}
