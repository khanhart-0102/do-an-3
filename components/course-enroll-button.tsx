"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CourseEnrollButtonProps {
  courseId: number;
  isFree: boolean;
  price: number;
  currency?: string;
  isEnrolled?: boolean;
}

export function CourseEnrollButton({
  courseId,
  isFree,
  price,
  currency = "VND",
  isEnrolled = false,
}: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const displayPrice = currency === "VND" ? price : price / 100;

  const handleEnroll = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll");
      }

      if (data.isFree) {
        // Free course - enrolled directly
        toast.success("Đăng ký thành công!");
        router.push("/student");
        router.refresh();
      } else if (data.paymentId) {
        router.push(`/courses/payment/${data.paymentId}`);
      } else {
        throw new Error("Không nhận được thông tin thanh toán hợp lệ");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng ký khóa học"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        className="w-full"
        size="lg"
        onClick={() => router.push("/student")}
      >
        Vào học
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleEnroll}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          {isFree
            ? "Đăng ký miễn phí"
            : `Đăng ký - ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
              }).format(displayPrice)}`}
        </>
      )}
    </Button>
  );
}
