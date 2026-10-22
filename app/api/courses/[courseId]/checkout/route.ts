/**
 * Course Checkout API
 * POST /api/courses/[courseId]/checkout - Create a bank transfer payment for a paid course
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { courses, courseEnrollments, coursePayments } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomBytes } from "crypto";
import { createVietQrDataUrl, getBankTransferConfig } from "@/lib/payments/bank-transfer";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const courseIdNum = Number(courseId);
    if (!Number.isSafeInteger(courseIdNum) || courseIdNum <= 0) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    // Get course
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseIdNum),
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.query.courseEnrollments.findFirst({
      where: and(
        eq(courseEnrollments.userId, userId),
        eq(courseEnrollments.courseId, courseIdNum)
      ),
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    // Check if course is free
    if (course.isFree || course.price === 0) {
      // Enroll directly for free courses
      await db.insert(courseEnrollments).values({
        userId,
        courseId: courseIdNum,
        enrollmentType: "FREE",
        status: "ACTIVE",
        progress: 0,
      });

      return NextResponse.json({
        success: true,
        message: "Enrolled successfully",
        isFree: true,
      });
    }

    if (course.currency.toUpperCase() !== "VND" ||
        !Number.isSafeInteger(course.price) ||
        course.price <= 0) {
      return NextResponse.json(
        { error: "Khóa học chưa có mức học phí VND hợp lệ." },
        { status: 400 }
      );
    }

    const bankConfig = getBankTransferConfig();
    if (!bankConfig) {
      return NextResponse.json(
        { error: "Thanh toán chưa được cấu hình tài khoản ngân hàng. Vui lòng liên hệ quản trị viên." },
        { status: 503 }
      );
    }

    const pendingPayment = await db.query.coursePayments.findFirst({
      where: and(
        eq(coursePayments.userId, userId),
        eq(coursePayments.courseId, courseIdNum),
        eq(coursePayments.status, "PENDING"),
        eq(coursePayments.paymentMethod, "BANK_TRANSFER")
      ),
      orderBy: [desc(coursePayments.createdAt)],
    });

    const payment = pendingPayment ?? (await db.insert(coursePayments).values({
      userId,
      courseId: courseIdNum,
      amount: course.price,
      currency: "VND",
      paymentMethod: "BANK_TRANSFER",
      paymentReference: `LG${randomBytes(5).toString("hex").toUpperCase()}`,
      status: "PENDING",
    }).returning())[0];

    if (!payment.paymentReference) {
      throw new Error("Bank transfer payment reference was not created");
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentReference: payment.paymentReference,
      amount: payment.amount,
      currency: payment.currency,
      courseTitle: course.title,
      bank: bankConfig,
      qrUrl: await createVietQrDataUrl(
        bankConfig,
        payment.amount,
        payment.paymentReference
      ),
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Không thể tạo yêu cầu thanh toán" },
      { status: 500 }
    );
  }
};
