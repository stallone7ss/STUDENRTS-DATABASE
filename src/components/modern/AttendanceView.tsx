/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalendarCheck, Check, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { localStore } from '../../lib/supabase';

export const AttendanceView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2026-11-01');
  const students = localStore.students;
  const attendanceLogs = localStore.attendance;

  const dateRecords = attendanceLogs.filter(a => a.attendanceDate === selectedDate);

  const getStudentStatus = (studentId: number) => {
    return dateRecords.find(a => a.studentId === studentId);
  };

  const handleRecord = (studentId: number, status: 'Present' | 'Absent' | 'Tardy' | 'Excused') => {
    const existing = attendanceLogs.find(a => a.studentId === studentId && a.attendanceDate === selectedDate);
    if (existing) {
      existing.status = status;
      localStore.notify();
    } else {
      localStore.attendance.unshift({
        id: Math.max(...localStore.attendance.map(a => a.id), 0) + 1,
        studentId,
        attendanceDate: selectedDate,
        status,
        recordedBy: 'Portal Admin'
      });
      localStore.notify();
    }
  };

  const presentCount = dateRecords.filter(a => a.status === 'Present').length;
  const absentCount = dateRecords.filter(a => a.status === 'Absent').length;
  const tardyCount = dateRecords.filter(a => a.status === 'Tardy').length;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h1 className="font-bold text-sm text-slate-900">Attendance Roll Call</h1>
          <p className="text-[11px] text-slate-500">Record daily check-ins, excused absences, and attendance counts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-4 px-6 pt-5 shrink-0">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-slate-400 text-[11px] block">Total Enrolled</span>
          <span className="text-lg font-bold text-slate-900 tabular-nums">{students.length}</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-slate-400 text-[11px] block">Present Today</span>
          <span className="text-lg font-bold text-emerald-700 tabular-nums">{presentCount}</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-slate-400 text-[11px] block">Tardy</span>
          <span className="text-lg font-bold text-amber-700 tabular-nums">{tardyCount}</span>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-slate-400 text-[11px] block">Absent</span>
          <span className="text-lg font-bold text-rose-700 tabular-nums">{absentCount}</span>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Status for {selectedDate}</th>
                <th className="px-4 py-3 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => {
                const rec = getStudentStatus(s.id);
                const currentStatus = rec?.status || 'Present';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600">{s.studentId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.lastName}, {s.firstName}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{s.room}</td>
                    <td className="px-4 py-3 text-slate-700">{s.level}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
                        currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        currentStatus === 'Tardy' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {currentStatus}
                      </span>
                      {rec?.reason && <span className="ml-2 text-slate-400 italic">({rec.reason})</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => handleRecord(s.id, 'Present')}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                            currentStatus === 'Present' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleRecord(s.id, 'Tardy')}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                            currentStatus === 'Tardy' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Tardy
                        </button>
                        <button
                          onClick={() => handleRecord(s.id, 'Absent')}
                          className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                            currentStatus === 'Absent' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
