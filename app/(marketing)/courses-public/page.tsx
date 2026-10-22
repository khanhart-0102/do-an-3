/**
 * Public Courses Page
 * Display all available courses for enrollment
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/drizzle";
import { courses, courseEnrollments } from "@/db/schema";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BookOpen, Clock, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { CourseCardImage } from "@/components/course-card-image";

// Format price with currency
function formatPrice(price: number, currency: string): string {
  const amount = currency === "VND" ? price : price / 100;
  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    VND: "₫",
    EUR: "€",
  };
  const symbol = currencySymbols[currency] || currency;

  return currency === "VND"
    ? `${amount.toLocaleString("vi-VN")} ${symbol}`
    : `${symbol}${amount.toFixed(2)}`;
}

export default async function CoursesPublicPage() {
  const { userId } = await auth();

  // Get all courses
  const allCourses = await db.select().from(courses).orderBy(asc(courses.id));

  // Get user enrollments if logged in
  let userEnrollments: number[] = [];
  if (userId) {
    const enrollments = await db
      .select({ courseId: courseEnrollments.courseId })
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId));
    userEnrollments = enrollments.map((e) => e.courseId);
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="overflow-hidden bg-[#f2f7f3]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.85fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Học theo mục tiêu, tiến bộ từng ngày
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Tìm khóa học phù hợp với{" "}
              <span className="text-emerald-700">hành trình của bạn.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Khám phá các khóa học IELTS, xem lộ trình và chọn điểm bắt đầu phù
              hợp với trình độ của bạn.
            </p>
            <a
              href="#courses"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-semibold text-white shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800"
            >
              Khám phá khóa học <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mx-auto w-full max-w-[500px]">
            <Image
              src="/illustrations/course-reading.svg"
              alt="Minh họa học viên đọc và luyện tập tiếng Anh"
              width={640}
              height={480}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>

      <div id="courses" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => (
            <Card
              key={course.id}
              className="h-full overflow-hidden border-slate-200 transition-shadow hover:shadow-xl"
            >
              <CardHeader>
                <Link
                  href={`/courses-public/${course.id}`}
                  aria-label={`Xem khóa học ${course.title}`}
                  className="relative mb-4 block h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100"
                >
                  <CourseCardImage src={course.imageSrc} alt={course.title} />
                </Link>
                <CardTitle className="text-2xl text-slate-950">
                  <Link
                    href={`/courses-public/${course.id}`}
                    className="transition-colors hover:text-emerald-700"
                  >
                    {course.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {course.description || "Khóa học IELTS chất lượng cao"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-sm text-gray-600">Học phí:</span>
                    <span className="text-xl font-bold text-green-600">
                      {course.isFree
                        ? "Miễn phí"
                        : formatPrice(course.price, course.currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Học theo lộ trình chuẩn</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Học mọi lúc, mọi nơi</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Hỗ trợ từ giáo viên</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/courses-public/${course.id}`}>Xem chi tiết</Link>
                </Button>
                {userId ? (
                  <div className="w-full">
                    <CourseEnrollButton
                      courseId={course.id}
                      isFree={course.isFree}
                      price={course.price}
                      currency={course.currency}
                      isEnrolled={userEnrollments.includes(course.id)}
                    />
                  </div>
                ) : (
                  <SignUpButton mode="modal">
                    <Button
                      className="w-full bg-emerald-700 hover:bg-emerald-800"
                      size="lg"
                    >
                      Đăng ký ngay
                    </Button>
                  </SignUpButton>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {allCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-500">
              Các khóa học sẽ sớm được cập nhật
            </p>
          </div>
        )}

        {/* CTA Section */}
        {!userId && allCourses.length > 0 && (
          <div className="mt-16 rounded-3xl bg-emerald-950 p-8 text-center text-white sm:p-10">
            <h2 className="mb-4 text-3xl font-bold">
              Sẵn sàng bắt đầu học?
            </h2>
            <p className="mb-6 text-lg opacity-90">
              Đăng ký ngay để truy cập tất cả khóa học và bắt đầu hành trình của bạn
            </p>
            <div className="flex justify-center gap-4">
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary">
                  Đăng ký miễn phí
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-green-600">
                  Đăng nhập
                </Button>
              </SignInButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
