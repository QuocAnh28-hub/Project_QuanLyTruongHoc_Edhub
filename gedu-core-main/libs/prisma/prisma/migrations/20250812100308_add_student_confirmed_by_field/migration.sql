-- AlterTable
ALTER TABLE "eduhub"."students" ADD COLUMN     "is_confirmed_by" INTEGER;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_is_confirmed_by_fkey" FOREIGN KEY ("is_confirmed_by") REFERENCES "eduhub"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
