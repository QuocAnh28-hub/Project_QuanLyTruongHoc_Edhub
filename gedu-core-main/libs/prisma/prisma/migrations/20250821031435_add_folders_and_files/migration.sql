-- CreateTable
CREATE TABLE "eduhub"."folders" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_name" TEXT NOT NULL,
    "issuing_authority" TEXT NOT NULL,
    "date_of_issue" TIMESTAMP(3),
    "record_number" TEXT,
    "type" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."files" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "folders_org_id_user_id_idx" ON "eduhub"."folders"("org_id", "user_id");

-- CreateIndex
CREATE INDEX "files_org_id_user_id_folder_id_idx" ON "eduhub"."files"("org_id", "user_id", "folder_id");

-- AddForeignKey
ALTER TABLE "eduhub"."files" ADD CONSTRAINT "files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "eduhub"."folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
