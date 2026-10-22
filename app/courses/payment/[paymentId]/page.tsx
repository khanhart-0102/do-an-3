import { BankTransferPaymentView } from "@/components/payments/bank-transfer-payment-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursePaymentPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { paymentId } = await params;
  return <BankTransferPaymentView paymentId={paymentId} />;
}
