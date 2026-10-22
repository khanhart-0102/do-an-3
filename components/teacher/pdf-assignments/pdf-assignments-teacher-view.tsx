"use client";

import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface PdfAssignmentSubmission {
  id: number;
  userId: string;
  answerText: string | null;
  originalFileName: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  submittedAt: string;
  gradedAt: string | null;
  studentName: string | null;
  studentEmail: string | null;
}

interface PdfAssignment {
  id: number;
  title: string;
  description: string;
  exerciseFileName: string;
  exerciseFileUrl: string;
  submissions: PdfAssignmentSubmission[];
}

export function PdfAssignmentsTeacherView() {
  const [assignments, setAssignments] = useState<PdfAssignment[]>([]);
  const [grades, setGrades] = useState<
    Record<number, { score: string; feedback: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | number | null>(null);

  useEffect(() => {
    void fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/teacher/pdf-assignments");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tải bài tập.");
      }

      const loadedAssignments = data.assignments as PdfAssignment[];
      setAssignments(loadedAssignments);
      setGrades((current) => {
        const next = { ...current };
        for (const assignment of loadedAssignments) {
          for (const submission of assignment.submissions) {
            next[submission.id] ??= {
              score: submission.score?.toString() ?? "",
              feedback: submission.feedback ?? "",
            };
          }
        }
        return next;
      });
      setLoadError(null);
    } catch (error) {
      console.error("Error loading teacher PDF assignments:", error);
      const message =
        error instanceof Error ? error.message : "Không thể tải bài tập.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const saveGrade = async (submissionId: number) => {
    const grade = grades[submissionId] ?? { score: "", feedback: "" };
    const score = grade.score.trim() ? Number(grade.score) : null;
    if (score !== null && (!Number.isInteger(score) || score < 0 || score > 100)) {
      toast.error("Điểm phải là số nguyên từ 0 đến 100.");
      return;
    }

    setSavingId(submissionId);
    try {
      const response = await fetch(
        `/api/teacher/pdf-assignments/submissions/${submissionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score, feedback: grade.feedback }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể lưu kết quả.");
      }
      toast.success("Đã lưu điểm và nhận xét.");
      await fetchAssignments();
    } catch (error) {
      console.error("Error grading PDF assignment:", error);
      toast.error(error instanceof Error ? error.message : "Không thể lưu kết quả.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <p className="py-16 text-center text-slate-500" role="status">
        Đang tải bài tập...
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-[#f2f7f3] p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
          Khu vực giáo viên
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Bài tập PDF
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Xem file và câu trả lời học viên đã nộp, sau đó nhập điểm cùng nhận
          xét. Phần đáp án riêng sẽ được bổ sung sau.
        </p>
      </header>

      {loadError ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900"
          role="alert"
        >
          <p className="font-semibold">Không thể tải bài tập và bài nộp.</p>
          <p className="mt-1 text-sm">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchAssignments();
            }}
            className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Thử tải lại
          </button>
        </div>
      ) : null}

      {!loadError && assignments.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Chưa có bài tập PDF trong cơ sở dữ liệu. Hãy áp dụng migration{" "}
          <code>0004_pdf_assignments.sql</code> trước.
        </div>
      )}

      <div className="space-y-6">
        {assignments.map((assignment) => (
          <section
            key={assignment.id}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {assignment.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {assignment.submissions.length} bài nộp
                  </p>
                </div>
              </div>
              <a
                href={assignment.exerciseFileUrl}
                download={assignment.exerciseFileName}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                <Download className="h-4 w-4" />
                Xem đề PDF
              </a>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
              Có thể chấm trực tiếp dựa trên file bài làm và câu trả lời của học
              viên. Khu vực đáp án riêng chưa được bật theo yêu cầu.
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Bài học viên đã nộp</h3>
              {assignment.submissions.length === 0 ? (
                <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  Chưa có học viên nộp bài.
                </p>
              ) : (
                assignment.submissions.map((submission) => {
                  const grade = grades[submission.id] ?? {
                    score: "",
                    feedback: "",
                  };

                  return (
                    <article
                      key={submission.id}
                      className="space-y-3 rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {submission.studentName || "Học viên"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {submission.studentEmail || submission.userId}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Nộp lúc{" "}
                            {new Date(submission.submittedAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            submission.status === "GRADED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {submission.status === "GRADED" ? "Đã chấm" : "Chờ chấm"}
                        </span>
                      </div>

                      {submission.originalFileName && (
                        <a
                          href={`/api/teacher/pdf-assignments/submissions/${submission.id}/file`}
                          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                        >
                          <Download className="h-4 w-4" />
                          Tải bài làm: {submission.originalFileName}
                        </a>
                      )}
                      {submission.answerText && (
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                            Câu trả lời / ghi chú
                          </p>
                          <p className="whitespace-pre-wrap text-sm text-slate-800">
                            {submission.answerText}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                        <label className="text-sm font-medium text-slate-700">
                          Điểm / 100
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={grade.score}
                            onChange={(event) =>
                              setGrades((current) => ({
                                ...current,
                                [submission.id]: {
                                  ...grade,
                                  score: event.target.value,
                                },
                              }))
                            }
                            className="mt-1 w-full rounded-xl border border-slate-300 p-2"
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Nhận xét cho học viên
                          <textarea
                            value={grade.feedback}
                            onChange={(event) =>
                              setGrades((current) => ({
                                ...current,
                                [submission.id]: {
                                  ...grade,
                                  feedback: event.target.value,
                                },
                              }))
                            }
                            rows={2}
                            maxLength={5000}
                            className="mt-1 w-full rounded-xl border border-slate-300 p-2"
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => void saveGrade(submission.id)}
                        disabled={savingId === submission.id}
                        className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                      >
                        {savingId === submission.id
                          ? "Đang lưu..."
                          : "Lưu kết quả chấm"}
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
