/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SQL_DDL_ACCESS = `-- =====================================================================
-- MICROSOFT ACCESS DATABASE ARCHITECTURE (JET / ACE SQL DDL)
-- Reverse-Engineered from Microsoft Access "Student Management" Template
-- Objects: 6 Tables, Primary & Foreign Keys, Enforced Referential Integrity
-- =====================================================================

-- 1. SETTINGS TABLE
-- Stores global institutional configuration, school calendar, and integration parameters
CREATE TABLE [Settings] (
    [Setting ID] AUTOINCREMENT CONSTRAINT PK_Settings PRIMARY KEY,
    [Setting Name] VARCHAR(100) NOT NULL CONSTRAINT UQ_SettingName UNIQUE,
    [Setting Value] LONGTEXT NULL,
    [Category] VARCHAR(50) DEFAULT 'System',
    [Description] VARCHAR(255) NULL
);

-- 2. FILTERS TABLE
-- Persists user filter presets, active search conditions, and criteria macros
CREATE TABLE [Filters] (
    [Filter ID] AUTOINCREMENT CONSTRAINT PK_Filters PRIMARY KEY,
    [Filter Name] VARCHAR(100) NOT NULL,
    [Filter Field] VARCHAR(50) NOT NULL,
    [Filter Operator] VARCHAR(20) DEFAULT '=',
    [Filter Value] VARCHAR(255) NULL,
    [Active] YESNO DEFAULT False,
    [Description] VARCHAR(255) NULL
);

-- 3. STUDENTS TABLE
-- Master student directory with demographics, enrollment, room assignment, and health flags
CREATE TABLE [Students] (
    [ID] AUTOINCREMENT CONSTRAINT PK_Students PRIMARY KEY,
    [Student ID] VARCHAR(30) NOT NULL CONSTRAINT UQ_StudentID UNIQUE,
    [First Name] VARCHAR(50) NOT NULL,
    [Last Name] VARCHAR(50) NOT NULL,
    [E-mail Address] VARCHAR(255) NULL,
    [Level] VARCHAR(30) NOT NULL,
    [Room] VARCHAR(20) NOT NULL,
    [Special Circumstances] YESNO DEFAULT False,
    [Special Circumstances Notes] LONGTEXT NULL,
    [Date of Birth] DATETIME NULL,
    [Gender] VARCHAR(10) NULL,
    [Address] VARCHAR(255) NULL,
    [City] VARCHAR(100) NULL,
    [State] VARCHAR(50) NULL,
    [ZIP Postal Code] VARCHAR(20) NULL,
    [Country] VARCHAR(50) DEFAULT 'USA',
    [Web Page] VARCHAR(255) NULL,
    [Allergies] LONGTEXT NULL,
    [Medications] LONGTEXT NULL,
    [Emergency Contact Name] VARCHAR(100) NULL,
    [Emergency Contact Phone] VARCHAR(50) NULL,
    [Emergency Contact Relationship] VARCHAR(50) NULL,
    [Notes] LONGTEXT NULL,
    [Photo] VARCHAR(255) NULL
);

-- Indexing on Students table for high-frequency filtering and searches
CREATE INDEX IDX_Students_Level ON [Students] ([Level]);
CREATE INDEX IDX_Students_Room ON [Students] ([Room]);
CREATE INDEX IDX_Students_LastName ON [Students] ([Last Name], [First Name]);
CREATE INDEX IDX_Students_SpecialCircumstances ON [Students] ([Special Circumstances]);

-- 4. GUARDIANS TABLE
-- Primary and secondary parents, emergency caregivers, and legal guardians
CREATE TABLE [Guardians] (
    [ID] AUTOINCREMENT CONSTRAINT PK_Guardians PRIMARY KEY,
    [First Name] VARCHAR(50) NOT NULL,
    [Last Name] VARCHAR(50) NOT NULL,
    [E-mail Address] VARCHAR(255) NULL,
    [Primary Phone] VARCHAR(50) NOT NULL,
    [Secondary Phone] VARCHAR(50) NULL,
    [Address] VARCHAR(255) NULL,
    [City] VARCHAR(100) NULL,
    [State] VARCHAR(50) NULL,
    [ZIP Postal Code] VARCHAR(20) NULL,
    [Country] VARCHAR(50) DEFAULT 'USA',
    [Relationship Type] VARCHAR(50) DEFAULT 'Parent',
    [Notes] LONGTEXT NULL
);

CREATE INDEX IDX_Guardians_LastName ON [Guardians] ([Last Name], [First Name]);

-- 5. STUDENTS AND GUARDIANS TABLE (M:N Junction Table)
-- Resolves many-to-many relationship between Students and Guardians with authorization flags
CREATE TABLE [Students and Guardians] (
    [ID] AUTOINCREMENT CONSTRAINT PK_StudentsAndGuardians PRIMARY KEY,
    [Student ID] LONG NOT NULL,
    [Guardian ID] LONG NOT NULL,
    [Relationship] VARCHAR(50) NOT NULL,
    [Primary Contact] YESNO DEFAULT True,
    [Pickup Authorized] YESNO DEFAULT True,
    [Emergency Contact] YESNO DEFAULT True,
    CONSTRAINT FK_SG_StudentID FOREIGN KEY ([Student ID]) REFERENCES [Students] ([ID]) ON DELETE CASCADE,
    CONSTRAINT FK_SG_GuardianID FOREIGN KEY ([Guardian ID]) REFERENCES [Guardians] ([ID]) ON DELETE CASCADE,
    CONSTRAINT UQ_Student_Guardian UNIQUE ([Student ID], [Guardian ID])
);

CREATE INDEX IDX_SG_Student ON [Students and Guardians] ([Student ID]);
CREATE INDEX IDX_SG_Guardian ON [Students and Guardians] ([Guardian ID]);

-- 6. STUDENT ATTENDANCE TABLE
-- Daily roll call, tardy logs, absences, and administrative excuses
CREATE TABLE [Student Attendance] (
    [ID] AUTOINCREMENT CONSTRAINT PK_StudentAttendance PRIMARY KEY,
    [Student ID] LONG NOT NULL,
    [Attendance Date] DATETIME NOT NULL,
    [Status] VARCHAR(20) NOT NULL, -- 'Present', 'Absent', 'Tardy', 'Excused'
    [Reason] VARCHAR(255) NULL,
    [Recorded By] VARCHAR(100) DEFAULT 'System',
    CONSTRAINT FK_Attendance_StudentID FOREIGN KEY ([Student ID]) REFERENCES [Students] ([ID]) ON DELETE CASCADE
);

CREATE INDEX IDX_Attendance_StudentDate ON [Student Attendance] ([Student ID], [Attendance Date]);
CREATE INDEX IDX_Attendance_DateStatus ON [Student Attendance] ([Attendance Date], [Status]);
`;

export const SQL_DDL_POSTGRES = `-- =====================================================================
-- POSTGRESQL / ANSI STANDARD COMPATIBLE DDL
-- Enterprise Relational Migration Architecture
-- =====================================================================

CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    category VARCHAR(50) DEFAULT 'System',
    description VARCHAR(255) NULL
);

CREATE TABLE filters (
    filter_id SERIAL PRIMARY KEY,
    filter_name VARCHAR(100) NOT NULL,
    filter_field VARCHAR(50) NOT NULL,
    filter_operator VARCHAR(20) DEFAULT '=',
    filter_value VARCHAR(255) NULL,
    active BOOLEAN DEFAULT FALSE,
    description VARCHAR(255) NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) NULL,
    level VARCHAR(30) NOT NULL,
    room VARCHAR(20) NOT NULL,
    special_circumstances BOOLEAN DEFAULT FALSE,
    special_circumstances_notes TEXT NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(10) NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(50) NULL,
    zip_postal_code VARCHAR(20) NULL,
    country VARCHAR(50) DEFAULT 'USA',
    web_page VARCHAR(255) NULL,
    allergies TEXT NULL,
    medications TEXT NULL,
    emergency_contact_name VARCHAR(100) NULL,
    emergency_contact_phone VARCHAR(50) NULL,
    emergency_contact_relationship VARCHAR(50) NULL,
    notes TEXT NULL,
    photo_url VARCHAR(255) NULL
);

CREATE INDEX idx_students_level ON students (level);
CREATE INDEX idx_students_room ON students (room);
CREATE INDEX idx_students_last_name ON students (last_name, first_name);
CREATE INDEX idx_students_special_circumstances ON students (special_circumstances);

CREATE TABLE guardians (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) NULL,
    primary_phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50) NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(50) NULL,
    zip_postal_code VARCHAR(20) NULL,
    country VARCHAR(50) DEFAULT 'USA',
    relationship_type VARCHAR(50) DEFAULT 'Parent',
    notes TEXT NULL
);

CREATE INDEX idx_guardians_last_name ON guardians (last_name, first_name);

CREATE TABLE students_and_guardians (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id INTEGER NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL,
    primary_contact BOOLEAN DEFAULT TRUE,
    pickup_authorized BOOLEAN DEFAULT TRUE,
    emergency_contact BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_student_guardian UNIQUE (student_id, guardian_id)
);

CREATE INDEX idx_sg_student ON students_and_guardians (student_id);
CREATE INDEX idx_sg_guardian ON students_and_guardians (guardian_id);

CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Tardy', 'Excused')),
    reason VARCHAR(255) NULL,
    recorded_by VARCHAR(100) DEFAULT 'System'
);

CREATE INDEX idx_attendance_student_date ON student_attendance (student_id, attendance_date);
CREATE INDEX idx_attendance_date_status ON student_attendance (attendance_date, status);
`;

export interface QueryDefinition {
  id: string;
  name: string;
  description: string;
  sql: string;
}

export const ACCESS_QUERIES: QueryDefinition[] = [
  {
    id: "Students Extended",
    name: "Students Extended",
    description: "Calculates formatted Student Full Name, concatenated address, age from DOB, and attendance aggregates.",
    sql: `SELECT 
    s.[ID],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[First Name],
    s.[Last Name],
    s.[E-mail Address],
    s.[Level],
    s.[Room],
    s.[Special Circumstances],
    s.[Special Circumstances Notes],
    s.[Date of Birth],
    DateDiff("yyyy", s.[Date of Birth], Now()) + (DateSerial(Year(Now()), Month(s.[Date of Birth]), Day(s.[Date of Birth])) > Now()) AS [Age],
    s.[Address] & ", " & s.[City] & ", " & s.[State] & " " & s.[ZIP Postal Code] AS [Full Address],
    s.[Allergies],
    s.[Medications],
    s.[Emergency Contact Name],
    s.[Emergency Contact Phone],
    s.[Emergency Contact Relationship]
FROM [Students] AS s
ORDER BY s.[Last Name], s.[First Name];`
  },
  {
    id: "Guardians Extended",
    name: "Guardians Extended",
    description: "Formats Guardian Full Name, combines addresses, and counts linked dependent students.",
    sql: `SELECT 
    g.[ID],
    g.[Last Name] & ", " & g.[First Name] AS [Guardian Name],
    g.[Primary Phone],
    g.[Secondary Phone],
    g.[E-mail Address],
    g.[Address] & ", " & g.[City] & ", " & g.[State] & " " & g.[ZIP Postal Code] AS [Mailing Address],
    g.[Relationship Type],
    COUNT(sg.[Student ID]) AS [Linked Student Count]
FROM [Guardians] AS g
LEFT JOIN [Students and Guardians] AS sg ON g.[ID] = sg.[Guardian ID]
GROUP BY g.[ID], g.[Last Name], g.[First Name], g.[Primary Phone], g.[Secondary Phone], g.[E-mail Address], g.[Address], g.[City], g.[State], g.[ZIP Postal Code], g.[Relationship Type]
ORDER BY g.[Last Name], g.[First Name];`
  },
  {
    id: "Student Attendance Count",
    name: "Student Attendance Count",
    description: "Aggregates total attendance instances by student broken down by Present, Tardy, Absent, and Excused.",
    sql: `SELECT 
    s.[ID] AS [Student ID PK],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[Room],
    COUNT(a.[ID]) AS [Total Days Recorded],
    SUM(IIF(a.[Status] = 'Present', 1, 0)) AS [Total Present],
    SUM(IIF(a.[Status] = 'Tardy', 1, 0)) AS [Total Tardy],
    SUM(IIF(a.[Status] = 'Absent', 1, 0)) AS [Total Absent],
    SUM(IIF(a.[Status] = 'Excused', 1, 0)) AS [Total Excused]
FROM [Students] AS s
LEFT JOIN [Student Attendance] AS a ON s.[ID] = a.[Student ID]
GROUP BY s.[ID], s.[Student ID], s.[Last Name], s.[First Name], s.[Level], s.[Room]
ORDER BY s.[Last Name], s.[First Name];`
  },
  {
    id: "Student Attendance Extended",
    name: "Student Attendance Extended",
    description: "Daily attendance logs joined with student identity, homeroom, and grade level for date roll-call reports.",
    sql: `SELECT 
    a.[ID] AS [Attendance ID],
    a.[Attendance Date],
    a.[Status],
    a.[Reason],
    a.[Recorded By],
    s.[ID] AS [Student ID PK],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[Room]
FROM [Student Attendance] AS a
INNER JOIN [Students] AS s ON a.[Student ID] = s.[ID]
ORDER BY a.[Attendance Date] DESC, s.[Room], s.[Last Name];`
  },
  {
    id: "Students and Guardians Extended",
    name: "Students and Guardians Extended",
    description: "Full cross-relationship query joining Students, Junction links, and Guardians for emergency sheets.",
    sql: `SELECT 
    sg.[ID] AS [Relation ID],
    s.[ID] AS [Student ID PK],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[Room],
    s.[Special Circumstances],
    g.[ID] AS [Guardian ID PK],
    g.[Last Name] & ", " & g.[First Name] AS [Guardian Name],
    sg.[Relationship],
    sg.[Primary Contact],
    sg.[Pickup Authorized],
    sg.[Emergency Contact],
    g.[Primary Phone],
    g.[Secondary Phone],
    g.[E-mail Address] AS [Guardian Email],
    g.[Address] & ", " & g.[City] & ", " & g.[State] & " " & g.[ZIP Postal Code] AS [Guardian Address]
FROM ([Students and Guardians] AS sg
INNER JOIN [Students] AS s ON sg.[Student ID] = s.[ID])
INNER JOIN [Guardians] AS g ON sg.[Guardian ID] = g.[ID]
ORDER BY s.[Last Name], s.[First Name], sg.[Primary Contact] DESC;`
  }
];

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  groupBy: string;
  sortBy: string;
  underlyingQuery: string;
  sql: string;
}

export const ACCESS_REPORTS: ReportDefinition[] = [
  {
    id: "All Students",
    name: "All Students",
    description: "Complete student directory roster displaying all enrolled students alphabetically by level and name.",
    groupBy: "Level",
    sortBy: "Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Level],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Room],
    s.[E-mail Address],
    s.[Emergency Contact Name],
    s.[Emergency Contact Phone]
FROM [Students] AS s
ORDER BY s.[Level], s.[Last Name], s.[First Name];`
  },
  {
    id: "Allergies and Medications",
    name: "Allergies and Medications",
    description: "Urgent medical alert report for school nurse, gym teachers, and cafeteria staff detailing allergies and medications.",
    groupBy: "Room",
    sortBy: "Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Room],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[Allergies],
    s.[Medications],
    s.[Special Circumstances Notes],
    s.[Emergency Contact Name],
    s.[Emergency Contact Phone]
FROM [Students] AS s
WHERE (s.[Allergies] IS NOT NULL AND s.[Allergies] <> 'None')
   OR (s.[Medications] IS NOT NULL AND s.[Medications] <> 'None')
   OR (s.[Special Circumstances] = True)
ORDER BY s.[Room], s.[Last Name], s.[First Name];`
  },
  {
    id: "Emergency Contact Information",
    name: "Emergency Contact Information",
    description: "Comprehensive emergency binder sheets showing primary and secondary guardians, phone numbers, and pickup authorizations.",
    groupBy: "Student Name",
    sortBy: "Primary Contact DESC, Guardian Name",
    underlyingQuery: "Students and Guardians Extended",
    sql: `SELECT 
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Room],
    s.[Level],
    s.[Special Circumstances],
    s.[Emergency Contact Name] AS [Backup Contact Name],
    s.[Emergency Contact Phone] AS [Backup Contact Phone],
    g.[Last Name] & ", " & g.[First Name] AS [Guardian Name],
    sg.[Relationship],
    sg.[Primary Contact],
    sg.[Pickup Authorized],
    g.[Primary Phone] AS [Guardian Primary Phone],
    g.[Secondary Phone] AS [Guardian Alt Phone],
    g.[E-mail Address] AS [Guardian Email]
FROM ([Students] AS s
LEFT JOIN [Students and Guardians] AS sg ON s.[ID] = sg.[Student ID])
LEFT JOIN [Guardians] AS g ON sg.[Guardian ID] = g.[ID]
ORDER BY s.[Last Name], s.[First Name], sg.[Primary Contact] DESC;`
  },
  {
    id: "Guardian Information",
    name: "Guardian Information",
    description: "Alphabetical directory of parents/guardians, their full contact channels, and list of linked students.",
    groupBy: "Guardian Name",
    sortBy: "Last Name, First Name",
    underlyingQuery: "Guardians Extended",
    sql: `SELECT 
    g.[Last Name] & ", " & g.[First Name] AS [Guardian Name],
    g.[Primary Phone],
    g.[Secondary Phone],
    g.[E-mail Address],
    g.[Address] & ", " & g.[City] & ", " & g.[State] & " " & g.[ZIP Postal Code] AS [Address],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Student ID],
    s.[Level],
    s.[Room],
    sg.[Relationship]
FROM ([Guardians] AS g
LEFT JOIN [Students and Guardians] AS sg ON g.[ID] = sg.[Guardian ID])
LEFT JOIN [Students] AS s ON sg.[Student ID] = s.[ID]
ORDER BY g.[Last Name], g.[First Name], s.[Last Name];`
  },
  {
    id: "Student Address Book",
    name: "Student Address Book",
    description: "Mailing roster with student home addresses, city, state, postal code, and parent phone for postal mailouts.",
    groupBy: "None",
    sortBy: "Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Address],
    s.[City],
    s.[State],
    s.[ZIP Postal Code],
    s.[Level],
    s.[Emergency ContactPhone] AS [Home Contact Phone]
FROM [Students] AS s
ORDER BY s.[Last Name], s.[First Name];`
  },
  {
    id: "Student Attendance by Date",
    name: "Student Attendance by Date",
    description: "Daily roll-call summary showing attendance statuses (Present, Absent, Tardy, Excused) by homeroom.",
    groupBy: "Attendance Date, Room",
    sortBy: "Attendance Date DESC, Room, Last Name",
    underlyingQuery: "Student Attendance Extended",
    sql: `SELECT 
    a.[Attendance Date],
    s.[Room],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    a.[Status],
    a.[Reason],
    a.[Recorded By]
FROM [Student Attendance] AS a
INNER JOIN [Students] AS s ON a.[Student ID] = s.[ID]
ORDER BY a.[Attendance Date] DESC, s.[Room], s.[Last Name], s.[First Name];`
  },
  {
    id: "Student Phone List",
    name: "Student Phone List",
    description: "Compact telephone directory with student name, homeroom, primary guardian phone, and emergency phone.",
    groupBy: "None",
    sortBy: "Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[Room],
    s.[Emergency Contact Name],
    s.[Emergency Contact Phone],
    s.[E-mail Address]
FROM [Students] AS s
ORDER BY s.[Last Name], s.[First Name];`
  },
  {
    id: "Students Attendance by...",
    name: "Students Attendance by...",
    description: "Aggregated statistical attendance rates and counts by student, room, or grade level over the academic term.",
    groupBy: "Level, Room",
    sortBy: "Level, Room, Last Name",
    underlyingQuery: "Student Attendance Count",
    sql: `SELECT 
    s.[Level],
    s.[Room],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    COUNT(a.[ID]) AS [Total Recorded],
    SUM(IIF(a.[Status] = 'Present', 1, 0)) AS [Present],
    SUM(IIF(a.[Status] = 'Tardy', 1, 0)) AS [Tardy],
    SUM(IIF(a.[Status] = 'Absent', 1, 0)) AS [Absent],
    SUM(IIF(a.[Status] = 'Excused', 1, 0)) AS [Excused],
    ROUND((SUM(IIF(a.[Status] = 'Present', 1, 0)) * 100.0) / NULLIF(COUNT(a.[ID]), 0), 1) AS [Attendance Rate %]
FROM [Students] AS s
LEFT JOIN [Student Attendance] AS a ON s.[ID] = a.[Student ID]
GROUP BY s.[Level], s.[Room], s.[Student ID], s.[Last Name], s.[First Name]
ORDER BY s.[Level], s.[Room], s.[Last Name];`
  },
  {
    id: "Students by Circumstance",
    name: "Students by Circumstance",
    description: "Filtered report of all students with Special Circumstances = True, documenting IEP, 504, and medical protocols.",
    groupBy: "Level",
    sortBy: "Level, Last Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Level],
    s.[Room],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Special Circumstances Notes],
    s.[Allergies],
    s.[Medications],
    s.[Emergency Contact Name],
    s.[Emergency Contact Phone]
FROM [Students] AS s
WHERE s.[Special Circumstances] = True
ORDER BY s.[Level], s.[Last Name], s.[First Name];`
  },
  {
    id: "Students by Level",
    name: "Students by Level",
    description: "Student roster grouped by Grade Level / Academic Year with group head counts and classroom allocations.",
    groupBy: "Level",
    sortBy: "Level, Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Level],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Room],
    s.[E-mail Address],
    s.[Date of Birth],
    s.[Special Circumstances]
FROM [Students] AS s
ORDER BY s.[Level], s.[Last Name], s.[First Name];`
  },
  {
    id: "Students by Room",
    name: "Students by Room",
    description: "Classroom rosters grouped by Homeroom number for morning check-in and teacher distribution.",
    groupBy: "Room",
    sortBy: "Room, Last Name, First Name",
    underlyingQuery: "Students Extended",
    sql: `SELECT 
    s.[Room],
    s.[Student ID],
    s.[Last Name] & ", " & s.[First Name] AS [Student Name],
    s.[Level],
    s.[E-mail Address],
    s.[Emergency Contact Phone],
    s.[Special Circumstances]
FROM [Students] AS s
ORDER BY s.[Room], s.[Last Name], s.[First Name];`
  }
];
