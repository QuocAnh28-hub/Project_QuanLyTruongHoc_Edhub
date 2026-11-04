-- AlterTable
ALTER TABLE "eduhub"."student_classes" ADD COLUMN     "arrange_at" TIMESTAMP(3),
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;
