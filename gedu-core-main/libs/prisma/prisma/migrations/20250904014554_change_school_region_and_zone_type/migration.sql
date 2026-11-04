/*
  Warnings:

  - The `region` column on the `school_operations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `zone` column on the `school_operations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "eduhub"."school_operations" DROP COLUMN "region",
ADD COLUMN     "region" INTEGER,
DROP COLUMN "zone",
ADD COLUMN     "zone" INTEGER;
