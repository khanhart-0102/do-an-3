import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StudentPdfAssignmentsView } from "@/components/student/pdf-assignments/student-pdf-assignments-view";

export default async function StudentPdfAssignmentsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <StudentPdfAssignmentsView />
    </div>
  );
}
