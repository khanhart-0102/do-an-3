"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  answerText: string | null;
  originalFileName: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  submittedAt: string;
  gradedAt: string | null;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  exerciseFileName: string;
  exerciseFileUrl: string;
  latestSubmission: AssignmentSubmission | null;
}

export function StudentPdfAssignmentsView() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/student/pdf-assignments");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách bài tập.");
      }
      const data = (await response.json()) as { assignments: Assignment[] };
      setAssignments(data.assignments);
      setLoadError(null);
    } catch (error) {
      console.error("Error loading PDF assignments:", error);
      const message =
        error instanceof Error ? error.message : "Không thể tải bài tập.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (
    event: React.FormEvent<HTMLFormElement>,
    assignment: Assignment
  ) => {
    event.preventDefault();
    const formData = new FormData();
    const file = files[assignment.id];
    const answerText = answerTexts[assignment.id]?.trim() ?? "";

    if (file) {
      formData.set("file", file);
    }
    formData.set("answerText", answerText);
    setSubmittingId(assignment.id);

    try {
      const response = await fetch(
        `/api/student/pdf-assignments/${assignment.id}/submissions`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Nộp bài thất bại.");
      }

      toast.success("Đã nộp bài. Giáo viên sẽ kiểm tra và phản hồi.");
      setFiles((current) => ({ ...current, [assignment.id]: null }));
      setAnswerTexts((current) => ({ ...current, [assignment.id]: "" }));
      await fetchAssignments();
    } catch (error) {
      console.error("Error submitting PDF assignment:", error);
      toast.error(error instanceof Error ? error.message : "Nộp bài thất bại.");
    } finally {
      setSubmittingId(null);
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
          Luyện tập theo nhịp riêng
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Bài tập PDF
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Tải đề về làm trên máy hoặc in ra, sau đó nộp file PDF, ảnh bài làm
          hoặc ghi câu trả lời tại đây. Giáo viên sẽ xem và phản hồi cho bạn.
        </p>
      </header>

      {loadError ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900"
          role="alert"
        >
          <p className="font-semibold">Không thể tải danh sách bài tập.</p>
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

      {!loadError && assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Hiện chưa có bài tập nào. Vui lòng quay lại sau.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {assignments.map((assignment) => (
          <article
            key={assignment.id}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-950">
                  {assignment.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {assignment.description}
                </p>
              </div>
            </div>

            <a
              href={assignment.exerciseFileUrl}
              download={assignment.exerciseFileName}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              <Download className="h-4 w-4" />
              Tải đề PDF
            </a>

            <form
              onSubmit={(event) => void submitAssignment(event, assignment)}
              className="space-y-4 border-t border-slate-100 pt-4"
            >
              <label className="block text-sm font-semibold text-slate-800">
                File bài làm (PDF, JPG, PNG hoặc WEBP; tối đa 15 MB)
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setFiles((current) => ({
                      ...current,
                      [assignment.id]: event.target.files?.[0] ?? null,
                    }))
                  }
                  className="mt-2 block w-full rounded-xl border border-slate-300 p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-800"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-800">
                Ghi chú hoặc câu trả lời (không bắt buộc)
                <textarea
                  value={answerTexts[assignment.id] ?? ""}
                  onChange={(event) =>
                    setAnswerTexts((current) => ({
                      ...current,
                      [assignment.id]: event.target.value,
                    }))
                  }
                  maxLength={10000}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm"
                  placeholder="Bạn có thể ghi lời giải tại đây hoặc đính kèm file bài làm."
                />
              </label>

              <button
                type="submit"
                disabled={
                  submittingId === assignment.id ||
                  (!files[assignment.id] && !answerTexts[assignment.id]?.trim())
                }
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {submittingId === assignment.id ? "Đang nộp..." : "Nộp bài"}
              </button>
            </form>

            {assignment.latestSubmission && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-800">
                    Bài nộp gần nhất:{" "}
                    {assignment.latestSubmission.status === "GRADED"
                      ? "Đã được chấm"
                      : "Đang chờ giáo viên"}
                  </p>
                  <span                   className="text-slate-500">
                    {new Date(
                      assignment.latestSubmission.submittedAt
                    ).toLocaleString("vi-VN")}
                  </span>
                </div>
                {assignment.latestSubmission.originalFileName && (
                  <p className="mt-1 text-slate-600">
                    File: {assignment.latestSubmission.originalFileName}
                  </p>
                )}
                {assignment.latestSubmission.score !== null && (
                  <p className="mt-2 font-semibold text-emerald-800">
                    Điểm: {assignment.latestSubmission.score}/100
                  </p>
                )}
                {assignment.latestSubmission.feedback && (
                  <p className="mt-2 whitespace-pre-wrap text-slate-700">
                    Nhận xét: {assignment.latestSubmission.feedback}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
