/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Mail, 
  Phone, 
  UserCheck, 
  CalendarCheck, 
  HeartPulse, 
  GraduationCap,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { ExtendedStudentView } from './StudentList';
import { localStore } from '../../lib/supabase';

interface StudentDetailDrawerProps {
  student: ExtendedStudentView | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onOpenMap: (address: string) => void;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  onDelete,
  onOpenMap,
}) => {
  if (!student) return null;

  // Retrieve linked guardians and attendance from localStore
  const guardians = localStore.guardians;
  const relations = localStore.relations.filter(r => r.studentId === student.id);
  const attendanceLogs = localStore.attendance.filter(a => a.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {student.first_name} {student.last_name}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="font-mono text-emerald-400">{student.student_id}</span>
                <span>•</span>
                <span>{student.level}</span>
                <span>•</span>
                <span className="font-mono">{student.room}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Special Circumstances Alert */}
          {student.special_circumstances && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Special Circumstances (IEP / Medical Protocol)</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                {student.special_circumstances_notes || 'Active accommodation guideline on file.'}
              </p>
            </div>
          )}

          {/* Quick Demographics */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Student Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Email Address:</span>
                <a href={`mailto:${student.email_address}`} className="text-blue-600 hover:underline font-medium">
                  {student.email_address}
                </a>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Date of Birth & Age:</span>
                <span className="font-medium text-slate-800 font-mono">
                  {student.date_of_birth} ({student.age ?? '16'} yrs)
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Gender:</span>
                <span className="font-medium text-slate-800">{student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : 'Other'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Homeroom:</span>
                <span className="font-medium text-slate-800 font-mono">{student.room}</span>
              </div>
            </div>
          </div>

          {/* Residence & Mapping */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Residential Address
              </h3>
              <button
                onClick={() => onOpenMap(student.full_address || `${student.address}, ${student.city}`)}
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Geocode on Map</span>
              </button>
            </div>
            <p className="text-slate-700 font-medium text-xs">
              {student.full_address || `${student.address}, ${student.city}, ${student.state} ${student.zip_postal_code}`}
            </p>
          </div>

          {/* Linked Guardians */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Linked Guardians & Caregivers ({relations.length})</span>
            </h3>

            {relations.length === 0 ? (
              <p className="text-slate-400 italic">No guardians linked in database.</p>
            ) : (
              <div className="space-y-2 pt-1">
                {relations.map(rel => {
                  const g = guardians.find(guard => guard.id === rel.guardianId);
                  return (
                    <div key={rel.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {g?.firstName} {g?.lastName}
                          <span className="ml-1.5 text-[10px] text-slate-500 font-normal">({rel.relationship})</span>
                          {rel.primaryContact && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {g?.primaryPhone} • {g?.emailAddress}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Health & Allergies */}
          <div className="border border-rose-200 bg-rose-50/30 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Medical Directives</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Known Allergies:</span>
                <span className="font-semibold text-rose-800">{student.allergies || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Prescription Medications:</span>
                <span className="font-semibold text-slate-800">{student.medications || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>Recent Attendance Logs ({attendanceLogs.length})</span>
            </h3>
            <div className="space-y-1">
              {attendanceLogs.map(a => (
                <div key={a.id} className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-600">{a.attendanceDate}</span>
                  <span className={`font-semibold ${
                    a.status === 'Present' ? 'text-emerald-700' : a.status === 'Tardy' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {a.status}
                  </span>
                  <span className="text-slate-400">{a.reason || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete student ${student.first_name} ${student.last_name}?`)) {
                onDelete(student.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-rose-700 hover:text-rose-900 font-medium text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Student Record</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
