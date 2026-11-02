/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, CheckCircle2, AlertCircle, Clock, Check } from 'lucide-react';
import { StudentAttendance } from '../../types/database';

interface AttendanceSubformProps {
  studentId: number;
  attendanceRecords: StudentAttendance[];
  onAddAttendance: (newRecord: Omit<StudentAttendance, 'id'>) => void;
  onDeleteAttendance: (attendanceId: number) => void;
}

export const AttendanceSubform: React.FC<AttendanceSubformProps> = ({
  studentId,
  attendanceRecords,
  onAddAttendance,
  onDeleteAttendance,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Present' | 'Absent' | 'Tardy' | 'Excused'>('Present');
  const [reason, setReason] = useState('');
  const [recordedBy, setRecordedBy] = useState('Homeroom Teacher');

  // Filter attendance for this specific student
  const studentAttendance = attendanceRecords
    .filter(a => a.studentId === studentId)
    .sort((a, b) => b.attendanceDate.localeCompare(a.attendanceDate));

  const handleSave = () => {
    onAddAttendance({
      studentId,
      attendanceDate: date,
      status,
      reason: reason.trim() || undefined,
      recordedBy,
    });
    setReason('');
    setIsAdding(false);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Present':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-medium">Present</span>;
      case 'Absent':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-medium">Absent</span>;
      case 'Tardy':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium">Tardy</span>;
      case 'Excused':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-medium">Excused</span>;
      default:
        return <span>{st}</span>;
    }
  };

  return (
    <div className="border border-slate-300 rounded bg-white overflow-hidden text-xs">
      {/* Subform Header */}
      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Attendance Subform</span>
          <span className="text-[11px] text-slate-500 font-mono">
            LinkMasterFields: [ID] | LinkChildFields: [Student ID]
          </span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-[11px] font-medium"
        >
          <Plus className="w-3 h-3 text-emerald-700" />
          <span>Record Attendance</span>
        </button>
      </div>

      {/* Add New Attendance Record Form */}
      {isAdding && (
        <div className="p-2.5 bg-emerald-50/50 border-b border-emerald-200 flex flex-wrap items-center gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
            />
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Tardy">Tardy</option>
              <option value="Excused">Excused</option>
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <span className="text-[10px] text-slate-500 block">Reason / Excuse:</span>
            <input
              type="text"
              placeholder="e.g. Doctor note, Traffic, Field trip"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <button
              onClick={handleSave}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium"
            >
              Save Record
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subform Datasheet */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
          <tr>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Date</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Status</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Reason / Notes</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Recorded By</th>
            <th className="px-2 py-1 font-semibold text-right">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {studentAttendance.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">
                No attendance records logged for this student yet.
              </td>
            </tr>
          ) : (
            studentAttendance.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-1.5 border-r border-slate-100 font-mono text-slate-800">
                  {rec.attendanceDate}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-100">
                  {getStatusBadge(rec.status)}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-100 text-slate-600">
                  {rec.reason || '-'}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-100 text-slate-500">
                  {rec.recordedBy}
                </td>
                <td className="px-2 py-1.5 text-right">
                  <button
                    onClick={() => onDeleteAttendance(rec.id)}
                    className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
