/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Copy, Check, Download, Layers, ShieldCheck, Code2, ArrowRight, ExternalLink, AlertTriangle, Key, Terminal, HelpCircle } from 'lucide-react';
import { SUPABASE_POSTGRES_SCHEMA } from '../../data/supabaseDdl';
import { supabaseConfigStatus, isRealSupabaseConfigured } from '../../lib/supabase';

export const SchemaInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'ddl' | 'view' | 'architecture' | 'setup'>('ddl');

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
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-1 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ddl')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'ddl' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Complete Schema DDL (5 Tables + RLS)
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'view' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Database View: view_students_extended
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'architecture' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          Relational Model & Integrity Rules
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'setup' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Supabase Connection & Setup Guide</span>
          {supabaseConfigStatus.isInvalidFormat && (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
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

        {activeTab === 'setup' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Card */}
            <div className={`p-4 rounded-xl border ${
              isRealSupabaseConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : supabaseConfigStatus.isInvalidFormat
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                {isRealSupabaseConfigured ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : supabaseConfigStatus.isInvalidFormat ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Database className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {isRealSupabaseConfigured
                      ? 'Connected to Live Supabase Project'
                      : supabaseConfigStatus.isInvalidFormat
                      ? 'Invalid URL Detected: https://supabase.co'
                      : 'Local PostgreSQL Engine Active (Zero-Config)'}
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed">
                    {isRealSupabaseConfigured
                      ? `Successfully authenticating against ${supabaseConfigStatus.projectUrl || 'Supabase Cloud'}.`
                      : supabaseConfigStatus.isInvalidFormat
                      ? supabaseConfigStatus.invalidReason
                      : 'The application is running with a reactive in-memory PostgreSQL engine seeded with all legacy Access students, guardians, and attendance logs. Follow the steps below when you wish to link your Supabase cloud project.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Connection Instructions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Understanding Your Supabase Project API URL</span>
              </h2>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  A common point of confusion is typing or pasting <code className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-mono font-semibold">https://supabase.co</code>. That address is the <strong>marketing homepage</strong> of Supabase, not your project's REST API endpoint.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3">
                    <span className="font-bold text-rose-800 block mb-1">❌ Incorrect (Landing Page):</span>
                    <code className="text-rose-700 font-mono text-[11px] block">https://supabase.co</code>
                    <p className="text-[11px] text-rose-600 mt-1">Causes 404/invalid URL errors because it lacks your project subdomain.</p>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3">
                    <span className="font-bold text-emerald-800 block mb-1">✅ Correct Project URL Format:</span>
                    <code className="text-emerald-700 font-mono text-[11px] block">https://&lt;project-ref&gt;.supabase.co</code>
                    <p className="text-[11px] text-emerald-600 mt-1">Example: <span className="font-mono">https://abcdefghijklm.supabase.co</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>Where to Find Your Credentials in Supabase Dashboard</span>
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li>Log in to your account at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline inline-flex items-center gap-1">supabase.com/dashboard <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Select your project (or click <strong>New project</strong> to create one).</li>
                  <li>Click the <strong>Settings (gear icon)</strong> at the bottom of the left sidebar, then select <strong>API</strong>.</li>
                  <li>Under <strong>Project URL</strong>, copy the URL ending in <code className="font-mono">.supabase.co</code>.</li>
                  <li>Under <strong>Project API Keys</strong>, copy the public <code className="font-mono">anon</code> key.</li>
                </ol>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>Configure in Environment (.env)</span>
                  </h2>
                  <button
                    onClick={() => {
                      const envText = `VITE_SUPABASE_URL="https://your-project-id.supabase.co"\nVITE_SUPABASE_ANON_KEY="your-anon-public-key"`;
                      navigator.clipboard.writeText(envText);
                      setCopiedEnv(true);
                      setTimeout(() => setCopiedEnv(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors"
                  >
                    {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Copied' : 'Copy .env Template'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Create or edit your <code className="font-mono font-semibold">.env</code> file in the application root directory with:
                </p>
                <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{`# In your .env file:
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"`}</pre>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                  <span>Deploy the Database Schema & Views</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Once connected, your Supabase project needs the 5 normalized tables and the <code className="font-mono">view_students_extended</code> view.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('ddl')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open SQL DDL Script</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied SQL' : 'Copy All SQL (Tables + Views + RLS)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
