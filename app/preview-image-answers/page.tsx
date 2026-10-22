"use client";

import { useState } from "react";
import { ImageAnswerBoxesEditor } from "@/components/teacher/tests/image-answer-boxes-editor";
import { ImageAnswerInput } from "@/components/student/question-inputs/image-answer-input";
import type { ImageAnswerMetadata } from "@/shared/types/questionMetadata";

const previewImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="560" viewBox="0 0 1000 560">
    <rect width="1000" height="560" fill="#fffdf7"/>
    <rect x="24" y="24" width="952" height="512" rx="12" fill="none" stroke="#d1d5db" stroke-width="2"/>
    <text x="64" y="88" font-family="Arial,sans-serif" font-size="32" font-weight="700" fill="#172554">ENGLISH PLACEMENT TEST</text>
    <text x="64" y="126" font-family="Arial,sans-serif" font-size="19" fill="#475569">Complete the form. Write ONE WORD for each answer.</text>
    <line x1="64" y1="148" x2="936" y2="148" stroke="#cbd5e1" stroke-width="2"/>
    <text x="64" y="204" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#1e293b">Student information</text>
    <text x="88" y="270" font-family="Arial,sans-serif" font-size="21" fill="#334155">1. Full name:</text>
    <line x1="260" y1="278" x2="720" y2="278" stroke="#64748b" stroke-width="2"/>
    <text x="88" y="346" font-family="Arial,sans-serif" font-size="21" fill="#334155">2. Favourite subject:</text>
    <line x1="310" y1="354" x2="720" y2="354" stroke="#64748b" stroke-width="2"/>
    <text x="64" y="470" font-family="Arial,sans-serif" font-size="16" fill="#64748b">Answer directly in the blue boxes.</text>
  </svg>`);

const initialMetadata: ImageAnswerMetadata = {
  imageAnswerMode: true,
  imageAnswerBoxes: [
    {
      id: "demo-name",
      x: 27,
      y: 43,
      width: 43,
      height: 8,
      correctAnswer: "Linh Nguyen",
    },
    {
      id: "demo-subject",
      x: 32,
      y: 57,
      width: 39,
      height: 8,
      correctAnswer: "English",
    },
  ],
};

export default function ImageAnswersPreviewPage() {
  const [metadata, setMetadata] = useState(initialMetadata);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Bản xem trước giao diện
          </p>
          <h1 className="text-3xl font-bold">
            Bài kiểm tra có ô trả lời trực tiếp trên ảnh
          </h1>
          <p className="max-w-3xl text-slate-600">
            Bên trái là màn hình giáo viên đặt vị trí và đáp án; bên phải là
            phần học viên nhìn thấy khi làm bài.
          </p>
        </header>

        <div className="grid items-start gap-6 xl:grid-cols-2">
          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">1. Giáo viên cấu hình</h2>
              <p className="mt-1 text-sm text-slate-600">
                Bấm vào ảnh để thêm ô, nhập đáp án đúng và tinh chỉnh tọa độ.
              </p>
            </div>
            <ImageAnswerBoxesEditor
              imageSrc={previewImage}
              metadata={metadata}
              onChange={setMetadata}
            />
          </section>

          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">2. Học viên làm bài</h2>
              <p className="mt-1 text-sm text-slate-600">
                Ô màu xanh nằm trực tiếp trên ảnh và có thể nhập câu trả lời.
              </p>
            </div>
            <ImageAnswerInput
              imageSrc={previewImage}
              metadata={metadata}
              value=""
              onAnswerChange={() => undefined}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
