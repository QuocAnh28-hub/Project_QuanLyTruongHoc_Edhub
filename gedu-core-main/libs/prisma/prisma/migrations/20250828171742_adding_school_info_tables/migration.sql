/*
  Warnings:

  - You are about to drop the column `is_border_or_island_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_especially_difficult_area` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_ethnic_boarding_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_ethnic_day_boarding_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_national_standard_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_remote_or_mountainous_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_school_for_gifted` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `is_special_education_school` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `national_standard_status` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the `campuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school_awards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eduhub"."campuses" DROP CONSTRAINT "campuses_org_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."school_awards" DROP CONSTRAINT "school_awards_org_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."school_profiles" DROP CONSTRAINT "school_profiles_org_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."school_staffs_union_infos" DROP CONSTRAINT "fk_school";

-- DropForeignKey
ALTER TABLE "eduhub"."school_staffs_union_infos" DROP CONSTRAINT "fk_staff";

-- AlterTable
ALTER TABLE "eduhub"."school_staffs_union_infos" ALTER COLUMN "date_of_joining_union" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "date_of_joining_party" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "date_of_enlistment" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "date_of_discharge" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "eduhub"."schools" DROP COLUMN "is_border_or_island_school",
DROP COLUMN "is_especially_difficult_area",
DROP COLUMN "is_ethnic_boarding_school",
DROP COLUMN "is_ethnic_day_boarding_school",
DROP COLUMN "is_national_standard_school",
DROP COLUMN "is_remote_or_mountainous_school",
DROP COLUMN "is_school_for_gifted",
DROP COLUMN "is_special_education_school",
DROP COLUMN "national_standard_status",
ADD COLUMN     "date_founded" TIMESTAMP(3),
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "principal_email" TEXT,
ADD COLUMN     "principal_is_party_member" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "project" TEXT,
ADD COLUMN     "ranking" INTEGER;

-- DropTable
DROP TABLE "eduhub"."campuses";

-- DropTable
DROP TABLE "eduhub"."school_awards";

-- DropTable
DROP TABLE "eduhub"."school_profiles";

-- CreateTable
CREATE TABLE "eduhub"."school_campuses" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "province_id" INTEGER,
    "ward_id" INTEGER,
    "hotline" TEXT,
    "total_area" DECIMAL(65,30),
    "distance" INTEGER,
    "means_of_transportation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_operations" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "national_standard_status" INTEGER NOT NULL DEFAULT 0,
    "region" TEXT,
    "zone" TEXT,
    "has_students_with_disabilities" BOOLEAN NOT NULL DEFAULT false,
    "has_life_skills_education" BOOLEAN NOT NULL DEFAULT false,
    "has_basic_education_program" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_facilities" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "total_area" DECIMAL(65,30),
    "has_minimum_teaching_equipment" BOOLEAN NOT NULL DEFAULT false,
    "has_computers" BOOLEAN NOT NULL DEFAULT false,
    "has_internet_access" BOOLEAN NOT NULL DEFAULT false,
    "has_power_grid" BOOLEAN NOT NULL DEFAULT false,
    "has_clean_water_source" BOOLEAN NOT NULL DEFAULT false,
    "has_restrooms" BOOLEAN NOT NULL DEFAULT false,
    "has_clean_hygiene_education_program" BOOLEAN NOT NULL DEFAULT false,
    "has_accessible_infra_students_with_disabilities" BOOLEAN NOT NULL DEFAULT false,
    "has_student_service_unit" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_operations_school_id_key" ON "eduhub"."school_operations"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_facilities_school_id_key" ON "eduhub"."school_facilities"("school_id");

-- AddForeignKey
ALTER TABLE "eduhub"."school_campuses" ADD CONSTRAINT "school_campuses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_campuses" ADD CONSTRAINT "school_campuses_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "eduhub"."wards_communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_campuses" ADD CONSTRAINT "school_campuses_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_operations" ADD CONSTRAINT "school_operations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_facilities" ADD CONSTRAINT "school_facilities_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_union_infos" ADD CONSTRAINT "school_staffs_union_infos_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_union_infos" ADD CONSTRAINT "school_staffs_union_infos_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "eduhub"."idx_school_union_infos_org" RENAME TO "school_staffs_union_infos_org_id_idx";
