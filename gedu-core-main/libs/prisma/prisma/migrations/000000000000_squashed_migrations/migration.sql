-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "eduhub";

-- CreateTable
CREATE TABLE "eduhub"."classes" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "grade_level" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "max_class_size" INTEGER NOT NULL DEFAULT 0,
    "curriculum_id" INTEGER,
    "first_foreign_language_id" INTEGER,
    "second_foreign_language_id" INTEGER,
    "home_room_teacher_id" INTEGER,
    "daily_schedule_type" INTEGER,
    "estimated_lessons_per_week" INTEGER,
    "is_day_boarding" BOOLEAN DEFAULT false,
    "is_multi_grade" BOOLEAN,
    "has_students_with_disabilities" BOOLEAN,
    "has_parent_rep_in_class" BOOLEAN,
    "has_parent_rep_in_school_board" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."student_classes" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "student_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."nations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "nations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."ethnics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ethnics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."religions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "religions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "phone_code" TEXT NOT NULL,
    "flag" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."provinces" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "phone_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."districts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."wards" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."provinces_cities" (
    "id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinces_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."wards_communes" (
    "id" SERIAL NOT NULL,
    "provinces_cities_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wards_communes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."education_levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "education_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."permissions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."permission_groups" (
    "code" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "permission_groups_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "eduhub"."permission_group_permissions" (
    "id" SERIAL NOT NULL,
    "group_code" INTEGER NOT NULL,
    "permission_code" INTEGER NOT NULL,

    CONSTRAINT "permission_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."authority_permissions" (
    "id" SERIAL NOT NULL,
    "authority_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "isPermissionGroup" BOOLEAN NOT NULL,

    CONSTRAINT "authority_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."education_departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "hotline" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "ward_id" INTEGER NOT NULL,
    "province_id" INTEGER NOT NULL,

    CONSTRAINT "education_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."edu_department_templates" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL DEFAULT 1,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "parent_id" INTEGER,
    "head_position_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "edu_department_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."ed_position_templates" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL DEFAULT 1,
    "code" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "can_dedicated" BOOLEAN NOT NULL DEFAULT false,
    "can_concurrent" BOOLEAN NOT NULL DEFAULT false,
    "is_department_head" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ed_position_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."ed_staffs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    "department_id" INTEGER,
    "code" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "contact_phone" TEXT,
    "contact_phone_2" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "position_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "ed_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."ed_staff_positions" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "position_id" INTEGER,
    "is_dedicated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "ed_staff_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."import_jobs" (
    "id" TEXT NOT NULL,
    "org_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "result" JSONB,
    "total_lines" INTEGER NOT NULL DEFAULT 0,
    "processed_lines" INTEGER NOT NULL DEFAULT 0,
    "failed_lines" INTEGER NOT NULL DEFAULT 0,
    "error_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."schools" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "type" INTEGER NOT NULL DEFAULT 3,
    "address" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "daily_schedule_type" INTEGER,
    "can_complementary_education" BOOLEAN NOT NULL DEFAULT false,
    "is_international_school" BOOLEAN NOT NULL DEFAULT false,
    "can_preschool" BOOLEAN NOT NULL DEFAULT false,
    "national_standard_status" INTEGER NOT NULL DEFAULT 0,
    "can_primary_school" BOOLEAN NOT NULL DEFAULT false,
    "can_lower_secondary_school" BOOLEAN NOT NULL DEFAULT false,
    "can_upper_secondary_school" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "website" TEXT,
    "hotline" TEXT,
    "principal_first_name" TEXT,
    "principal_last_name" TEXT,
    "principal_phone" TEXT,
    "province_id" INTEGER,
    "ward_id" INTEGER,
    "is_school_for_gifted" BOOLEAN DEFAULT false,
    "is_ethnic_boarding_school" BOOLEAN DEFAULT false,
    "is_ethnic_day_boarding_school" BOOLEAN DEFAULT false,
    "is_special_education_school" BOOLEAN DEFAULT false,
    "is_national_standard_school" BOOLEAN DEFAULT false,
    "is_remote_or_mountainous_school" BOOLEAN DEFAULT false,
    "is_border_or_island_school" BOOLEAN DEFAULT false,
    "is_especially_difficult_area" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_department_templates" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "parent_id" INTEGER,
    "head_position_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_department_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_position_templates" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "code" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "can_dedicated" BOOLEAN NOT NULL DEFAULT false,
    "can_concurrent" BOOLEAN NOT NULL DEFAULT false,
    "is_department_head" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_position_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_authorities" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "school_authorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_positions_authorities" (
    "id" SERIAL NOT NULL,
    "position_id" INTEGER NOT NULL,
    "authority_id" INTEGER NOT NULL,

    CONSTRAINT "school_positions_authorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_awards" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "award" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_years" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "semester_count" INTEGER NOT NULL DEFAULT 0,
    "exam_count" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."semesters" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "from_date" TIMESTAMP(3),
    "to_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."examinations" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "school_year_id" INTEGER NOT NULL,
    "semester_id" INTEGER,
    "title" TEXT NOT NULL,
    "from_date" TIMESTAMP(3),
    "to_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."instruction_languages" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_instruction" BOOLEAN NOT NULL DEFAULT false,
    "is_foreign" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "instruction_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."curriculums" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instruction_language_id" INTEGER NOT NULL,
    "graduation_degree" TEXT,
    "is_received_diploma" BOOLEAN NOT NULL DEFAULT false,
    "can_apply" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "curriculums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."curriculum_grade_levels" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "curriculum_id" INTEGER NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "curriculum_grade_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."curriculum_subjects" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "curriculum_id" INTEGER NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "instruction_language_id" INTEGER NOT NULL,
    "comments_based" BOOLEAN NOT NULL DEFAULT false,
    "scoring_based" BOOLEAN NOT NULL DEFAULT false,
    "lessons_per_week" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "curriculum_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_additional_info" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "additional_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_additional_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_profiles" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "area_in_sq_meters" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "has_minimum_teaching_equipment" BOOLEAN NOT NULL DEFAULT false,
    "has_computer" BOOLEAN NOT NULL DEFAULT false,
    "has_internet_connection" BOOLEAN NOT NULL DEFAULT false,
    "has_electricity" BOOLEAN NOT NULL DEFAULT false,
    "has_clean_water" BOOLEAN NOT NULL DEFAULT false,
    "has_toilet" BOOLEAN NOT NULL DEFAULT false,
    "has_hand_washing_education" BOOLEAN NOT NULL DEFAULT false,
    "has_disability_access" BOOLEAN NOT NULL DEFAULT false,
    "has_party_cell" BOOLEAN NOT NULL DEFAULT false,
    "is_national_standard_school" BOOLEAN NOT NULL DEFAULT false,
    "quality_assessment_code" TEXT NOT NULL DEFAULT '',
    "quality_assessment_level" INTEGER NOT NULL DEFAULT 0,
    "meets_minimum_education_quality" BOOLEAN NOT NULL DEFAULT false,
    "area_code" TEXT NOT NULL DEFAULT '',
    "region_code" TEXT NOT NULL DEFAULT '',
    "is_in_extreme_difficult_region" BOOLEAN NOT NULL DEFAULT false,
    "difficult_region_codes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "has_disabled_students" BOOLEAN NOT NULL DEFAULT false,
    "has_semi_boarding_students" BOOLEAN NOT NULL DEFAULT false,
    "has_boarding_students" BOOLEAN NOT NULL DEFAULT false,
    "teaches_two_shifts_per_day" BOOLEAN NOT NULL DEFAULT false,
    "teaches_life_skills" BOOLEAN NOT NULL DEFAULT false,
    "has_basic_education_program" BOOLEAN NOT NULL DEFAULT false,
    "has_school_counseling_dept" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."campuses" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "phone_number" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "distance_to_main_campus_in_km" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "transportation_methods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "area_in_sq_meters" DECIMAL(8,2) NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_staffs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    "position_id" INTEGER,
    "department_id" INTEGER,
    "code" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "contact_phone" TEXT,
    "contact_phone_2" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_staff_positions" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "position_id" INTEGER,
    "is_dedicated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "school_staff_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."school_staff_additional_info" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "additional_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_staff_additional_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."work_histories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "position_title" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "department_name" TEXT NOT NULL,
    "concurrent_position_title" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "work_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."students" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "main_contact_id" INTEGER,
    "code" TEXT,
    "grade_level" INTEGER,
    "admission_date" TIMESTAMP(3),
    "admission_school_year_id" INTEGER,
    "admission_type" INTEGER,
    "priority_policy_id" INTEGER,
    "special_needs_policy_id" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."students_contacts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "grant_access" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "students_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."students_students_contacts" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "relationship" INTEGER NOT NULL DEFAULT 0,
    "relationship_title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "students_students_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."student_medical_info" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "group" INTEGER DEFAULT 1,
    "type" INTEGER DEFAULT 1,
    "info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "student_medical_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."student_priority_policies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "student_priority_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."student_special_needs_policies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "student_special_needs_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."student_additional_info" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "additional_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_additional_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."subjects" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "can_apply" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."subject_options" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "subject_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."department_subjects" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "department_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."users" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "email" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "phone2" TEXT,
    "avatar" TEXT,
    "personal_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."accounts" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT,
    "roles" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."personals" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "old_citizen_id" TEXT,
    "citizen_id" TEXT,
    "date_of_issue" TIMESTAMP(3),
    "date_of_expiry" TIMESTAMP(3),
    "date_of_birth" TIMESTAMP(3),
    "place_of_issue" TEXT,
    "sex" INTEGER DEFAULT 0,
    "marital_status" INTEGER DEFAULT 0,
    "occupation" TEXT,
    "origin_place_province_id" INTEGER,
    "origin_place_ward_id" INTEGER,
    "permanent_residence_province_id" INTEGER,
    "permanent_residence_ward_id" INTEGER,
    "permanent_residence_address" TEXT,
    "temporary_residence_province_id" INTEGER,
    "temporary_residence_ward_id" INTEGER,
    "temporary_residence_address" TEXT,
    "nationality_id" INTEGER,
    "ethnicity_id" INTEGER,
    "religion_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "personals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eduhub"."user_edu_levels" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    "edu_level_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "major" TEXT,
    "school_name" TEXT,
    "year_of_graduation" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,

    CONSTRAINT "user_edu_levels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_code_key" ON "eduhub"."classes"("code");

-- CreateIndex
CREATE INDEX "classes_org_id_school_year_id_grade_level_curriculum_id_idx" ON "eduhub"."classes"("org_id", "school_year_id", "grade_level", "curriculum_id");

-- CreateIndex
CREATE INDEX "classes_org_id_school_year_id_curriculum_id_idx" ON "eduhub"."classes"("org_id", "school_year_id", "curriculum_id");

-- CreateIndex
CREATE INDEX "classes_org_id_grade_level_idx" ON "eduhub"."classes"("org_id", "grade_level");

-- CreateIndex
CREATE INDEX "classes_grade_level_idx" ON "eduhub"."classes"("grade_level");

-- CreateIndex
CREATE INDEX "student_classes_org_id_class_id_idx" ON "eduhub"."student_classes"("org_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_classes_org_id_student_id_class_id_key" ON "eduhub"."student_classes"("org_id", "student_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "nations_title_key" ON "eduhub"."nations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "eduhub"."countries"("code");

-- CreateIndex
CREATE INDEX "provinces_cities_is_active_idx" ON "eduhub"."provinces_cities"("is_active");

-- CreateIndex
CREATE INDEX "provinces_cities_country_id_is_active_idx" ON "eduhub"."provinces_cities"("country_id", "is_active");

-- CreateIndex
CREATE INDEX "provinces_cities_code_idx" ON "eduhub"."provinces_cities"("code");

-- CreateIndex
CREATE INDEX "wards_communes_provinces_cities_id_idx" ON "eduhub"."wards_communes"("provinces_cities_id");

-- CreateIndex
CREATE INDEX "wards_communes_provinces_cities_id_is_active_idx" ON "eduhub"."wards_communes"("provinces_cities_id", "is_active");

-- CreateIndex
CREATE INDEX "wards_communes_is_active_idx" ON "eduhub"."wards_communes"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "ed_position_templates_department_id_title_key" ON "eduhub"."ed_position_templates"("department_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ed_staffs_user_id_key" ON "eduhub"."ed_staffs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ed_staffs_org_id_code_key" ON "eduhub"."ed_staffs"("org_id", "code");

-- CreateIndex
CREATE INDEX "ed_staff_positions_org_id_staff_id_idx" ON "eduhub"."ed_staff_positions"("org_id", "staff_id");

-- CreateIndex
CREATE INDEX "ed_staff_positions_position_id_idx" ON "eduhub"."ed_staff_positions"("position_id");

-- CreateIndex
CREATE INDEX "import_jobs_org_id_idx" ON "eduhub"."import_jobs"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_code_key" ON "eduhub"."schools"("code");

-- CreateIndex
CREATE INDEX "schools_name_idx" ON "eduhub"."schools"("name");

-- CreateIndex
CREATE INDEX "schools_type_is_international_school_idx" ON "eduhub"."schools"("type", "is_international_school");

-- CreateIndex
CREATE INDEX "schools_can_preschool_can_primary_school_can_lower_secondar_idx" ON "eduhub"."schools"("can_preschool", "can_primary_school", "can_lower_secondary_school", "can_upper_secondary_school");

-- CreateIndex
CREATE UNIQUE INDEX "school_position_templates_department_id_title_key" ON "eduhub"."school_position_templates"("department_id", "title");

-- CreateIndex
CREATE INDEX "semesters_org_id_school_year_id_idx" ON "eduhub"."semesters"("org_id", "school_year_id");

-- CreateIndex
CREATE INDEX "examinations_org_id_school_year_id_idx" ON "eduhub"."examinations"("org_id", "school_year_id");

-- CreateIndex
CREATE INDEX "examinations_semester_id_idx" ON "eduhub"."examinations"("semester_id");

-- CreateIndex
CREATE INDEX "examinations_school_year_id_semester_id_idx" ON "eduhub"."examinations"("school_year_id", "semester_id");

-- CreateIndex
CREATE INDEX "curriculums_org_id_instruction_language_id_idx" ON "eduhub"."curriculums"("org_id", "instruction_language_id");

-- CreateIndex
CREATE INDEX "curriculums_org_id_code_idx" ON "eduhub"."curriculums"("org_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_grade_levels_org_id_curriculum_id_grade_level_key" ON "eduhub"."curriculum_grade_levels"("org_id", "curriculum_id", "grade_level");

-- CreateIndex
CREATE INDEX "curriculum_subjects_org_id_curriculum_id_idx" ON "eduhub"."curriculum_subjects"("org_id", "curriculum_id");

-- CreateIndex
CREATE INDEX "curriculum_subjects_org_id_subject_id_idx" ON "eduhub"."curriculum_subjects"("org_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_additional_info_org_id_key" ON "eduhub"."school_additional_info"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_profiles_org_id_key" ON "eduhub"."school_profiles"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "campuses_org_id_code_key" ON "eduhub"."campuses"("org_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "school_staffs_user_id_key" ON "eduhub"."school_staffs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_staffs_org_id_code_key" ON "eduhub"."school_staffs"("org_id", "code");

-- CreateIndex
CREATE INDEX "school_staff_positions_org_id_staff_id_idx" ON "eduhub"."school_staff_positions"("org_id", "staff_id");

-- CreateIndex
CREATE INDEX "school_staff_positions_position_id_idx" ON "eduhub"."school_staff_positions"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_staff_additional_info_staff_id_key" ON "eduhub"."school_staff_additional_info"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "eduhub"."students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_org_id_code_key" ON "eduhub"."students"("org_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "students_contacts_user_id_key" ON "eduhub"."students_contacts"("user_id");

-- CreateIndex
CREATE INDEX "students_contacts_user_id_idx" ON "eduhub"."students_contacts"("user_id");

-- CreateIndex
CREATE INDEX "students_students_contacts_student_id_contact_id_idx" ON "eduhub"."students_students_contacts"("student_id", "contact_id");

-- CreateIndex
CREATE INDEX "student_medical_info_student_id_idx" ON "eduhub"."student_medical_info"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_additional_info_student_id_key" ON "eduhub"."student_additional_info"("student_id");

-- CreateIndex
CREATE INDEX "subjects_org_id_idx" ON "eduhub"."subjects"("org_id");

-- CreateIndex
CREATE INDEX "subject_options_subject_id_idx" ON "eduhub"."subject_options"("subject_id");

-- CreateIndex
CREATE INDEX "department_subjects_org_id_subject_id_idx" ON "eduhub"."department_subjects"("org_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_subjects_org_id_department_id_subject_id_key" ON "eduhub"."department_subjects"("org_id", "department_id", "subject_id");

-- CreateIndex
CREATE INDEX "users_org_id_idx" ON "eduhub"."users"("org_id");

-- CreateIndex
CREATE INDEX "users_first_name_idx" ON "eduhub"."users"("first_name");

-- CreateIndex
CREATE INDEX "users_last_name_idx" ON "eduhub"."users"("last_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_org_id_phone_key" ON "eduhub"."users"("org_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_key" ON "eduhub"."accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_name_key" ON "eduhub"."accounts"("user_name");

-- CreateIndex
CREATE INDEX "accounts_org_id_user_name_idx" ON "eduhub"."accounts"("org_id", "user_name");

-- CreateIndex
CREATE UNIQUE INDEX "personals_citizen_id_key" ON "eduhub"."personals"("citizen_id");

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "eduhub"."curriculums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_home_room_teacher_id_fkey" FOREIGN KEY ("home_room_teacher_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_first_foreign_language_id_fkey" FOREIGN KEY ("first_foreign_language_id") REFERENCES "eduhub"."instruction_languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_second_foreign_language_id_fkey" FOREIGN KEY ("second_foreign_language_id") REFERENCES "eduhub"."instruction_languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."classes" ADD CONSTRAINT "classes_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."student_classes" ADD CONSTRAINT "student_classes_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."student_classes" ADD CONSTRAINT "student_classes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."student_classes" ADD CONSTRAINT "student_classes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "eduhub"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."wards_communes" ADD CONSTRAINT "wards_communes_provinces_cities_id_fkey" FOREIGN KEY ("provinces_cities_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_group_code_fkey" FOREIGN KEY ("group_code") REFERENCES "eduhub"."permission_groups"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permission_code_fkey" FOREIGN KEY ("permission_code") REFERENCES "eduhub"."permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."authority_permissions" ADD CONSTRAINT "authority_permissions_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "eduhub"."school_authorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."authority_permissions" ADD CONSTRAINT "authority_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "eduhub"."permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."edu_department_templates" ADD CONSTRAINT "edu_department_templates_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "eduhub"."edu_department_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_position_templates" ADD CONSTRAINT "ed_position_templates_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "eduhub"."edu_department_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_staffs" ADD CONSTRAINT "ed_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_staffs" ADD CONSTRAINT "ed_staffs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "eduhub"."edu_department_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_staffs" ADD CONSTRAINT "ed_staffs_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "eduhub"."ed_position_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_staff_positions" ADD CONSTRAINT "ed_staff_positions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."ed_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."ed_staff_positions" ADD CONSTRAINT "ed_staff_positions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "eduhub"."ed_position_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."schools" ADD CONSTRAINT "schools_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "eduhub"."wards_communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."schools" ADD CONSTRAINT "schools_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_department_templates" ADD CONSTRAINT "school_department_templates_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "eduhub"."school_department_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_department_templates" ADD CONSTRAINT "school_department_templates_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_position_templates" ADD CONSTRAINT "school_position_templates_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "eduhub"."school_department_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_position_templates" ADD CONSTRAINT "school_position_templates_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_positions_authorities" ADD CONSTRAINT "school_positions_authorities_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "eduhub"."school_position_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_positions_authorities" ADD CONSTRAINT "school_positions_authorities_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "eduhub"."school_authorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_awards" ADD CONSTRAINT "school_awards_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_years" ADD CONSTRAINT "school_years_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."semesters" ADD CONSTRAINT "semesters_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."semesters" ADD CONSTRAINT "semesters_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."examinations" ADD CONSTRAINT "examinations_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."examinations" ADD CONSTRAINT "examinations_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."examinations" ADD CONSTRAINT "examinations_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "eduhub"."semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculums" ADD CONSTRAINT "curriculums_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculums" ADD CONSTRAINT "curriculums_instruction_language_id_fkey" FOREIGN KEY ("instruction_language_id") REFERENCES "eduhub"."instruction_languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_grade_levels" ADD CONSTRAINT "curriculum_grade_levels_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "eduhub"."curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_grade_levels" ADD CONSTRAINT "curriculum_grade_levels_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_subjects" ADD CONSTRAINT "curriculum_subjects_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_subjects" ADD CONSTRAINT "curriculum_subjects_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "eduhub"."curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_subjects" ADD CONSTRAINT "curriculum_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."curriculum_subjects" ADD CONSTRAINT "curriculum_subjects_instruction_language_id_fkey" FOREIGN KEY ("instruction_language_id") REFERENCES "eduhub"."instruction_languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_additional_info" ADD CONSTRAINT "school_additional_info_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_profiles" ADD CONSTRAINT "school_profiles_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."campuses" ADD CONSTRAINT "campuses_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs" ADD CONSTRAINT "school_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs" ADD CONSTRAINT "school_staffs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs" ADD CONSTRAINT "school_staffs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "eduhub"."school_department_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staffs" ADD CONSTRAINT "school_staffs_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "eduhub"."school_position_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staff_positions" ADD CONSTRAINT "school_staff_positions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staff_positions" ADD CONSTRAINT "school_staff_positions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "eduhub"."school_position_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."school_staff_additional_info" ADD CONSTRAINT "school_staff_additional_info_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "eduhub"."school_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."work_histories" ADD CONSTRAINT "work_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_main_contact_id_fkey" FOREIGN KEY ("main_contact_id") REFERENCES "eduhub"."students_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_admission_school_year_id_fkey" FOREIGN KEY ("admission_school_year_id") REFERENCES "eduhub"."school_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_priority_policy_id_fkey" FOREIGN KEY ("priority_policy_id") REFERENCES "eduhub"."student_priority_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students" ADD CONSTRAINT "students_special_needs_policy_id_fkey" FOREIGN KEY ("special_needs_policy_id") REFERENCES "eduhub"."student_special_needs_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students_contacts" ADD CONSTRAINT "students_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students_students_contacts" ADD CONSTRAINT "students_students_contacts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."students_students_contacts" ADD CONSTRAINT "students_students_contacts_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "eduhub"."students_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."student_medical_info" ADD CONSTRAINT "student_medical_info_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."student_additional_info" ADD CONSTRAINT "student_additional_info_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "eduhub"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."subjects" ADD CONSTRAINT "subjects_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."subject_options" ADD CONSTRAINT "subject_options_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."department_subjects" ADD CONSTRAINT "department_subjects_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."department_subjects" ADD CONSTRAINT "department_subjects_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "eduhub"."school_department_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."department_subjects" ADD CONSTRAINT "department_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "eduhub"."subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."users" ADD CONSTRAINT "users_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "eduhub"."personals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "eduhub"."nations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_ethnicity_id_fkey" FOREIGN KEY ("ethnicity_id") REFERENCES "eduhub"."ethnics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_religion_id_fkey" FOREIGN KEY ("religion_id") REFERENCES "eduhub"."religions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_origin_place_province_id_fkey" FOREIGN KEY ("origin_place_province_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_permanent_residence_province_id_fkey" FOREIGN KEY ("permanent_residence_province_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_temporary_residence_province_id_fkey" FOREIGN KEY ("temporary_residence_province_id") REFERENCES "eduhub"."provinces_cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_origin_place_ward_id_fkey" FOREIGN KEY ("origin_place_ward_id") REFERENCES "eduhub"."wards_communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_permanent_residence_ward_id_fkey" FOREIGN KEY ("permanent_residence_ward_id") REFERENCES "eduhub"."wards_communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."personals" ADD CONSTRAINT "personals_temporary_residence_ward_id_fkey" FOREIGN KEY ("temporary_residence_ward_id") REFERENCES "eduhub"."wards_communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."user_edu_levels" ADD CONSTRAINT "user_edu_levels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eduhub"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."user_edu_levels" ADD CONSTRAINT "user_edu_levels_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "eduhub"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eduhub"."user_edu_levels" ADD CONSTRAINT "user_edu_levels_edu_level_id_fkey" FOREIGN KEY ("edu_level_id") REFERENCES "eduhub"."education_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


