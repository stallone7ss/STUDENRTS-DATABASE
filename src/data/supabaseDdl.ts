/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SUPABASE_POSTGRES_SCHEMA = `-- =============================================================================
-- SUPABASE POSTGRESQL SCHEMA (DDL): STUDENT MANAGEMENT MODERNIZATION
-- Reverse-engineered from legacy Microsoft Access "Student Management" template
-- Database: PostgreSQL 15+ / Supabase Relational Engine
-- =============================================================================

-- Enable UUID extension if needed for secure tokens
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. TABLE: settings
-- Global institutional configuration, school terms, and external service URLs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    category VARCHAR(50) DEFAULT 'System',
    description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index on setting_name for fast O(1) lookups
CREATE INDEX IF NOT EXISTS idx_settings_name ON settings (setting_name);

-- -----------------------------------------------------------------------------
-- 2. TABLE: students
-- Master student directory with enrollment, classroom, and medical data
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(255),
    level VARCHAR(30) NOT NULL,
    room VARCHAR(20) NOT NULL,
    special_circumstances BOOLEAN DEFAULT FALSE NOT NULL,
    special_circumstances_notes TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    web_page VARCHAR(255),
    allergies TEXT,
    medications TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(50),
    notes TEXT,
    photo_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Optimized B-Tree Indexes for search and high-frequency filtering
CREATE INDEX IF NOT EXISTS idx_students_last_name ON students (last_name);
CREATE INDEX IF NOT EXISTS idx_students_level ON students (level);
CREATE INDEX IF NOT EXISTS idx_students_room ON students (room);
CREATE INDEX IF NOT EXISTS idx_students_special_circumstances ON students (special_circumstances);

-- -----------------------------------------------------------------------------
-- 3. TABLE: guardians
-- Parents, primary caregivers, emergency contacts, and legal guardians
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guardians (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(255),
    primary_phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    relationship_type VARCHAR(50) DEFAULT 'Parent',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guardians_last_name ON guardians (last_name);

-- -----------------------------------------------------------------------------
-- 4. TABLE: student_guardians (Junction Table: M to N)
-- Resolves many-to-many relationship between Students and Guardians
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_guardians (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    guardian_id BIGINT NOT NULL REFERENCES guardians(id) ON DELETE CASCADE ON UPDATE CASCADE,
    relationship VARCHAR(50) NOT NULL,
    primary_contact BOOLEAN DEFAULT TRUE NOT NULL,
    pickup_authorized BOOLEAN DEFAULT TRUE NOT NULL,
    emergency_contact BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT uq_student_guardian UNIQUE (student_id, guardian_id)
);

CREATE INDEX IF NOT EXISTS idx_student_guardians_student ON student_guardians (student_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_guardian ON student_guardians (guardian_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_primary ON student_guardians (student_id, primary_contact);

-- -----------------------------------------------------------------------------
-- 5. TABLE: student_attendance
-- Daily attendance logs, absences, tardiness, and official excuses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_attendance (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Tardy', 'Excused')),
    reason VARCHAR(255),
    recorded_by VARCHAR(100) DEFAULT 'Staff',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON student_attendance (student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_date_status ON student_attendance (attendance_date, status);

-- -----------------------------------------------------------------------------
-- 6. DATABASE VIEW: view_students_extended
-- Optimally aggregates student records with calculated age and primary guardian
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_students_extended AS
SELECT 
    s.id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.first_name || ' ' || s.last_name AS full_name,
    s.last_name || ', ' || s.first_name AS display_name,
    s.email_address,
    s.level,
    s.room,
    s.special_circumstances,
    s.special_circumstances_notes,
    s.date_of_birth,
    DATE_PART('year', AGE(s.date_of_birth))::INT AS age,
    s.gender,
    s.address,
    s.city,
    s.state,
    s.zip_postal_code,
    COALESCE(s.address, '') || ', ' || COALESCE(s.city, '') || ', ' || COALESCE(s.state, '') || ' ' || COALESCE(s.zip_postal_code, '') AS full_address,
    s.allergies,
    s.medications,
    s.emergency_contact_name,
    s.emergency_contact_phone,
    s.emergency_contact_relationship,
    s.notes,
    s.photo_url,
    s.created_at,
    -- Linked Primary Guardian Details via Subquery/Left Join
    pg.guardian_id AS primary_guardian_id,
    pg.guardian_name AS primary_guardian_name,
    pg.primary_phone AS primary_guardian_phone,
    pg.guardian_email AS primary_guardian_email,
    pg.relationship AS primary_guardian_relationship
FROM students s
LEFT JOIN LATERAL (
    SELECT 
        g.id AS guardian_id,
        g.first_name || ' ' || g.last_name AS guardian_name,
        g.primary_phone,
        g.email_address AS guardian_email,
        sg.relationship
    FROM student_guardians sg
    JOIN guardians g ON sg.guardian_id = g.id
    WHERE sg.student_id = s.id AND sg.primary_contact = TRUE
    ORDER BY sg.id ASC
    LIMIT 1
) pg ON TRUE;

-- -----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES (Supabase Security Best Practice)
-- -----------------------------------------------------------------------------
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;

-- Default permissive read/write policy for authenticated staff / anon preview
CREATE POLICY "Public read access for students" ON students FOR SELECT USING (true);
CREATE POLICY "Public insert access for students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for students" ON students FOR UPDATE USING (true);
CREATE POLICY "Public delete access for students" ON students FOR DELETE USING (true);

CREATE POLICY "Public read access for guardians" ON guardians FOR SELECT USING (true);
CREATE POLICY "Public read access for student_guardians" ON student_guardians FOR SELECT USING (true);
CREATE POLICY "Public read access for student_attendance" ON student_attendance FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 8. SAMPLE INITIAL SEED DATA
-- -----------------------------------------------------------------------------
INSERT INTO settings (setting_name, setting_value, category, description) VALUES
('InstitutionName', 'Northwood Academy', 'School Info', 'Official institution name'),
('AcademicYear', '2026-2027', 'Academic', 'Active academic school year'),
('GradeLevels', 'Grade 9, Grade 10, Grade 11, Grade 12', 'Academic', 'Enrollment levels'),
('DefaultHomerooms', 'Room 101, Room 102, Room 103, Room 104', 'Academic', 'Active classrooms')
ON CONFLICT (setting_name) DO NOTHING;
`;
