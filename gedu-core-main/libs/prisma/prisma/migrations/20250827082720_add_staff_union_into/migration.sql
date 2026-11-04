CREATE TABLE school_staffs_union_infos (
    id SERIAL PRIMARY KEY,
    org_id INT NOT NULL,
    staff_id INT NOT NULL UNIQUE,  -- 1-1 relation with staff

    date_of_joining_union DATE,
    date_of_joining_party DATE,
    date_of_enlistment DATE,
    date_of_discharge DATE,

    CONSTRAINT fk_school FOREIGN KEY (org_id) REFERENCES schools(id) ON DELETE CASCADE,
    CONSTRAINT fk_staff FOREIGN KEY (staff_id) REFERENCES school_staffs(id) ON DELETE CASCADE
);

-- Index on org_id for faster queries by school
CREATE INDEX idx_school_union_infos_org ON school_staffs_union_infos(org_id);
