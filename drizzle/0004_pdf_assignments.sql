CREATE TABLE "pdf_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"exercise_file_name" text NOT NULL,
	"exercise_file_url" text NOT NULL,
	"answer_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pdf_assignments_exercise_file_url_unique" ON "pdf_assignments" USING btree ("exercise_file_url");
--> statement-breakpoint
CREATE TABLE "pdf_assignment_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"assignment_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"answer_text" text,
	"storage_name" text,
	"original_file_name" text,
	"score" integer,
	"feedback" text,
	"status" "submission_status" DEFAULT 'PENDING' NOT NULL,
	"graded_by" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"graded_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "pdf_assignment_submissions" ADD CONSTRAINT "pdf_assignment_submissions_assignment_id_pdf_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."pdf_assignments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pdf_assignment_submissions" ADD CONSTRAINT "pdf_assignment_submissions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pdf_assignment_submissions" ADD CONSTRAINT "pdf_assignment_submissions_graded_by_users_user_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "pdf_assignments" ("title", "description", "exercise_file_name", "exercise_file_url") VALUES
	('Bài tập câu bị động thì quá khứ tiếp diễn', 'Tải đề PDF về, hoàn thành bài tập rồi nộp file bài làm tại đây.', 'Bài tập câu bị động thì quá khứ tiếp diễn.pdf', '/assignments/passive-voice/passive-past-continuous.pdf'),
	('Bài tập câu bị động thì quá khứ hoàn thành', 'Tải đề PDF về, hoàn thành bài tập rồi nộp file bài làm tại đây.', 'Bài tập câu bị động thì quá khứ hoàn thành.pdf', '/assignments/passive-voice/passive-past-perfect.pdf'),
	('Bài tập câu bị động thì quá khứ đơn', 'Tải đề PDF về, hoàn thành bài tập rồi nộp file bài làm tại đây.', 'Bài tập câu bị động thì quá khứ đơn.pdf', '/assignments/passive-voice/passive-past-simple.pdf'),
	('Bài tập câu bị động thì hiện tại hoàn thành', 'Tải đề PDF về, hoàn thành bài tập rồi nộp file bài làm tại đây.', 'Bài tập câu bị động thì hiện tại hoàn thành.pdf', '/assignments/passive-voice/passive-present-perfect.pdf'),
	('Bài tập ngữ pháp tiếng Anh', 'Tải đề PDF về, hoàn thành bài tập rồi nộp file bài làm tại đây.', 'Bài tập ngữ pháp tiếng Anh.pdf', '/assignments/passive-voice/english-grammar-exercises.pdf');
