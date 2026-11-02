/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Save, 
  Trash2, 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  AlertTriangle, 
  ShieldCheck, 
  HeartPulse, 
  PhoneCall, 
  ArrowLeft,
  Printer
} from 'lucide-react';
import { Student, Guardian, StudentGuardianRelation, StudentAttendance } from '../../types/database';
import { GuardiansSubform } from './GuardiansSubform';
import { AttendanceSubform } from './AttendanceSubform';

interface StudentDetailsFormProps {
  student: Student;
  allGuardians: Guardian[];
  allRelations: StudentGuardianRelation[];
  allAttendance: StudentAttendance[];
  onSaveStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: number) => void;
  onClose: () => void;
  onOpenGuardianDetails: (guardianId: number) => void;
  onAddRelation: (newRelation: Omit<StudentGuardianRelation, 'id'>) => void;
  onRemoveRelation: (relationId: number) => void;
  onAddAttendance: (newRecord: Omit<StudentAttendance, 'id'>) => void;
  onDeleteAttendance: (attendanceId: number) => void;
  onOpenMap: (student: Student) => void;
}

export const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({
  student,
  allGuardians,
  allRelations,
  allAttendance,
  onSaveStudent,
  onDeleteStudent,
  onClose,
  onOpenGuardianDetails,
  onAddRelation,
  onRemoveRelation,
  onAddAttendance,
  onDeleteAttendance,
  onOpenMap,
}) => {
  const [formData, setFormData] = useState<Student>({ ...student });
  const [activeTab, setActiveTab] = useState<'general' | 'guardians' | 'attendance' | 'medical'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof Student, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveStudent(formData);
    setHasChanges(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-xs overflow-hidden select-none">
      {/* Access Form Header Banner (Wine/Crimson themed) */}
      <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Return to Student List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="w-9 h-9 rounded bg-[#8b1f24] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {formData.firstName[0]}{formData.lastName[0]}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900">
                {formData.lastName}, {formData.firstName}
              </h1>
              <span className="font-mono text-slate-500 text-[11px] bg-slate-200 px-1.5 py-0.5 rounded">
                {formData.studentId}
              </span>
              {formData.specialCircumstances && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  <span>Special Circumstances</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              <span>{formData.level}</span> • <span>{formData.room}</span> • <span>{formData.emailAddress}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenMap(formData)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium text-xs transition-colors"
            title="Locate residential address via modMapping"
          >
            <MapPin className="w-3.5 h-3.5 text-red-800" />
            <span>Map Address</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
              hasChanges 
                ? 'bg-[#8b1f24] hover:bg-[#72191d] text-white shadow-xs' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Record</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete student ${formData.firstName} ${formData.lastName}?`)) {
                onDeleteStudent(formData.id);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
            title="Delete this student record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Access Form Tab Strip */}
      <div className="flex items-center gap-1 bg-slate-200 border-b border-slate-300 px-4 pt-1 shrink-0">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium border-t border-l border-r transition-colors ${
            activeTab === 'general'
              ? 'bg-white border-slate-300 text-slate-900 font-semibold'
              : 'bg-slate-100 hover:bg-slate-50 border-transparent text-slate-600'
          }`}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab('guardians')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium border-t border-l border-r transition-colors ${
            activeTab === 'guardians'
              ? 'bg-white border-slate-300 text-slate-900 font-semibold'
              : 'bg-slate-100 hover:bg-slate-50 border-transparent text-slate-600'
          }`}
        >
          Guardians Subform ({allRelations.filter(r => r.studentId === student.id).length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium border-t border-l border-r transition-colors ${
            activeTab === 'attendance'
              ? 'bg-white border-slate-300 text-slate-900 font-semibold'
              : 'bg-slate-100 hover:bg-slate-50 border-transparent text-slate-600'
          }`}
        >
          Attendance History ({allAttendance.filter(a => a.studentId === student.id).length})
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium border-t border-l border-r transition-colors ${
            activeTab === 'medical'
              ? 'bg-white border-slate-300 text-slate-900 font-semibold'
              : 'bg-slate-100 hover:bg-slate-50 border-transparent text-slate-600'
          }`}
        >
          Medical & Emergency
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {activeTab === 'general' && (
          <div className="max-w-4xl space-y-4">
            {/* Group 1: Enrollment Demographics */}
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Student Identity & Classroom Assignment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Student ID:</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleChange('studentId', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">First Name:</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Last Name:</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Level / Grade:</label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleChange('level', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="Grade 9">Grade 9 (Freshman)</option>
                    <option value="Grade 10">Grade 10 (Sophomore)</option>
                    <option value="Grade 11">Grade 11 (Junior)</option>
                    <option value="Grade 12">Grade 12 (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Homeroom:</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => handleChange('room', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">E-mail Address:</label>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleChange('emailAddress', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-blue-700 underline"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Gender:</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other / Non-Binary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 2: Special Circumstances Flags */}
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialCircumstances}
                    onChange={(e) => handleChange('specialCircumstances', e.target.checked)}
                    className="w-4 h-4 rounded text-red-900 focus:ring-red-900 border-slate-300"
                  />
                  <span className="font-bold text-slate-800 text-xs">
                    Special Circumstances (IEP, 504 Plan, Medical Protocol, Custody Flag)
                  </span>
                </label>
              </div>

              {formData.specialCircumstances && (
                <div className="mt-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Special Circumstances Notes & Accommodations:
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialCircumstancesNotes || ''}
                    onChange={(e) => handleChange('specialCircumstancesNotes', e.target.value)}
                    placeholder="Enter formal accommodation requirements, counselor notes, or medical guidelines..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              )}
            </div>

            {/* Group 3: Physical Residential Address */}
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Residential Address
                </h2>
                <button
                  type="button"
                  onClick={() => onOpenMap(formData)}
                  className="flex items-center gap-1 text-red-800 hover:text-red-950 font-medium text-[11px]"
                >
                  <MapPin className="w-3 h-3" />
                  <span>modMapping : Resolve Coordinates</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Street Address:</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">City:</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">State / Province:</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">ZIP / Postal Code:</label>
                  <input
                    type="text"
                    value={formData.zipPostalCode}
                    onChange={(e) => handleChange('zipPostalCode', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Country:</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guardians' && (
          <div className="max-w-4xl space-y-4">
            <GuardiansSubform
              studentId={formData.id}
              relations={allRelations}
              guardians={allGuardians}
              onAddRelation={onAddRelation}
              onRemoveRelation={onRemoveRelation}
              onOpenGuardianDetails={onOpenGuardianDetails}
            />
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="max-w-4xl space-y-4">
            <AttendanceSubform
              studentId={formData.id}
              attendanceRecords={allAttendance}
              onAddAttendance={onAddAttendance}
              onDeleteAttendance={onDeleteAttendance}
            />
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="max-w-4xl space-y-4">
            {/* Medical Alert Card */}
            <div className="border border-rose-200 bg-rose-50/40 rounded p-4">
              <h2 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-700" />
                <span>Allergies & Prescription Medications</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Known Allergies:</label>
                  <textarea
                    rows={2}
                    value={formData.allergies || ''}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="e.g. Peanuts, Penicillin, Bee stings"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Active Medications:</label>
                  <textarea
                    rows={2}
                    value={formData.medications || ''}
                    onChange={(e) => handleChange('medications', e.target.value)}
                    placeholder="e.g. Inhaler, EpiPen, Daily prescription..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <span>Primary Emergency Backup Contact</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Contact Name:</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Emergency Phone:</label>
                  <input
                    type="text"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Relationship:</label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Access Form Status Bar */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div>Form View • tbl_Students [ID: {formData.id}]</div>
        <div>{hasChanges ? <span className="text-amber-800 font-medium">● Unsaved edits</span> : 'Saved'}</div>
      </div>
    </div>
  );
};
