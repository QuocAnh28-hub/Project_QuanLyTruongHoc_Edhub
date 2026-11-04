-- CreateTable
CREATE TABLE "eduhub"."qualifications_competences" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "highest_academic_qualification" TEXT,
    "professional_qualification" TEXT,
    "field_of_study" TEXT,
    "foreign_language_skill" TEXT,
    "it_skill" TEXT,
    "political_theory_qualification" TEXT,
    "edu_management_qualification" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "qualifications_competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."training_development_history" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "training_development_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."personal_achievements" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "personal_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."personal_work_history" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3),
    "org_name" TEXT NOT NULL,
    "positions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "personal_work_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qualifications_competences_personal_id_key" ON "eduhub"."qualifications_competences"("personal_id");

-- AddForeignKey
ALTER TABLE "eduhub"."qualifications_competences" ADD CONSTRAINT "qualifications_competences_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."training_development_history" ADD CONSTRAINT "training_development_history_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personal_achievements" ADD CONSTRAINT "personal_achievements_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personal_work_history" ADD CONSTRAINT "personal_work_history_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
