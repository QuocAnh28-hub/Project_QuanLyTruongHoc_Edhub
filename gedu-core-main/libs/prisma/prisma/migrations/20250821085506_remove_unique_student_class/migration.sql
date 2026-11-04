-- Drop old index
DROP INDEX IF EXISTS "eduhub"."student_classes_org_id_student_id_class_id_key";

-- Ensure a student can only be ACTIVE in the same class once
CREATE UNIQUE INDEX IF NOT EXISTS "student_classes_unique_active_per_class"
ON "eduhub"."student_classes" (
    "org_id",
    "class_id",
    "student_id"
)
WHERE status = 2; -- ACTIVE
