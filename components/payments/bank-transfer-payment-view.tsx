"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Loader2 } from "lucide-react";

interface PaymentDetails {
  id: number;
  amount: number;
  currency: string;
  paymentReference: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  courseTitle: string;
  bank: {
    bankBin: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  qrUrl: string;
}

export function BankTransferPaymentView({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPayment = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/payments/${paymentId}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tải thông tin thanh toán");
      }
      setPayment(data);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải thông tin thanh toán"
      );
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    void loadPayment();
    const interval = window.setInterval(() => {
      void loadPayment();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [loadPayment]);

  useEffect(() => {
    if (payment?.status === "COMPLETED") {
      router.refresh();
    }
  }, [payment?.status, router]);

  const amount = payment
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: payment.currency,
        maximumFractionDigits: 0,
      }).format(payment.amount)
    : "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl border border-green-100 bg-white p-6 shadow-lg sm:p-8">
        <Link
          href="/courses-public"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách khóa học
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Thanh toán chuyển khoản</h1>
        {loading && !payment ? (
          <div className="flex items-center gap-2 py-12 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải thông tin thanh toán...
          </div>
        ) : error ? (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        ) : payment ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-gray-600">Khóa học</p>
              <p className="font-semibold text-gray-900">{payment.courseTitle}</p>
              <p className="mt-3 text-sm text-gray-600">Số tiền cần chuyển</p>
              <p className="text-2xl font-bold text-green-700">{amount}</p>
            </div>

            {payment.status === "PENDING" ? (
              <div className="grid gap-6 sm:grid-cols-[220px_1fr] sm:items-center">
                <Image
                  src={payment.qrUrl}
                  alt={`Mã QR thanh toán ${payment.courseTitle}`}
                  width={224}
                  height={224}
                  unoptimized
                  className="mx-auto aspect-square w-56 rounded-lg border bg-white p-2"
                />
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Quét mã bằng ứng dụng ngân hàng</p>
                  <p>Ngân hàng: <strong>{payment.bank.bankName}</strong></p>
                  <p>Số tài khoản: <strong>{payment.bank.accountNumber}</strong></p>
                  <p>Chủ tài khoản: <strong>{payment.bank.accountName}</strong></p>
                  <p>Nội dung chuyển khoản:</p>
                  <p className="select-all rounded-lg bg-gray-100 p-3 font-mono font-bold text-gray-900">
                    {payment.paymentReference}
                  </p>
                  <p className="text-xs text-amber-700">
                    Hãy chuyển đúng số tiền và giữ nguyên nội dung để admin đối soát.
                    Quyền học sẽ được cấp sau khi xác nhận giao dịch.
                  </p>
                </div>
              </div>
            ) : payment.status === "COMPLETED" ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
                <CheckCircle2 className="mb-2 h-7 w-7" />
                <p className="font-semibold">Thanh toán đã được xác nhận.</p>
                <Link href="/student" className="mt-3 inline-block font-medium underline">
                  Vào khu vực học viên
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
                <Clock3 className="mb-2 h-7 w-7" />
                <p className="font-semibold">Yêu cầu thanh toán này chưa được duyệt.</p>
                <p className="mt-1 text-sm">
                  Vui lòng liên hệ quản trị viên nếu bạn đã chuyển khoản.
                </p>
              </div>
            )}

            {payment.status === "PENDING" && (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Trang tự kiểm tra trạng thái thanh toán mỗi 5 giây.
              </p>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
