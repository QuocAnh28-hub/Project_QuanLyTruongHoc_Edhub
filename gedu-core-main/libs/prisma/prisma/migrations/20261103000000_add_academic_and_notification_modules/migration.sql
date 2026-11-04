-- CreateTable attendance_sessions
CREATE TABLE "eduhub"."attendance_sessions" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "shift" INTEGER NOT NULL DEFAULT 1,
    "period" INTEGER,
    "taken_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable attendance_records
CREATE TABLE "eduhub"."attendance_records" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable timetable_periods
CREATE TABLE "eduhub"."timetable_periods" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "shift" INTEGER NOT NULL DEFAULT 1,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "timetable_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable timetable_schedules
CREATE TABLE "eduhub"."timetable_schedules" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "school_year_id" INTEGER NOT NULL,
    "semester_id" INTEGER,
    "day_of_week" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "room_number" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timetable_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable teaching_assignments
CREATE TABLE "eduhub"."teaching_assignments" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "semester_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teaching_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable score_entries
CREATE TABLE "eduhub"."score_entries" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "score_type" INTEGER NOT NULL,
    "score_value" DOUBLE PRECISION,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable subject_semester_summaries
CREATE TABLE "eduhub"."subject_semester_summaries" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "average_score" DOUBLE PRECISION,
    "evaluation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_semester_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable student_edit_requests
CREATE TABLE "eduhub"."student_edit_requests" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "submitted_by" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "reviewed_by" INTEGER,
    "review_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_edit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable notifications
CREATE TABLE "eduhub"."notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes & Unique Constraints
CREATE UNIQUE INDEX "attendance_sessions_org_id_class_id_date_shift_period_key" ON "eduhub"."attendance_sessions"("org_id", "class_id", "date", "shift", "period");
CREATE INDEX "attendance_sessions_org_id_class_id_date_idx" ON "eduhub"."attendance_sessions"("org_id", "class_id", "date");

CREATE UNIQUE INDEX "attendance_records_session_id_student_id_key" ON "eduhub"."attendance_records"("session_id", "student_id");
CREATE INDEX "attendance_records_student_id_status_idx" ON "eduhub"."attendance_records"("student_id", "status");

CREATE UNIQUE INDEX "timetable_periods_org_id_period_shift_key" ON "eduhub"."timetable_periods"("org_id", "period", "shift");

CREATE UNIQUE INDEX "timetable_schedules_class_id_school_year_id_semester_id_day_key" ON "eduhub"."timetable_schedules"("class_id", "school_year_id", "semester_id", "day_of_week", "period");
CREATE INDEX "timetable_schedules_org_id_class_id_idx" ON "eduhub"."timetable_schedules"("org_id", "class_id");
CREATE INDEX "timetable_schedules_teacher_id_day_of_week_period_idx" ON "eduhub"."timetable_schedules"("teacher_id", "day_of_week", "period");

CREATE UNIQUE INDEX "teaching_assignments_class_id_subject_id_school_year_id_se_key" ON "eduhub"."teaching_assignments"("class_id", "subject_id", "school_year_id", "semester_id");
CREATE INDEX "teaching_assignments_org_id_staff_id_idx" ON "eduhub"."teaching_assignments"("org_id", "staff_id");

CREATE INDEX "score_entries_class_id_subject_id_semester_id_idx" ON "eduhub"."score_entries"("class_id", "subject_id", "semester_id");
CREATE INDEX "score_entries_student_id_subject_id_idx" ON "eduhub"."score_entries"("student_id", "subject_id");

CREATE UNIQUE INDEX "subject_semester_summaries_student_id_subject_id_school_yea_key" ON "eduhub"."subject_semester_summaries"("student_id", "subject_id", "school_year_id", "semester_id");

CREATE INDEX "student_edit_requests_org_id_status_idx" ON "eduhub"."student_edit_requests"("org_id", "status");

CREATE INDEX "notifications_user_id_is_read_idx" ON "eduhub"."notifications"("user_id", "is_read");

-- AddForeignKeys
ALTER TABLE "eduhub"."attendance_sessions" ADD CONSTRAINT "attendance_sessions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."attendance_sessions" ADD CONSTRAINT "attendance_sessions_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."attendance_sessions" ADD CONSTRAINT "attendance_sessions_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eduhub"."attendance_records" ADD CONSTRAINT "attendance_records_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "eduhub"."attendance_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."attendance_records" ADD CONSTRAINT "attendance_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eduhub"."timetable_periods" ADD CONSTRAINT "timetable_periods_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."timetable_schedules" ADD CONSTRAINT "timetable_schedules_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "eduhub"."semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."teaching_assignments" ADD CONSTRAINT "teaching_assignments_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "eduhub"."semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."score_entries" ADD CONSTRAINT "score_entries_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "eduhub"."semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "eduhub"."subject_semester_summaries" ADD CONSTRAINT "subject_semester_summaries_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "eduhub"."semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eduhub"."student_edit_requests" ADD CONSTRAINT "student_edit_requests_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eduhub"."student_edit_requests" ADD CONSTRAINT "student_edit_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eduhub"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

