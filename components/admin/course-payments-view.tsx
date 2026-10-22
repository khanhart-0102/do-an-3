"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CoursePayment {
  id: number;
  userId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentReference: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  studentName: string | null;
  studentEmail: string | null;
}

export function AdminCoursePaymentsView() {
  const [payments, setPayments] = useState<CoursePayment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/course-payments", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách giao dịch");
      }
      setPayments(data.payments);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải danh sách giao dịch"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const reviewPayment = async (paymentId: number, action: "approve" | "reject") => {
    const confirmation =
      action === "approve"
        ? "Bạn đã đối soát thấy tiền vào tài khoản và đúng nội dung chuyển khoản?"
        : "Bạn chắc chắn muốn từ chối giao dịch này?";
    if (!window.confirm(confirmation)) return;

    setProcessingId(paymentId);
    setError("");
    try {
      const response = await fetch(`/api/admin/course-payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể cập nhật giao dịch");
      }
      await loadPayments();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Không thể cập nhật giao dịch"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700">
          <ArrowLeft className="h-4 w-4" />
          Trang quản trị
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Đối soát thanh toán khóa học</h1>
        <p className="mt-2 text-gray-600">
          Chỉ xác nhận sau khi kiểm tra giao dịch thực tế trong tài khoản ngân hàng.
        </p>

        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        {loading ? (
          <div className="flex items-center gap-2 py-12 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải giao dịch...
          </div>
        ) : payments.length === 0 ? (
          <p className="mt-8 rounded-xl border bg-white p-8 text-center text-gray-600">
            Chưa có giao dịch nào.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {payments.map((payment) => (
              <article key={payment.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-gray-900">{payment.courseTitle}</h2>
                    <p className="text-sm text-gray-600">
                      Học viên: {payment.studentName || payment.studentEmail || payment.userId}
                    </p>
                    {payment.studentEmail && <p className="text-sm text-gray-600">{payment.studentEmail}</p>}
                    <p className="font-mono text-sm font-bold text-green-800">
                      Nội dung: {payment.paymentReference || "Không có mã"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <p className="text-xl font-bold text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                    }`}>
                      {payment.status === "PENDING"
                        ? "Chờ xác nhận"
                        : payment.status === "COMPLETED"
                          ? "Đã xác nhận"
                          : payment.status === "REFUNDED"
                            ? "Đã hoàn tiền"
                            : "Đã từ chối"}
                    </span>
                    {payment.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          disabled={processingId === payment.id}
                          onClick={() => void reviewPayment(payment.id, "approve")}
                        >
                          {processingId === payment.id ? "Đang lưu..." : "Xác nhận đã nhận tiền"}
                        </button>
                        <button
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          disabled={processingId === payment.id}
                          onClick={() => void reviewPayment(payment.id, "reject")}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
