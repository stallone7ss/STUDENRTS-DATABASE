/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Layers, 
  Scroll, 
  Code, 
  Table, 
  ArrowRight 
} from 'lucide-react';
import { SQL_DDL_ACCESS, SQL_DDL_POSTGRES, ACCESS_QUERIES, ACCESS_REPORTS } from '../../data/sqlDefinitions';
import { ACCESS_MACROS, VBA_MOD_MAPPING } from '../../data/vbaCode';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'ddl' | 'reports' | 'forms' | 'macros'>('ddl');
  const [sqlDialect, setSqlDialect] = useState<'access' | 'postgres'>('access');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeDdl = sqlDialect === 'access' ? SQL_DDL_ACCESS : SQL_DDL_POSTGRES;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([activeDdl], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_management_schema_${sqlDialect}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#8b1f24] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-300" />
            <div>
              <h1 className="text-sm font-bold tracking-tight">
                Microsoft Access "Student Management" — Full Reverse Engineering Architecture
              </h1>
              <p className="text-[11px] text-red-200">
                SQL DDL Schemas • Queries & Reports • Forms UI Design • Automation & VBA modMapping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-900 rounded text-red-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSection('ddl')}
              className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
                activeSection === 'ddl'
                  ? 'border-red-900 text-red-950 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Database Schema (SQL DDL)
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
                activeSection === 'reports'
                  ? 'border-red-900 text-red-950 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Queries & Reports Architecture
            </button>
            <button
              onClick={() => setActiveSection('forms')}
              className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
                activeSection === 'forms'
                  ? 'border-red-900 text-red-950 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Forms & UI Design
            </button>
            <button
              onClick={() => setActiveSection('macros')}
              className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
                activeSection === 'macros'
                  ? 'border-red-900 text-red-950 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Automation, Macros & VBA
            </button>
          </div>

          {activeSection === 'ddl' && (
            <div className="flex items-center gap-2 py-1">
              <div className="flex items-center bg-slate-200 p-0.5 rounded border border-slate-300">
                <button
                  onClick={() => setSqlDialect('access')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    sqlDialect === 'access' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Access ACE / Jet
                </button>
                <button
                  onClick={() => setSqlDialect('postgres')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    sqlDialect === 'postgres' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  PostgreSQL / ANSI
                </button>
              </div>

              <button
                onClick={() => handleCopy(activeDdl)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>

              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#8b1f24] hover:bg-[#72191d] text-white rounded font-medium text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {/* Section 1: SQL DDL */}
          {activeSection === 'ddl' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  Entity Relationship & Table Specifications
                </h2>
                <p className="text-slate-600 text-xs mb-4">
                  The Microsoft Access template models a classical 3NF educational administration schema with full referential integrity:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-bold text-slate-900">1. Students (1 : N) Student Attendance</div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Each student can have multiple daily attendance records logged. Deleting a student cascades deletions to attendance history.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-bold text-slate-900">2. Students (M : N) Guardians via Junction</div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      The table <code>Students and Guardians</code> resolves the M:N relationship with flags: <code>Primary Contact</code>, <code>Pickup Authorized</code>, <code>Emergency Contact</code>.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-bold text-slate-900">3. Filters Table</div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Stores user-defined or default filter criteria (field, operator, value, active state) used by the Filters macro.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-bold text-slate-900">4. Settings Table</div>
                    <p className="text-slate-600 text-[11px] mt-1">
                      Key-value registry storing school name, active school year, homeroom list, and map provider URL for <code>modMapping</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* DDL Code Box */}
              <div className="border border-slate-300 rounded overflow-hidden shadow-xs">
                <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between font-mono text-xs">
                  <span>DDL Schema Script ({sqlDialect.toUpperCase()})</span>
                  <button
                    onClick={() => handleCopy(activeDdl)}
                    className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="bg-[#1e1e1e] p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px]">
                  <pre className="whitespace-pre-wrap leading-relaxed">{activeDdl}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Queries & Reports */}
          {activeSection === 'reports' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  Queries Architecture (Calculated Fields & Joins)
                </h2>
                <div className="space-y-3">
                  {ACCESS_QUERIES.map(q => (
                    <div key={q.id} className="border border-slate-200 rounded p-3 bg-slate-50">
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs mb-1">
                        <span>{q.name}</span>
                        <span className="font-mono text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">Query</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-2">{q.description}</p>
                      <pre className="bg-slate-900 text-teal-200 p-2.5 rounded font-mono text-[11px] overflow-x-auto">{q.sql}</pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  All 11 Reports Architecture & Grouping Logic
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ACCESS_REPORTS.map(r => (
                    <div key={r.id} className="border border-slate-200 rounded p-3 bg-slate-50">
                      <div className="font-bold text-emerald-900 text-xs">{r.name}</div>
                      <div className="text-[11px] text-slate-600 mt-1">{r.description}</div>
                      <div className="mt-2 text-[10px] text-slate-500 font-mono space-y-0.5">
                        <div><strong>Group By:</strong> {r.groupBy}</div>
                        <div><strong>Sort By:</strong> {r.sortBy}</div>
                        <div><strong>RecordSource:</strong> {r.underlyingQuery}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Forms & UI Design */}
          {activeSection === 'forms' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  Form Structure & Navigation Mapping
                </h2>
                <p className="text-slate-600 text-xs mb-4">
                  The Microsoft Access application layout follows the standard split-form and master-detail architecture:
                </p>

                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <h3 className="font-bold text-slate-900 mb-1">1. Form: 'Student List' (Default Data Workspace)</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      <li><strong>Top Ribbon Actions:</strong> <code>New Student</code> (calls <code>DoCmd.OpenForm "Student Details", , , , acFormAdd</code>) and <code>Add From Outlook</code> (VBA MAPI integration).</li>
                      <li><strong>Filtering Controls:</strong> Dropdown combos for <code>Level</code> and <code>Room</code>, with checkbox for <code>Special Circumstances</code> bound to the <code>Filters</code> macro.</li>
                      <li><strong>Incremental Search:</strong> Textbox <code>txtSearch</code> bound to <code>Search</code> macro executing wildcard matching.</li>
                      <li><strong>Datasheet View:</strong> Displays <code>Student ID</code>, <code>First Name</code>, <code>Last Name</code>, <code>E-mail Address</code>, <code>Level</code>, <code>Room</code>, and <code>Special Circumstances</code>.</li>
                      <li><strong>Record Navigation:</strong> Access record counter with First, Previous, Next, Last, and New record buttons.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <h3 className="font-bold text-slate-900 mb-1">2. Form: 'Student Details' & Subforms</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      <li><strong>Master Form:</strong> Displays full demographics, address, medical flags (allergies/medications), and photo.</li>
                      <li><strong>Guardians Subform:</strong> Child datasheet control linked via <code>LinkMasterFields: [ID]</code> and <code>LinkChildFields: [Student ID]</code>. Enables assigning parents with pickup authorization.</li>
                      <li><strong>Attendance Subform:</strong> Child datasheet control linked via <code>LinkMasterFields: [ID]</code> and <code>LinkChildFields: [Student ID]</code> for logging dates, tardiness, and excused notes.</li>
                      <li><strong>Mapping Action:</strong> Command button <code>cmdMapAddress</code> that calls <code>modMapping.ShowMapForAddress</code>.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <h3 className="font-bold text-slate-900 mb-1">3. Form: 'Welcome' (Launchpad)</h3>
                    <p className="text-slate-700 text-[11px]">
                      Opened by the <code>AutoExec</code> macro on database launch. Displays institutional greeting, academic year, quick launch buttons to open the Student List, record attendance, and print reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Automation & Macros */}
          {activeSection === 'macros' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  Automation Logic & Macros
                </h2>
                <div className="space-y-4">
                  {ACCESS_MACROS.map(m => (
                    <div key={m.name} className="border border-slate-200 rounded p-3 bg-slate-50">
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs mb-1">
                        <span>Macro: {m.name}</span>
                        <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {m.trigger}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-2">{m.purpose}</p>
                      <pre className="bg-slate-900 text-amber-200 p-2.5 rounded font-mono text-[11px] overflow-x-auto">{m.vbaEquivalent}</pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded p-4 bg-white shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  VBA Module: modMapping
                </h2>
                <p className="text-slate-600 text-[11px] mb-3">
                  This standard module builds URL query strings from street, city, state, and zip parameters, retrieves the <code>MapProviderUrl</code> from <code>Settings</code>, and calls <code>Application.FollowHyperlink</code> or the Win32 <code>ShellExecute</code> API to show student or guardian addresses in the browser or an embedded browser control.
                </p>
                <div className="bg-[#1e1e1e] p-3 rounded font-mono text-xs text-[#9cdcfe] overflow-x-auto max-h-64">
                  <pre className="whitespace-pre-wrap">{VBA_MOD_MAPPING}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Microsoft Access Reverse-Engineered Blueprint • Relational 3NF Model
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded text-xs transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
