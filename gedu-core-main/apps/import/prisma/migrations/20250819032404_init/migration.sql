-- CreateTable
CREATE TABLE "imports"."import_jobs" (
    "id" TEXT NOT NULL,
    "org_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "result" JSONB,
    "total_lines" INTEGER NOT NULL DEFAULT 0,
    "processed_lines" INTEGER NOT NULL DEFAULT 0,
    "failed_lines" INTEGER NOT NULL DEFAULT 0,
    "error_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_jobs_org_id_idx" ON "imports"."import_jobs"("org_id");
