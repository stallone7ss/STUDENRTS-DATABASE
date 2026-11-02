/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Layers, Play, Code, Copy, Check, Download } from 'lucide-react';
import { Student, Guardian, StudentGuardianRelation, StudentAttendance } from '../../types/database';
import { ACCESS_QUERIES } from '../../data/sqlDefinitions';

interface QueryDataViewProps {
  queryName: string;
  students: Student[];
  guardians: Guardian[];
  relations: StudentGuardianRelation[];
  attendance: StudentAttendance[];
}

export const QueryDataView: React.FC<QueryDataViewProps> = ({
  queryName,
  students,
  guardians,
  relations,
  attendance,
}) => {
  const [viewMode, setViewMode] = useState<'data' | 'sql'>('data');
  const [copied, setCopied] = useState(false);

  const queryDef = ACCESS_QUERIES.find(q => q.name.toLowerCase() === queryName.toLowerCase()) || ACCESS_QUERIES[0];

  // Execute in-memory query matching Access SQL logic
  const { columns, rows } = useMemo(() => {
    switch (queryDef.name) {
      case 'Students Extended': {
        const cols = [
          'ID', 'Student ID', 'Student Name', 'Level', 'Room', 'Special Circumstances', 'Age', 'Full Address', 'Emergency Phone'
        ];
        const data = students.map(s => {
          const dobYear = new Date(s.dob).getFullYear();
          const currentYear = 2026;
          const age = currentYear - dobYear;
          return {
            'ID': s.id,
            'Student ID': s.studentId,
            'Student Name': `${s.lastName}, ${s.firstName}`,
            'Level': s.level,
            'Room': s.room,
            'Special Circumstances': s.specialCircumstances ? 'True' : 'False',
            'Age': age,
            'Full Address': `${s.address}, ${s.city}, ${s.state} ${s.zipPostalCode}`,
            'Emergency Phone': s.emergencyContactPhone
          };
        });
        return { columns: cols, rows: data };
      }

      case 'Guardians Extended': {
        const cols = [
          'ID', 'Guardian Name', 'Primary Phone', 'Secondary Phone', 'E-mail Address', 'Mailing Address', 'Relationship Type', 'Linked Student Count'
        ];
        const data = guardians.map(g => {
          const linkedCount = relations.filter(r => r.guardianId === g.id).length;
          return {
            'ID': g.id,
            'Guardian Name': `${g.lastName}, ${g.firstName}`,
            'Primary Phone': g.primaryPhone,
            'Secondary Phone': g.secondaryPhone || '-',
            'E-mail Address': g.emailAddress,
            'Mailing Address': `${g.address}, ${g.city}, ${g.state} ${g.zipPostalCode}`,
            'Relationship Type': g.relationshipType,
            'Linked Student Count': linkedCount
          };
        });
        return { columns: cols, rows: data };
      }

      case 'Student Attendance Count': {
        const cols = [
          'Student ID', 'Student Name', 'Level', 'Room', 'Total Days', 'Present', 'Tardy', 'Absent', 'Excused'
        ];
        const data = students.map(s => {
          const att = attendance.filter(a => a.studentId === s.id);
          const present = att.filter(a => a.status === 'Present').length;
          const tardy = att.filter(a => a.status === 'Tardy').length;
          const absent = att.filter(a => a.status === 'Absent').length;
          const excused = att.filter(a => a.status === 'Excused').length;
          return {
            'Student ID': s.studentId,
            'Student Name': `${s.lastName}, ${s.firstName}`,
            'Level': s.level,
            'Room': s.room,
            'Total Days': att.length,
            'Present': present,
            'Tardy': tardy,
            'Absent': absent,
            'Excused': excused
          };
        });
        return { columns: cols, rows: data };
      }

      case 'Student Attendance Extended': {
        const cols = [
          'Attendance Date', 'Status', 'Room', 'Student ID', 'Student Name', 'Level', 'Reason', 'Recorded By'
        ];
        const data = attendance.map(a => {
          const s = students.find(st => st.id === a.studentId);
          return {
            'Attendance Date': a.attendanceDate,
            'Status': a.status,
            'Room': s?.room || 'Unknown',
            'Student ID': s?.studentId || 'N/A',
            'Student Name': s ? `${s.lastName}, ${s.firstName}` : 'Unknown',
            'Level': s?.level || 'N/A',
            'Reason': a.reason || '-',
            'Recorded By': a.recordedBy
          };
        }).sort((a, b) => b['Attendance Date'].localeCompare(a['Attendance Date']));
        return { columns: cols, rows: data };
      }

      case 'Students and Guardians Extended': {
        const cols = [
          'Student ID', 'Student Name', 'Level', 'Room', 'Guardian Name', 'Relationship', 'Primary Contact', 'Pickup Authorized', 'Guardian Phone', 'Guardian Email'
        ];
        const data = relations.map(r => {
          const s = students.find(st => st.id === r.studentId);
          const g = guardians.find(gd => gd.id === r.guardianId);
          return {
            'Student ID': s?.studentId || 'N/A',
            'Student Name': s ? `${s.lastName}, ${s.firstName}` : 'Unknown',
            'Level': s?.level || 'N/A',
            'Room': s?.room || 'N/A',
            'Guardian Name': g ? `${g.lastName}, ${g.firstName}` : 'Unknown',
            'Relationship': r.relationship,
            'Primary Contact': r.primaryContact ? 'Yes' : 'No',
            'Pickup Authorized': r.pickupAuthorized ? 'Yes' : 'No',
            'Guardian Phone': g?.primaryPhone || 'N/A',
            'Guardian Email': g?.emailAddress || 'N/A'
          };
        });
        return { columns: cols, rows: data };
      }

      default:
        return { columns: [], rows: [] };
    }
  }, [queryDef, students, guardians, relations, attendance]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(queryDef.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs select-none">
      {/* Query Bar */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-teal-700 bg-teal-50 flex items-center justify-center">
            <div className="w-2 h-2 border-t-2 border-r-2 border-teal-600"></div>
          </div>
          <span className="font-bold text-slate-800 text-sm">{queryDef.name} : Query</span>
          <span className="text-[11px] text-slate-500 font-mono">({rows.length} records returned)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200 p-0.5 rounded border border-slate-300">
            <button
              onClick={() => setViewMode('data')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'data' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Datasheet View
            </button>
            <button
              onClick={() => setViewMode('sql')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'sql' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SQL View
            </button>
          </div>

          {viewMode === 'sql' && (
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Description Banner */}
      <div className="px-3 py-1.5 bg-teal-50/70 border-b border-teal-200 text-[11px] text-teal-900">
        {queryDef.description}
      </div>

      {/* View Mode Switcher */}
      {viewMode === 'data' ? (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-200 text-slate-800 sticky top-0 border-b border-slate-300 z-10">
              <tr>
                <th className="w-8 px-2 py-1.5 border-r border-slate-300 text-center text-slate-400 font-normal">#</th>
                {columns.map(col => (
                  <th key={col} className="px-3 py-1.5 border-r border-slate-300 font-semibold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-teal-50/50 transition-colors">
                  <td className="px-2 py-1 text-center border-r border-slate-200 bg-slate-100/60 text-slate-400 text-[10px] font-mono">
                    {idx + 1}
                  </td>
                  {columns.map(col => (
                    <td key={col} className="px-3 py-1 border-r border-slate-200 text-slate-800 truncate max-w-[240px]">
                      {(row as Record<string, any>)[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs">
          <pre className="whitespace-pre-wrap leading-relaxed text-teal-200">
            {queryDef.sql}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Query View • SELECT Statement</span>
        <span>{rows.length} rows processed</span>
      </div>
    </div>
  );
};
