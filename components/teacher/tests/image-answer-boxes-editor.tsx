"use client";

import type {
  ImageAnswerBox,
  ImageAnswerMetadata,
} from "@/shared/types/questionMetadata";

interface ImageAnswerBoxesEditorProps {
  imageSrc: string;
  metadata: ImageAnswerMetadata;
  onChange: (metadata: ImageAnswerMetadata) => void;
}

export function ImageAnswerBoxesEditor({
  imageSrc,
  metadata,
  onChange,
}: ImageAnswerBoxesEditorProps) {
  const addBoxAt = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(80, ((event.clientX - bounds.left) / bounds.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(90, ((event.clientY - bounds.top) / bounds.height) * 100)
    );
    const box: ImageAnswerBox = {
      id: `box-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: roundCoordinate(x),
      y: roundCoordinate(y),
      width: 20,
      height: 3,
      correctAnswer: "",
    };

    onChange({
      ...metadata,
      imageAnswerBoxes: [...metadata.imageAnswerBoxes, box],
    });
  };

  const updateBox = (id: string, updates: Partial<ImageAnswerBox>) => {
    onChange({
      ...metadata,
      imageAnswerBoxes: metadata.imageAnswerBoxes.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      ),
    });
  };

  const removeBox = (id: string) => {
    onChange({
      ...metadata,
      imageAnswerBoxes: metadata.imageAnswerBoxes.filter((box) => box.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900">Đặt ô trả lời trên ảnh</h3>
        <p className="mt-1 text-sm text-gray-600">
          Bấm vào ảnh để thêm ô. Sau đó nhập đáp án đúng và tinh chỉnh vị trí,
          kích thước ở danh sách bên dưới.
        </p>
      </div>

      <div
        className="relative mx-auto w-full cursor-crosshair"
        onClick={addBoxAt}
      >
        <img
          src={imageSrc}
          alt="Ảnh đề để cấu hình ô trả lời"
          className="block h-auto w-full rounded-lg border border-gray-300"
        />
        {metadata.imageAnswerBoxes.map((box, index) => (
          <span
            key={box.id}
            className="pointer-events-none absolute flex min-h-6 min-w-8 items-center justify-center rounded border-2 border-red-500 bg-white/80 px-1 text-xs font-bold text-red-700"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            {index + 1}
          </span>
        ))}
      </div>

      {metadata.imageAnswerBoxes.length === 0 ? (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Chưa có ô trả lời. Bấm lên ảnh để thêm ô đầu tiên.
        </p>
      ) : (
        <div className="space-y-3">
          {metadata.imageAnswerBoxes.map((box, index) => (
            <div
              key={box.id}
              className="space-y-3 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">Ô trả lời {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeBox(box.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Xóa ô
                </button>
              </div>
              <label className="block text-sm text-gray-700">
                Đáp án đúng
                <input
                  value={box.correctAnswer ?? ""}
                  onChange={(event) =>
                    updateBox(box.id, { correctAnswer: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <CoordinateInput
                  label="Trái (%)"
                  value={box.x}
                  onChange={(x) =>
                    updateBox(box.id, {
                      x,
                      width: Math.min(box.width, 100 - x),
                    })
                  }
                />
                <CoordinateInput
                  label="Trên (%)"
                  value={box.y}
                  onChange={(y) =>
                    updateBox(box.id, {
                      y,
                      height: Math.min(box.height, 100 - y),
                    })
                  }
                />
                <CoordinateInput
                  label="Rộng (%)"
                  value={box.width}
                  minValue={1}
                  onChange={(width) =>
                    updateBox(box.id, { width: Math.min(width, 100 - box.x) })
                  }
                />
                <CoordinateInput
                  label="Cao (%)"
                  value={box.height}
                  minValue={1}
                  onChange={(height) =>
                    updateBox(box.id, { height: Math.min(height, 100 - box.y) })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CoordinateInput({
  label,
  value,
  onChange,
  minValue = 0,
}: {
  label: string;
  value: number;
  minValue?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-sm text-gray-700">
      {label}
      <input
        type="number"
        min={minValue}
        max={100}
        step={0.5}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) {
            onChange(Math.max(minValue, Math.min(100, parsed)));
          }
        }}
        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-2"
      />
    </label>
  );
}

function roundCoordinate(value: number): number {
  return Math.round(value * 10) / 10;
}
