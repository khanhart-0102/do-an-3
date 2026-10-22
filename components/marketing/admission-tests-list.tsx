"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock3,
  Target,
} from "lucide-react";

interface AdmissionTest {
  id: number;
  title: string;
  description: string | null;
  imageSrc: string | null;
  duration: number;
  sections: Array<{
    id: number;
    title: string;
    skillType: string;
    questions: Array<{
      id: number;
    }>;
  }>;
}

export function AdmissionTestsList() {
  const router = useRouter();
  const [tests, setTests] = useState<AdmissionTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchAdmissionTests();
  }, []);

  const fetchAdmissionTests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admission-tests");
      if (!response.ok) {
        throw new Error(`Failed to fetch admission tests (${response.status})`);
      }
      const data = await response.json();
      setTests(data.tests || []);
      setHasError(false);
    } catch (error) {
      console.error("Error fetching admission tests:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId: number) => {
    try {
      // Redirect to test page - the test page will handle starting the test
      router.push(`/admission-test/${testId}`);
    } catch (error) {
      console.error("Error starting test:", error);
      alert("Failed to start test. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-emerald-800"
        role="status"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
        <p className="text-sm font-medium">Đang tải bài kiểm tra...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center"
        role="alert"
      >
        <AlertCircle className="mx-auto h-9 w-9 text-rose-600" />
        <h3 className="mt-4 text-lg font-bold text-slate-900">
          Không thể tải bài kiểm tra
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Vui lòng thử tải lại trang sau ít phút.
        </p>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
          <BookOpen className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-900">
          Chưa có bài kiểm tra đầu vào
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Các bài kiểm tra mới sẽ được cập nhật tại đây. Bạn có thể khám phá
          khóa học trong lúc chờ đợi.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {tests.map((test) => {
        const totalQuestions = test.sections.reduce(
          (sum, section) => sum + section.questions.length,
          0
        );

        const readingSections = test.sections.filter((s) => s.skillType === "READING");
        const listeningSections = test.sections.filter((s) => s.skillType === "LISTENING");

        return (
          <Card
            key={test.id}
            className="overflow-hidden rounded-3xl border-slate-200 transition-shadow hover:shadow-xl"
          >
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">{test.title}</CardTitle>
              <CardDescription className="leading-6">
                {test.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Clock3 className="h-4 w-4 text-emerald-700" />
                  <span>{test.duration} phút</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-700" />
                  <span>{totalQuestions} câu hỏi</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Target className="h-4 w-4 text-emerald-700" />
                  <span>Kỹ năng được kiểm tra</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {readingSections.length > 0 && (
                    <span className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-800">
                      Reading · {readingSections.reduce((sum, s) => sum + s.questions.length, 0)} câu
                    </span>
                  )}
                  {listeningSections.length > 0 && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      Listening · {listeningSections.reduce((sum, s) => sum + s.questions.length, 0)} câu
                    </span>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleStartTest(test.id)}
                className="w-full gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800"
                size="lg"
              >
                Bắt đầu kiểm tra <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-xs leading-5 text-slate-500">
                Dùng kết quả để xác định nội dung nên luyện tập tiếp theo.
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
