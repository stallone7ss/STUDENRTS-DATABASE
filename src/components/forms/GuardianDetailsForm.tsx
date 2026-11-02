/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Save, Trash2, ArrowLeft, Phone, Mail, MapPin, Users } from 'lucide-react';
import { Guardian, Student, StudentGuardianRelation } from '../../types/database';

interface GuardianDetailsFormProps {
  guardian: Guardian;
  allStudents: Student[];
  allRelations: StudentGuardianRelation[];
  onSaveGuardian: (guardian: Guardian) => void;
  onClose: () => void;
  onOpenStudent: (studentId: number) => void;
}

export const GuardianDetailsForm: React.FC<GuardianDetailsFormProps> = ({
  guardian,
  allStudents,
  allRelations,
  onSaveGuardian,
  onClose,
  onOpenStudent,
}) => {
  const [formData, setFormData] = useState<Guardian>({ ...guardian });
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof Guardian, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const linkedRelations = allRelations.filter(r => r.guardianId === guardian.id);

  return (
    <div className="h-full flex flex-col bg-slate-50 text-xs overflow-hidden select-none">
      {/* Header */}
      <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900">
              {formData.lastName}, {formData.firstName} (Guardian)
            </h1>
            <p className="text-[11px] text-slate-500">
              {formData.relationshipType} • {formData.primaryPhone}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onSaveGuardian(formData);
            setHasChanges(false);
          }}
          disabled={!hasChanges}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold text-xs ${
            hasChanges ? 'bg-red-900 text-white hover:bg-red-950' : 'bg-slate-200 text-slate-400'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Guardian</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4 bg-white">
        {/* Contact Info */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Guardian Contact Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">First Name:</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Last Name:</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Relationship Type:</label>
              <input
                type="text"
                value={formData.relationshipType}
                onChange={(e) => handleChange('relationshipType', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Primary Phone:</label>
              <input
                type="text"
                value={formData.primaryPhone}
                onChange={(e) => handleChange('primaryPhone', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Secondary Phone:</label>
              <input
                type="text"
                value={formData.secondaryPhone || ''}
                onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">E-mail Address:</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleChange('emailAddress', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-blue-700 underline"
              />
            </div>
          </div>
        </div>

        {/* Mailing Address */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Mailing Address
          </h2>
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
              <label className="block text-[11px] font-medium text-slate-600 mb-1">State:</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Linked Dependents / Students */}
        <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-red-900" />
            <span>Linked Dependent Students ({linkedRelations.length})</span>
          </h2>
          <div className="space-y-2">
            {linkedRelations.map(rel => {
              const student = allStudents.find(s => s.id === rel.studentId);
              if (!student) return null;
              return (
                <div key={rel.id} className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{student.lastName}, {student.firstName}</span>
                    <span className="text-slate-500 ml-2">({rel.relationship})</span>
                    <div className="text-[11px] text-slate-400 font-mono">{student.studentId} • {student.level} • {student.room}</div>
                  </div>
                  <button
                    onClick={() => onOpenStudent(student.id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-medium text-slate-700"
                  >
                    Open Student Record
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GuardianListForm: React.FC<{
  guardians: Guardian[];
  onOpenGuardian: (id: number) => void;
}> = ({ guardians, onOpenGuardian }) => {
  return (
    <div className="h-full flex flex-col bg-white text-xs select-none">
      <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between">
        <h1 className="font-bold text-slate-800 text-sm">Guardian Directory (Form View)</h1>
        <span className="text-slate-500">{guardians.length} total guardians</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-200 sticky top-0 border-b border-slate-300">
            <tr>
              <th className="px-3 py-1.5 border-r border-slate-300">Guardian Name</th>
              <th className="px-3 py-1.5 border-r border-slate-300">Relationship Type</th>
              <th className="px-3 py-1.5 border-r border-slate-300">Primary Phone</th>
              <th className="px-3 py-1.5 border-r border-slate-300">E-mail Address</th>
              <th className="px-3 py-1.5 border-r border-slate-300">City, State</th>
              <th className="px-3 py-1.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {guardians.map(g => (
              <tr key={g.id} className="hover:bg-slate-50">
                <td className="px-3 py-1.5 font-medium border-r border-slate-200 text-slate-900">
                  {g.lastName}, {g.firstName}
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-slate-600">{g.relationshipType}</td>
                <td className="px-3 py-1.5 border-r border-slate-200 font-mono">{g.primaryPhone}</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-blue-700 underline">{g.emailAddress}</td>
                <td className="px-3 py-1.5 border-r border-slate-200 text-slate-600">{g.city}, {g.state}</td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    onClick={() => onOpenGuardian(g.id)}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-100 text-[11px]"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
