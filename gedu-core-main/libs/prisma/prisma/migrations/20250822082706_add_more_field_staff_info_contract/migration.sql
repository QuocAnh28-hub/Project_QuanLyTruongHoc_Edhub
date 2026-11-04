-- CreateTable
CREATE TABLE "eduhub"."school_staffs_salaries" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "work_contract_id" INTEGER NOT NULL,
    "grade_code" TEXT,
    "grade_step" INTEGER,
    "coefficient" DECIMAL(65,30),
    "bank_name" TEXT,
    "bank_account_number" TEXT,
    "bank_account_holder_name" TEXT,
    "bank_branch" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "school_staffs_salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_staffs_work_contracts" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "type" INTEGER,
    "title" TEXT,
    "date_of_signature" TIMESTAMP(3),
    "date_of_admission" TIMESTAMP(3),
    "date_of_expired" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_staffs_work_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_staffs_allowance" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "work_contract_id" INTEGER NOT NULL,
    "allowance_type" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_staffs_allowance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."personal_insurance_finance" (
    "id" SERIAL NOT NULL,
    "personal_id" INTEGER NOT NULL,
    "social_insurance_code" TEXT,
    "pit_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "personal_insurance_finance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "school_staffs_salaries_org_id_staff_id_idx" ON "eduhub"."school_staffs_salaries"("org_id", "staff_id");

-- CreateIndex
CREATE INDEX "school_staffs_work_contracts_org_id_staff_id_idx" ON "eduhub"."school_staffs_work_contracts"("org_id", "staff_id");

-- CreateIndex
CREATE INDEX "school_staffs_allowance_org_id_staff_id_idx" ON "eduhub"."school_staffs_allowance"("org_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_insurance_finance_personal_id_key" ON "eduhub"."personal_insurance_finance"("personal_id");

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_salaries" ADD CONSTRAINT "school_staffs_salaries_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_salaries" ADD CONSTRAINT "school_staffs_salaries_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_salaries" ADD CONSTRAINT "school_staffs_salaries_work_contract_id_fkey" FOREIGN KEY ("work_contract_id") REFERENCES "eduhub"."school_staffs_work_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_work_contracts" ADD CONSTRAINT "school_staffs_work_contracts_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_work_contracts" ADD CONSTRAINT "school_staffs_work_contracts_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_allowance" ADD CONSTRAINT "school_staffs_allowance_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_allowance" ADD CONSTRAINT "school_staffs_allowance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs_allowance" ADD CONSTRAINT "school_staffs_allowance_work_contract_id_fkey" FOREIGN KEY ("work_contract_id") REFERENCES "eduhub"."school_staffs_work_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personal_insurance_finance" ADD CONSTRAINT "personal_insurance_finance_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
