import type {
  ImageAnswerBox,
  ImageAnswerMetadata,
} from "@/shared/types/questionMetadata";

export function isImageAnswerMetadata(
  metadata: unknown
): metadata is ImageAnswerMetadata {
  if (!metadata || typeof metadata !== "object") {
    return false;
  }

  const value = metadata as Partial<ImageAnswerMetadata>;
  return value.imageAnswerMode === true && Array.isArray(value.imageAnswerBoxes);
}

export function parseImageAnswerPayload(
  value: unknown
): Record<string, string> | null {
  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const boxes = (parsed as { boxes?: unknown }).boxes;
  if (!boxes || typeof boxes !== "object" || Array.isArray(boxes)) {
    return null;
  }

  const answers: Record<string, string> = {};
  for (const [id, answer] of Object.entries(boxes)) {
    if (typeof answer !== "string") {
      return null;
    }
    answers[id] = answer;
  }

  return answers;
}

export function serializeImageAnswerPayload(
  answers: Record<string, string>
): string {
  return JSON.stringify({ boxes: answers });
}

export function gradeImageAnswers(
  answers: Record<string, string>,
  metadata: ImageAnswerMetadata,
  maxPoints: number
) {
  const boxes = metadata.imageAnswerBoxes;
  if (boxes.length === 0) {
    return { isCorrect: false, pointsEarned: 0 };
  }

  let correctCount = 0;
  for (const box of boxes) {
    const submitted = normalizeAnswer(answers[box.id] ?? "", metadata.caseSensitive);
    const acceptableAnswers = [
      box.correctAnswer ?? "",
      ...(box.acceptableAnswers ?? []),
    ].map((answer) => normalizeAnswer(answer, metadata.caseSensitive));

    if (submitted.length > 0 && acceptableAnswers.includes(submitted)) {
      correctCount++;
    }
  }

  const pointsEarned =
    Math.round((correctCount / boxes.length) * maxPoints * 100) / 100;

  return {
    isCorrect: correctCount === boxes.length,
    pointsEarned,
  };
}

export function stripImageAnswerKeys(metadata: unknown): unknown {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return metadata;
  }

  const value = metadata as { imageAnswerBoxes?: unknown };
  if (!Array.isArray(value.imageAnswerBoxes)) {
    return metadata;
  }

  return {
    ...metadata,
    imageAnswerBoxes: value.imageAnswerBoxes.map((box) => {
      if (!box || typeof box !== "object" || Array.isArray(box)) {
        return box;
      }

      const answerBox = box as ImageAnswerBox;
      return {
        id: answerBox.id,
        x: answerBox.x,
        y: answerBox.y,
        width: answerBox.width,
        height: answerBox.height,
      };
    }),
  };
}

function normalizeAnswer(answer: string, caseSensitive = false): string {
  const trimmed = answer.trim();
  return caseSensitive ? trimmed : trimmed.toLowerCase();
}
