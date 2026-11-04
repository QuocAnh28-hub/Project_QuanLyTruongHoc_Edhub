-- CreateTable
CREATE TABLE "eduhub"."pioneers_unions_parties" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "young_pioneer_admission_date" TIMESTAMP(3),
    "youth_union_admission_date" TIMESTAMP(3),
    "communist_party_admission_date" TIMESTAMP(3),
    "start_military_service_date" TIMESTAMP(3),
    "end_military_service_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "pioneers_unions_parties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pioneers_unions_parties_personal_id_key" ON "eduhub"."pioneers_unions_parties"("personal_id");

-- AddForeignKey
ALTER TABLE "eduhub"."pioneers_unions_parties" ADD CONSTRAINT "pioneers_unions_parties_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
