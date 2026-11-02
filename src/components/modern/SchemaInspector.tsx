/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Copy, Check, Download, Layers, ShieldCheck, Code2, ArrowRight } from 'lucide-react';
import { SUPABASE_POSTGRES_SCHEMA } from '../../data/supabaseDdl';

export const SchemaInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ddl' | 'view' | 'architecture'>('ddl');

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_POSTGRES_SCHEMA], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase_student_management_schema.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewSql = `CREATE OR REPLACE VIEW view_students_extended AS
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
    -- Linked Primary Guardian Details via Lateral Join
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
) pg ON TRUE;`;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900">
              Supabase PostgreSQL Database Architecture
            </h1>
            <p className="text-[11px] text-slate-500">
              Normalized relational schema (DDL), constraints, and view_students_extended
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL DDL'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('ddl')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
            activeTab === 'ddl' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Complete Schema DDL (5 Tables + RLS)
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
            activeTab === 'view' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Database View: view_students_extended
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
            activeTab === 'architecture' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Relational Model & Integrity Rules
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'ddl' && (
          <div className="bg-slate-900 text-emerald-300 p-5 rounded-xl font-mono text-xs shadow-lg max-w-5xl mx-auto overflow-x-auto leading-relaxed border border-slate-800">
            <pre className="whitespace-pre-wrap">{SUPABASE_POSTGRES_SCHEMA}</pre>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <h2 className="font-bold text-sm text-slate-900 mb-1">
                Optimized Lateral Join: view_students_extended
              </h2>
              <p className="text-slate-600 text-xs leading-relaxed">
                This view aggregates student identity, homeroom, special circumstances, and calculates age from DOB, while joining the junction table <code>student_guardians</code> to automatically extract the student's primary guardian with contact phone and email in a single performant database query.
              </p>
            </div>
            <div className="bg-slate-900 text-emerald-300 p-5 rounded-xl font-mono text-xs shadow-lg overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre-wrap">{viewSql}</pre>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  1. students (1 : N) student_attendance
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Foreign key on <code>student_attendance.student_id</code> references <code>students.id</code> with <code>ON DELETE CASCADE</code>. When a student record is removed, attendance logs are cleaned up automatically.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  2. students (M : N) guardians
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Resolved via junction table <code>student_guardians</code> with unique composite constraint <code>(student_id, guardian_id)</code>, <code>primary_contact</code>, and <code>pickup_authorized</code> boolean flags.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  3. Performance Indexes
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  PostgreSQL B-Tree indexes on <code>students(last_name)</code>, <code>students(level)</code>, <code>students(room)</code>, and <code>student_attendance(attendance_date, status)</code> ensure instant real-time queries.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  4. Row-Level Security (RLS)
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Standard Supabase security architecture enforcing row-level security on all tables with explicit read, insert, update, and delete policies.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
