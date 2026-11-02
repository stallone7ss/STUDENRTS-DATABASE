/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Table, Plus, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { 
  Student, 
  Guardian, 
  StudentGuardianRelation, 
  StudentAttendance, 
  FilterSetting, 
  SystemSetting 
} from '../../types/database';

interface TableDatasheetViewProps {
  tableName: string;
  students: Student[];
  guardians: Guardian[];
  relations: StudentGuardianRelation[];
  attendance: StudentAttendance[];
  filters: FilterSetting[];
  settings: SystemSetting[];
  onUpdateStudents?: (students: Student[]) => void;
}

export const TableDatasheetView: React.FC<TableDatasheetViewProps> = ({
  tableName,
  students,
  guardians,
  relations,
  attendance,
  filters,
  settings,
}) => {
  // Determine data rows and columns based on table
  let rows: any[] = [];
  let columns: { key: string; label: string; mono?: boolean }[] = [];

  switch (tableName) {
    case 'Students':
      rows = students;
      columns = [
        { key: 'id', label: 'ID', mono: true },
        { key: 'studentId', label: 'Student ID', mono: true },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'emailAddress', label: 'E-mail Address' },
        { key: 'level', label: 'Level' },
        { key: 'room', label: 'Room', mono: true },
        { key: 'specialCircumstances', label: 'Special Circumstances' },
        { key: 'dob', label: 'Date of Birth', mono: true },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'emergencyContactPhone', label: 'Emergency Phone', mono: true }
      ];
      break;
    case 'Guardians':
      rows = guardians;
      columns = [
        { key: 'id', label: 'ID', mono: true },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'relationshipType', label: 'Relationship Type' },
        { key: 'primaryPhone', label: 'Primary Phone', mono: true },
        { key: 'secondaryPhone', label: 'Secondary Phone', mono: true },
        { key: 'emailAddress', label: 'E-mail Address' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' }
      ];
      break;
    case 'Students and Guardians':
      rows = relations;
      columns = [
        { key: 'id', label: 'ID', mono: true },
        { key: 'studentId', label: 'Student ID (FK)', mono: true },
        { key: 'guardianId', label: 'Guardian ID (FK)', mono: true },
        { key: 'relationship', label: 'Relationship' },
        { key: 'primaryContact', label: 'Primary Contact' },
        { key: 'pickupAuthorized', label: 'Pickup Authorized' },
        { key: 'emergencyContact', label: 'Emergency Contact' }
      ];
      break;
    case 'Student Attendance':
      rows = attendance;
      columns = [
        { key: 'id', label: 'ID', mono: true },
        { key: 'studentId', label: 'Student ID (FK)', mono: true },
        { key: 'attendanceDate', label: 'Attendance Date', mono: true },
        { key: 'status', label: 'Status' },
        { key: 'reason', label: 'Reason' },
        { key: 'recordedBy', label: 'Recorded By' }
      ];
      break;
    case 'Filters':
      rows = filters;
      columns = [
        { key: 'id', label: 'Filter ID', mono: true },
        { key: 'filterName', label: 'Filter Name' },
        { key: 'filterField', label: 'Field' },
        { key: 'filterOperator', label: 'Operator' },
        { key: 'filterValue', label: 'Value' },
        { key: 'active', label: 'Active' },
        { key: 'description', label: 'Description' }
      ];
      break;
    case 'Settings':
      rows = settings;
      columns = [
        { key: 'id', label: 'Setting ID', mono: true },
        { key: 'settingName', label: 'Setting Name', mono: true },
        { key: 'settingValue', label: 'Setting Value' },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' }
      ];
      break;
    default:
      rows = [];
      columns = [];
  }

  const exportCsv = () => {
    if (rows.length === 0) return;
    const headerLine = columns.map(c => `"${c.label}"`).join(',');
    const rowLines = rows.map(r => 
      columns.map(c => {
        const val = r[c.key] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headerLine, ...rowLines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableName.replace(/\s+/g, '_')}_Table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs select-none">
      {/* Table Bar */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-blue-700 grid grid-cols-2 grid-rows-2 bg-blue-50">
            <div className="border-r border-b border-blue-400"></div>
            <div className="border-b border-blue-400"></div>
            <div className="border-r border-blue-400"></div>
            <div></div>
          </div>
          <span className="font-bold text-slate-800 text-sm">{tableName} : Table</span>
          <span className="text-[11px] text-slate-500 font-mono">({rows.length} rows)</span>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs font-medium"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Table CSV</span>
        </button>
      </div>

      {/* Datasheet Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-200 text-slate-800 sticky top-0 border-b border-slate-300 z-10">
            <tr>
              <th className="w-8 px-2 py-1.5 border-r border-slate-300 text-center text-slate-400 font-normal">#</th>
              {columns.map(col => (
                <th key={col.key} className="px-3 py-1.5 border-r border-slate-300 font-semibold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-blue-50/60 transition-colors">
                <td className="px-2 py-1 text-center border-r border-slate-200 bg-slate-100/60 text-slate-400 text-[10px] font-mono">
                  {idx + 1}
                </td>
                {columns.map(col => {
                  const val = row[col.key];
                  const isBoolean = typeof val === 'boolean';
                  return (
                    <td 
                      key={col.key} 
                      className={`px-3 py-1 border-r border-slate-200 truncate max-w-[240px] ${
                        col.mono ? 'font-mono text-slate-700' : 'text-slate-800'
                      }`}
                    >
                      {isBoolean ? (
                        val ? (
                          <span className="text-emerald-700 font-semibold">True</span>
                        ) : (
                          <span className="text-slate-400">False</span>
                        )
                      ) : (
                        val ?? <span className="text-slate-300 italic">Null</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Datasheet View • Primary Key Enforced</span>
        <span>{rows.length} total records</span>
      </div>
    </div>
  );
};
