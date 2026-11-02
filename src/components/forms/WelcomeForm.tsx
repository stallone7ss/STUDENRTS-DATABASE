/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GraduationCap, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  FileText, 
  Database, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface WelcomeFormProps {
  onOpenStudentList: () => void;
  onNewStudent: () => void;
  onOpenAttendance: () => void;
  onOpenReport: (reportName: string) => void;
  onOpenArchitecture: () => void;
}

export const WelcomeForm: React.FC<WelcomeFormProps> = ({
  onOpenStudentList,
  onNewStudent,
  onOpenAttendance,
  onOpenReport,
  onOpenArchitecture
}) => {
  return (
    <div className="h-full overflow-y-auto bg-white p-6 max-w-5xl mx-auto">
      {/* Access Form Header Banner */}
      <div className="border-b border-slate-200 pb-5 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-900 text-white rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Student Management System
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Microsoft Access Solution Architecture & Academic Directory
            </p>
          </div>
        </div>

        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>Full Architecture Blueprints (DDL & SQL)</span>
        </button>
      </div>

      {/* Main Grid: Quick Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Student Directory */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 hover:border-red-800/40 transition-colors">
          <div className="w-10 h-10 rounded bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Student Directory</h2>
          <p className="text-xs text-slate-600 mb-4">
            Browse the active student enrollment roster, filter by level or homeroom, search by student name or ID.
          </p>
          <div className="space-y-2">
            <button
              onClick={onOpenStudentList}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-800 transition-colors"
            >
              <span>Open Student List</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={onNewStudent}
              className="w-full flex items-center justify-between px-3 py-2 bg-red-900 hover:bg-red-950 text-white rounded text-xs font-medium transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add New Student</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Attendance Tracking */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 hover:border-red-800/40 transition-colors">
          <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Attendance Records</h2>
          <p className="text-xs text-slate-600 mb-4">
            Record daily roll-call attendance, manage tardiness and excused absences, track institutional counts.
          </p>
          <div className="space-y-2">
            <button
              onClick={onOpenAttendance}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-800 transition-colors"
            >
              <span>Student Attendance Subform</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => onOpenReport('Student Attendance by Date')}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-800 transition-colors"
            >
              <span>Daily Attendance by Date</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Card 3: Administrative Reports */}
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 hover:border-red-800/40 transition-colors">
          <div className="w-10 h-10 rounded bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">Key Reports</h2>
          <p className="text-xs text-slate-600 mb-4">
            Generate printable rosters, medical alert cards for nurses, and emergency contact lists.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onOpenReport('Emergency Contact Information')}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-800 transition-colors"
            >
              <span>Emergency Contact Binder</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => onOpenReport('Allergies and Medications')}
              className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-800 transition-colors"
            >
              <span>Allergies & Medications</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Reverse-Engineering Architecture Highlights */}
      <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>System Reverse-Engineering Summary</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3 rounded border border-slate-200">
            <div className="text-slate-500 text-[11px]">Tables (6)</div>
            <div className="font-semibold text-slate-900 mt-0.5">Students, Guardians, Attendance...</div>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <div className="text-slate-500 text-[11px]">Extended Queries (5)</div>
            <div className="font-semibold text-slate-900 mt-0.5">Calculated ages, joins & counts</div>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <div className="text-slate-500 text-[11px]">Printable Reports (11)</div>
            <div className="font-semibold text-slate-900 mt-0.5">Emergency, Medical, Roster</div>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200">
            <div className="text-slate-500 text-[11px]">Macros & VBA</div>
            <div className="font-semibold text-slate-900 mt-0.5">AutoExec, Filters, modMapping</div>
          </div>
        </div>
      </div>
    </div>
  );
};
