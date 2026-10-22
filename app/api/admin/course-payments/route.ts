import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { coursePayments, courses, users } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    if (!(await getIsAdmin())) {
      return NextResponse.json({ error: "Không có quyền quản trị" }, { status: 403 });
    }

    const payments = await db
      .select({
        id: coursePayments.id,
        userId: coursePayments.userId,
        courseId: coursePayments.courseId,
        courseTitle: courses.title,
        amount: coursePayments.amount,
        currency: coursePayments.currency,
        paymentMethod: coursePayments.paymentMethod,
        paymentReference: coursePayments.paymentReference,
        status: coursePayments.status,
        createdAt: coursePayments.createdAt,
        reviewedAt: coursePayments.reviewedAt,
        studentName: users.userName,
        studentEmail: users.email,
      })
      .from(coursePayments)
      .innerJoin(courses, eq(coursePayments.courseId, courses.id))
      .innerJoin(users, eq(coursePayments.userId, users.userId))
      .where(eq(coursePayments.paymentMethod, "BANK_TRANSFER"))
      .orderBy(desc(coursePayments.createdAt))
      .limit(100);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error loading course payments for admin:", error);
    return NextResponse.json({ error: "Không thể tải danh sách thanh toán" }, { status: 500 });
  }
}
