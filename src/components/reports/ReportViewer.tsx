/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Printer, Download, Code, FileText, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Student, Guardian, StudentGuardianRelation, StudentAttendance } from '../../types/database';
import { ACCESS_REPORTS } from '../../data/sqlDefinitions';

interface ReportViewerProps {
  reportName: string;
  students: Student[];
  guardians: Guardian[];
  relations: StudentGuardianRelation[];
  attendance: StudentAttendance[];
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reportName,
  students,
  guardians,
  relations,
  attendance,
}) => {
  const [showSql, setShowSql] = useState(false);

  const reportDef = ACCESS_REPORTS.find(r => r.name.toLowerCase() === reportName.toLowerCase()) || ACCESS_REPORTS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    alert(`Report export for "${reportDef.name}" initiated.`);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 text-xs select-none">
      {/* Report Preview Control Strip */}
      <div className="bg-slate-200 p-2 border-b border-slate-300 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-emerald-700 bg-emerald-600 rounded-[1px] flex items-center justify-center">
            <div className="w-2 h-0.5 bg-white mb-0.5"></div>
          </div>
          <span className="font-bold text-slate-800 text-sm">{reportDef.name} : Report</span>
          <span className="text-[11px] text-slate-500 font-mono">
            [Group by: {reportDef.groupBy} • Sort by: {reportDef.sortBy}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSql(!showSql)}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs font-medium"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span>{showSql ? 'Hide SQL Logic' : 'View Report SQL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {showSql && (
        <div className="bg-slate-900 text-emerald-300 p-3 font-mono text-xs border-b border-slate-800 max-h-40 overflow-auto">
          <div className="text-[10px] text-slate-400 mb-1">Underlying Query / RecordSource:</div>
          <pre className="whitespace-pre-wrap">{reportDef.sql}</pre>
        </div>
      )}

      {/* Access Report Sheet Paper (Simulating 8.5" x 11" Paper Preview) */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-4xl bg-white border border-slate-300 shadow-md p-8 min-h-[750px] flex flex-col justify-between text-slate-800 print:shadow-none print:border-none print:p-0">
          <div>
            {/* Report Header */}
            <div className="border-b-2 border-red-900 pb-3 mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-red-900 tracking-tight">
                  Northwood Academy
                </h1>
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  {reportDef.name}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">{reportDef.description}</p>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono">
                <div>Academic Year: 2026-2027</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Dynamic Report Content based on selected report */}
            {reportDef.id === 'All Students' && (
              <div className="space-y-4">
                {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(lvl => {
                  const levelStudents = students.filter(s => s.level === lvl);
                  if (levelStudents.length === 0) return null;
                  return (
                    <div key={lvl} className="border border-slate-200 rounded overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                        <span>Level: {lvl}</span>
                        <span className="font-normal text-slate-500 font-mono">{levelStudents.length} Students</span>
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="px-3 py-1 font-semibold">Student ID</th>
                            <th className="px-3 py-1 font-semibold">Student Name</th>
                            <th className="px-3 py-1 font-semibold">Room</th>
                            <th className="px-3 py-1 font-semibold">E-mail</th>
                            <th className="px-3 py-1 font-semibold">Emergency Contact</th>
                            <th className="px-3 py-1 font-semibold">Emergency Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {levelStudents.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/50">
                              <td className="px-3 py-1.5 font-mono text-slate-600">{s.studentId}</td>
                              <td className="px-3 py-1.5 font-medium text-slate-900">{s.lastName}, {s.firstName}</td>
                              <td className="px-3 py-1.5 font-mono">{s.room}</td>
                              <td className="px-3 py-1.5 text-blue-700 underline truncate max-w-[160px]">{s.emailAddress}</td>
                              <td className="px-3 py-1.5">{s.emergencyContactName}</td>
                              <td className="px-3 py-1.5 font-mono">{s.emergencyContactPhone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}

            {reportDef.id === 'Allergies and Medications' && (
              <div className="space-y-3">
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  <span className="font-semibold">Confidential Health Directive for School Medical Personnel</span>
                </div>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="px-3 py-1.5 font-semibold">Student Name</th>
                      <th className="px-3 py-1.5 font-semibold">Room</th>
                      <th className="px-3 py-1.5 font-semibold">Known Allergies</th>
                      <th className="px-3 py-1.5 font-semibold">Medications</th>
                      <th className="px-3 py-1.5 font-semibold">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.filter(s => s.allergies !== 'None' || s.medications !== 'None' || s.specialCircumstances).map(s => (
                      <tr key={s.id} className="hover:bg-rose-50/20">
                        <td className="px-3 py-2 font-bold text-slate-900">
                          {s.lastName}, {s.firstName}
                          <div className="text-[10px] font-normal text-slate-500 font-mono">{s.studentId}</div>
                        </td>
                        <td className="px-3 py-2 font-mono">{s.room}</td>
                        <td className="px-3 py-2 font-medium text-rose-800">{s.allergies || 'None'}</td>
                        <td className="px-3 py-2 text-slate-700">{s.medications || 'None'}</td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-slate-900">{s.emergencyContactName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{s.emergencyContactPhone} ({s.emergencyContactRelationship})</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportDef.id === 'Emergency Contact Information' && (
              <div className="space-y-4">
                {students.map(s => {
                  const studentRels = relations.filter(r => r.studentId === s.id);
                  return (
                    <div key={s.id} className="border border-slate-200 rounded p-3 bg-slate-50/40">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{s.lastName}, {s.firstName}</span>
                          <span className="text-slate-500 ml-2 font-mono">[{s.studentId}]</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {s.level} • {s.room}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1 text-[11px]">Authorized Guardians:</span>
                          {studentRels.length === 0 ? (
                            <span className="text-slate-400 italic">No guardians linked</span>
                          ) : (
                            <ul className="space-y-1">
                              {studentRels.map(r => {
                                const g = guardians.find(gd => gd.id === r.guardianId);
                                return (
                                  <li key={r.id} className="bg-white p-1.5 rounded border border-slate-200 text-[11px]">
                                    <div className="font-semibold text-slate-800">{g?.lastName}, {g?.firstName} ({r.relationship})</div>
                                    <div className="text-slate-600 font-mono">Primary: {g?.primaryPhone} • Pickup: {r.pickupAuthorized ? 'Yes' : 'No'}</div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>

                        <div>
                          <span className="font-semibold text-slate-700 block mb-1 text-[11px]">Emergency Backup:</span>
                          <div className="bg-white p-2 rounded border border-slate-200 text-[11px]">
                            <div className="font-semibold text-slate-800">{s.emergencyContactName} ({s.emergencyContactRelationship})</div>
                            <div className="text-slate-600 font-mono">Phone: {s.emergencyContactPhone}</div>
                            {s.specialCircumstances && (
                              <div className="text-amber-700 mt-1 font-medium">⚠️ Special Circumstances flag active</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {reportDef.id === 'Guardian Information' && (
              <div className="space-y-3">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-1.5 font-semibold">Guardian Name</th>
                      <th className="px-3 py-1.5 font-semibold">Primary Phone</th>
                      <th className="px-3 py-1.5 font-semibold">E-mail</th>
                      <th className="px-3 py-1.5 font-semibold">Address</th>
                      <th className="px-3 py-1.5 font-semibold">Linked Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {guardians.map(g => {
                      const linked = relations.filter(r => r.guardianId === g.id);
                      return (
                        <tr key={g.id}>
                          <td className="px-3 py-2 font-bold text-slate-900">{g.lastName}, {g.firstName}</td>
                          <td className="px-3 py-2 font-mono">{g.primaryPhone}</td>
                          <td className="px-3 py-2 text-blue-700 underline truncate max-w-[140px]">{g.emailAddress}</td>
                          <td className="px-3 py-2 text-slate-600">{g.address}, {g.city}, {g.state}</td>
                          <td className="px-3 py-2">
                            {linked.map(r => {
                              const s = students.find(st => st.id === r.studentId);
                              return (
                                <span key={r.id} className="block text-[11px] text-slate-800">
                                  {s?.firstName} {s?.lastName} ({r.relationship})
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {reportDef.id === 'Student Address Book' && (
              <div className="grid grid-cols-2 gap-3">
                {students.map(s => (
                  <div key={s.id} className="border border-slate-200 p-3 rounded bg-slate-50/30">
                    <div className="font-bold text-slate-900">{s.lastName}, {s.firstName}</div>
                    <div className="text-slate-600 mt-1">{s.address}</div>
                    <div className="text-slate-600">{s.city}, {s.state} {s.zipPostalCode}</div>
                    <div className="text-slate-500 text-[10px] mt-1 font-mono">{s.emailAddress}</div>
                  </div>
                ))}
              </div>
            )}

            {reportDef.id === 'Student Attendance by Date' && (
              <div className="space-y-4">
                {['2026-11-01', '2026-10-31', '2026-10-30'].map(d => {
                  const dayRecords = attendance.filter(a => a.attendanceDate === d);
                  return (
                    <div key={d} className="border border-slate-200 rounded overflow-hidden">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                        <span>Attendance Date: {d}</span>
                        <span className="font-normal text-slate-500 font-mono">{dayRecords.length} records</span>
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="px-3 py-1 font-semibold">Student Name</th>
                            <th className="px-3 py-1 font-semibold">Room</th>
                            <th className="px-3 py-1 font-semibold">Status</th>
                            <th className="px-3 py-1 font-semibold">Reason</th>
                            <th className="px-3 py-1 font-semibold">Recorded By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dayRecords.map(a => {
                            const s = students.find(st => st.id === a.studentId);
                            return (
                              <tr key={a.id}>
                                <td className="px-3 py-1.5 font-medium text-slate-900">{s?.lastName}, {s?.firstName}</td>
                                <td className="px-3 py-1.5 font-mono">{s?.room}</td>
                                <td className="px-3 py-1.5 font-bold">{a.status}</td>
                                <td className="px-3 py-1.5 text-slate-600">{a.reason || '-'}</td>
                                <td className="px-3 py-1.5 text-slate-500">{a.recordedBy}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}

            {reportDef.id === 'Student Phone List' && (
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-1.5 font-semibold">Student Name</th>
                    <th className="px-3 py-1.5 font-semibold">Level</th>
                    <th className="px-3 py-1.5 font-semibold">Room</th>
                    <th className="px-3 py-1.5 font-semibold">Emergency Phone</th>
                    <th className="px-3 py-1.5 font-semibold">Contact Person</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id}>
                      <td className="px-3 py-1.5 font-medium text-slate-900">{s.lastName}, {s.firstName}</td>
                      <td className="px-3 py-1.5">{s.level}</td>
                      <td className="px-3 py-1.5 font-mono">{s.room}</td>
                      <td className="px-3 py-1.5 font-mono font-semibold text-slate-800">{s.emergencyContactPhone}</td>
                      <td className="px-3 py-1.5 text-slate-600">{s.emergencyContactName} ({s.emergencyContactRelationship})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportDef.id === 'Students Attendance by...' && (
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-1.5 font-semibold">Student Name</th>
                    <th className="px-3 py-1.5 font-semibold">Room</th>
                    <th className="px-3 py-1.5 font-semibold">Total Days</th>
                    <th className="px-3 py-1.5 font-semibold">Present</th>
                    <th className="px-3 py-1.5 font-semibold">Tardy</th>
                    <th className="px-3 py-1.5 font-semibold">Absent</th>
                    <th className="px-3 py-1.5 font-semibold">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => {
                    const att = attendance.filter(a => a.studentId === s.id);
                    const present = att.filter(a => a.status === 'Present').length;
                    const tardy = att.filter(a => a.status === 'Tardy').length;
                    const absent = att.filter(a => a.status === 'Absent').length;
                    const rate = att.length > 0 ? ((present / att.length) * 100).toFixed(1) : '100.0';
                    return (
                      <tr key={s.id}>
                        <td className="px-3 py-1.5 font-medium text-slate-900">{s.lastName}, {s.firstName}</td>
                        <td className="px-3 py-1.5 font-mono">{s.room}</td>
                        <td className="px-3 py-1.5 font-mono">{att.length}</td>
                        <td className="px-3 py-1.5 font-mono text-emerald-700 font-bold">{present}</td>
                        <td className="px-3 py-1.5 font-mono text-amber-700">{tardy}</td>
                        <td className="px-3 py-1.5 font-mono text-rose-700">{absent}</td>
                        <td className="px-3 py-1.5 font-mono font-bold">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {reportDef.id === 'Students by Circumstance' && (
              <div className="space-y-3">
                {students.filter(s => s.specialCircumstances).map(s => (
                  <div key={s.id} className="border border-amber-300 bg-amber-50/40 p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{s.lastName}, {s.firstName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{s.studentId} • {s.level} • {s.room}</div>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                        IEP / Special Accommodation
                      </span>
                    </div>
                    <div className="mt-2 text-slate-800 text-xs">
                      <strong>Notes & Guidelines: </strong> {s.specialCircumstancesNotes || 'Accommodation protocol active.'}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-600">
                      <strong>Emergency Contact: </strong> {s.emergencyContactName} ({s.emergencyContactPhone})
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reportDef.id === 'Students by Level' && (
              <div className="space-y-4">
                {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(lvl => {
                  const levelStudents = students.filter(s => s.level === lvl);
                  return (
                    <div key={lvl} className="border border-slate-200 rounded">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 flex justify-between">
                        <span>{lvl}</span>
                        <span className="font-mono text-slate-500">{levelStudents.length} Students</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                        {levelStudents.map(s => (
                          <div key={s.id} className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                            <span className="font-medium text-slate-900">{s.lastName}, {s.firstName}</span>
                            <span className="font-mono text-slate-500">{s.room}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {reportDef.id === 'Students by Room' && (
              <div className="space-y-4">
                {['Room 101', 'Room 102', 'Room 103', 'Room 104'].map(rm => {
                  const roomStudents = students.filter(s => s.room === rm);
                  return (
                    <div key={rm} className="border border-slate-200 rounded">
                      <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 flex justify-between">
                        <span>Homeroom: {rm}</span>
                        <span className="font-mono text-slate-500">{roomStudents.length} Enrolled</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                        {roomStudents.map(s => (
                          <div key={s.id} className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                            <span className="font-medium text-slate-900">{s.lastName}, {s.firstName}</span>
                            <span className="text-slate-500">{s.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report Footer */}
          <div className="border-t border-slate-300 pt-3 mt-8 flex items-center justify-between text-[11px] text-slate-400">
            <span>Microsoft Access Report Engine • Student Management Database</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
