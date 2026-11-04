/*
  Warnings:

  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eduhub"."user_roles" DROP CONSTRAINT "user_roles_role_code_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- DropTable
DROP TABLE "eduhub"."user_roles";

-- CreateTable
CREATE TABLE "eduhub"."user_permissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "eduhub"."user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."user_permissions" ADD CONSTRAINT "user_permissions_permission_code_fkey" FOREIGN KEY ("permission_code") REFERENCES "eduhub"."permissions"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
