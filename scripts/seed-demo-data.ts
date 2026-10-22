import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedDemoData() {
  const [{ default: db }, schema, { eq }] = await Promise.all([
    import("../db/drizzle"),
    import("../db/schema"),
    import("drizzle-orm"),
  ]);

  const demoCourses = [
    {
      title: "DEMO - IELTS Foundation",
      imageSrc: "/illustrations/course-reading.svg",
      description: "Khóa học dữ liệu mẫu để xem giao diện và luồng đăng ký.",
      examType: "IELTS" as const,
      level: "BEGINNER" as const,
      price: 0,
      currency: "VND",
      isFree: true,
      createdBy: "demo-seed",
    },
    {
      title: "DEMO - IELTS Speaking Practice",
      imageSrc: "/illustrations/course-speaking.svg",
      description: "Khóa học mẫu dành cho việc trình diễn giao diện học tập.",
      examType: "IELTS" as const,
      level: "INTERMEDIATE" as const,
      price: 0,
      currency: "VND",
      isFree: true,
      createdBy: "demo-seed",
    },
  ];

  for (const course of demoCourses) {
    const existing = await db.query.courses.findFirst({
      where: eq(schema.courses.title, course.title),
      columns: { id: true },
    });
    if (!existing) {
      await db.insert(schema.courses).values(course);
    }
  }

  const assignments = [
    {
      title: "Bài tập câu bị động thì quá khứ tiếp diễn",
      exerciseFileName: "Bài tập câu bị động thì quá khứ tiếp diễn.pdf",
      exerciseFileUrl: "/assignments/passive-voice/passive-past-continuous.pdf",
    },
    {
      title: "Bài tập câu bị động thì quá khứ hoàn thành",
      exerciseFileName: "Bài tập câu bị động thì quá khứ hoàn thành.pdf",
      exerciseFileUrl: "/assignments/passive-voice/passive-past-perfect.pdf",
    },
    {
      title: "Bài tập câu bị động thì quá khứ đơn",
      exerciseFileName: "Bài tập câu bị động thì quá khứ đơn.pdf",
      exerciseFileUrl: "/assignments/passive-voice/passive-past-simple.pdf",
    },
    {
      title: "Bài tập câu bị động thì hiện tại hoàn thành",
      exerciseFileName: "Bài tập câu bị động thì hiện tại hoàn thành.pdf",
      exerciseFileUrl: "/assignments/passive-voice/passive-present-perfect.pdf",
    },
    {
      title: "Bài tập ngữ pháp tiếng Anh",
      exerciseFileName: "Bài tập ngữ pháp tiếng Anh.pdf",
      exerciseFileUrl: "/assignments/passive-voice/english-grammar-exercises.pdf",
    },
  ];

  for (const assignment of assignments) {
    const existing = await db.query.pdfAssignments.findFirst({
      where: eq(schema.pdfAssignments.exerciseFileUrl, assignment.exerciseFileUrl),
      columns: { id: true },
    });
    if (!existing) {
      await db.insert(schema.pdfAssignments).values({
        ...assignment,
        description: "Dữ liệu bài tập mẫu; học viên có thể tải đề và nộp bài.",
        answerKey: null,
      });
    }
  }

  console.log("Demo seed completed. Existing courses and assignments were left unchanged.");
}

seedDemoData().catch((error: unknown) => {
  console.error(
    "Demo seed failed:",
    error instanceof Error ? error.message : String(error)
  );
  process.exitCode = 1;
});
