"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackImage = "/illustrations/practice-preview.svg";

type CourseCardImageProps = {
  src: string | null;
  alt: string;
};

export function CourseCardImage({ src, alt }: CourseCardImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = src && !hasError ? src : fallbackImage;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={imageSrc === fallbackImage ? "object-contain p-2" : "object-cover"}
      onError={() => setHasError(true)}
    />
  );
}
