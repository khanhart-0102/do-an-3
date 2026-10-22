import { redirect } from "next/navigation";
import { getIsAdmin } from "@/lib/admin";
import { AdminCoursePaymentsView } from "@/components/admin/course-payments-view";

export default async function AdminCoursePaymentsPage() {
  if (!(await getIsAdmin())) {
    redirect("/");
  }

  return <AdminCoursePaymentsView />;
}
