/*
  Warnings:

  - You are about to drop the `authority_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_group_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school_authorities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school_positions_authorities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eduhub"."authority_permissions" DROP CONSTRAINT "authority_permissions_authority_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."authority_permissions" DROP CONSTRAINT "authority_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."permission_group_permissions" DROP CONSTRAINT "permission_group_permissions_group_code_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."permission_group_permissions" DROP CONSTRAINT "permission_group_permissions_permission_code_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."school_positions_authorities" DROP CONSTRAINT "school_positions_authorities_authority_id_fkey";

-- DropForeignKey
ALTER TABLE "eduhub"."school_positions_authorities" DROP CONSTRAINT "school_positions_authorities_position_id_fkey";

-- DropTable
DROP TABLE "eduhub"."authority_permissions";

-- DropTable
DROP TABLE "eduhub"."permission_group_permissions";

-- DropTable
DROP TABLE "eduhub"."permission_groups";

-- DropTable
DROP TABLE "eduhub"."permissions";

-- DropTable
DROP TABLE "eduhub"."school_authorities";

-- DropTable
DROP TABLE "eduhub"."school_positions_authorities";
