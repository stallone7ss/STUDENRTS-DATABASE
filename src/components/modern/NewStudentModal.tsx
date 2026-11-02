/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, X, Save, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentCreated: () => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onStudentCreated,
}) => {
  const [formData, setFormData] = useState({
    student_id: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
    first_name: '',
    last_name: '',
    email_address: '',
    level: 'Grade 9',
    room: 'Room 101',
    special_circumstances: false,
    special_circumstances_notes: '',
    date_of_birth: '2010-01-01',
    gender: 'M',
    address: '',
    city: 'Seattle',
    state: 'WA',
    zip_postal_code: '98101',
    allergies: 'None',
    medications: 'None',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: 'Parent',
    notes: '',
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      alert("Please provide both First Name and Last Name.");
      return;
    }

    try {
      setSaving(true);
      const email = formData.email_address || `${formData.first_name.toLowerCase()}.${formData.last_name.toLowerCase()}@schoolnet.org`;

      await supabase.from('students').insert({
        ...formData,
        email_address: email,
      });

      onStudentCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creating student:", err);
      alert("Failed to create student: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">New Student Enrollment</h2>
              <p className="text-[11px] text-slate-400">
                Insert student record into Supabase PostgreSQL database
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Student ID:
              </label>
              <input
                type="text"
                required
                value={formData.student_id}
                onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                First Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liam"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Last Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gallagher"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                E-mail Address:
              </label>
              <input
                type="email"
                placeholder="Auto-generated if left blank"
                value={formData.email_address}
                onChange={(e) => setFormData(prev => ({ ...prev, email_address: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Date of Birth:
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Level / Grade:
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
              >
                <option value="Grade 9">Grade 9 (Freshman)</option>
                <option value="Grade 10">Grade 10 (Sophomore)</option>
                <option value="Grade 11">Grade 11 (Junior)</option>
                <option value="Grade 12">Grade 12 (Senior)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Homeroom:
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              >
                <option value="Room 101">Room 101</option>
                <option value="Room 102">Room 102</option>
                <option value="Room 103">Room 103</option>
                <option value="Room 104">Room 104</option>
                <option value="Room 105">Room 105</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Gender:
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.special_circumstances}
                onChange={(e) => setFormData(prev => ({ ...prev, special_circumstances: e.target.checked }))}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800 text-xs">
                Flag for Special Circumstances (IEP, 504 Plan, Medical Guidelines)
              </span>
            </label>
            {formData.special_circumstances && (
              <textarea
                rows={2}
                placeholder="Document accommodations or medical notes..."
                value={formData.special_circumstances_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, special_circumstances_notes: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            )}
          </div>

          {/* Emergency Backup Contact */}
          <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
            <div className="font-semibold text-slate-800 text-xs mb-2">Primary Emergency Contact:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Phone (e.g. 555-0199)"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Mother)"
                value={formData.emergency_contact_relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving to Database...' : 'Insert Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
