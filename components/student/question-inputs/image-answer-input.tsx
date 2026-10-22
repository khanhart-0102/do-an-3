"use client";

import {
  isImageAnswerMetadata,
  parseImageAnswerPayload,
  serializeImageAnswerPayload,
} from "@/lib/utils/image-answer";

interface ImageAnswerInputProps {
  imageSrc: string;
  metadata: unknown;
  value?: string;
  onAnswerChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageAnswerInput({
  imageSrc,
  metadata,
  value = "",
  onAnswerChange,
  disabled = false,
}: ImageAnswerInputProps) {
  if (!isImageAnswerMetadata(metadata)) {
    return null;
  }

  const answers = parseImageAnswerPayload(value) ?? {};

  const updateAnswer = (boxId: string, answer: string) => {
    onAnswerChange(
      serializeImageAnswerPayload({
        ...answers,
        [boxId]: answer,
      })
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Điền câu trả lời vào các ô được đánh dấu trên ảnh.
      </p>
      <div className="relative mx-auto w-full">
        <img
          src={imageSrc}
          alt="Đề bài"
          className="block h-auto w-full rounded-lg border border-gray-300"
        />
        {metadata.imageAnswerBoxes.map((box, index) => (
          <input
            key={box.id}
            type="text"
            value={answers[box.id] ?? ""}
            onChange={(event) => updateAnswer(box.id, event.target.value)}
            disabled={disabled}
            aria-label={`Câu trả lời ô ${index + 1}`}
            placeholder={String(index + 1)}
            className="absolute min-h-6 min-w-8 rounded border-2 border-blue-500 bg-white/95 px-1 text-center text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
