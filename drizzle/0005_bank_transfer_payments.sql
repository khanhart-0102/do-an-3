ALTER TABLE "course_payments"
  ADD COLUMN IF NOT EXISTS "payment_method" text NOT NULL DEFAULT 'STRIPE',
  ADD COLUMN IF NOT EXISTS "payment_reference" text,
  ADD COLUMN IF NOT EXISTS "reviewed_by" text,
  ADD COLUMN IF NOT EXISTS "reviewed_at" timestamp;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "course_payments_payment_reference_unique"
  ON "course_payments" ("payment_reference");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "course_payments"
    ADD CONSTRAINT "course_payments_reviewed_by_users_user_id_fk"
    FOREIGN KEY ("reviewed_by") REFERENCES "users"("user_id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
