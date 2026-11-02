/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Check, X, Search, UserPlus } from 'lucide-react';
import { Student } from '../../types/database';

interface OutlookContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyOrSchool: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const SAMPLE_OUTLOOK_CONTACTS: OutlookContact[] = [
  {
    id: 'c1',
    name: 'Benjamin Franklin',
    email: 'ben.franklin@academynet.org',
    phone: '(555) 234-5678',
    companyOrSchool: 'Northwood High',
    address: '1776 Liberty Way',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19106'
  },
  {
    id: 'c2',
    name: 'Maya Lin',
    email: 'maya.lin@academynet.org',
    phone: '(555) 876-5432',
    companyOrSchool: 'Northwood High',
    address: '450 Design Blvd',
    city: 'Seattle',
    state: 'WA',
    zip: '98109'
  },
  {
    id: 'c3',
    name: 'Arthur Conan Doyle',
    email: 'arthur.doyle@academynet.org',
    phone: '(555) 221-1887',
    companyOrSchool: 'Northwood High',
    address: '221B Baker Street',
    city: 'Seattle',
    state: 'WA',
    zip: '98101'
  }
];

interface OutlookImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStudent: (imported: Partial<Student>) => void;
}

export const OutlookImportModal: React.FC<OutlookImportModalProps> = ({
  isOpen,
  onClose,
  onImportStudent,
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>(SAMPLE_OUTLOOK_CONTACTS[0].id);
  const [level, setLevel] = useState('Grade 9');
  const [room, setRoom] = useState('Room 101');

  if (!isOpen) return null;

  const handleImport = () => {
    const contact = SAMPLE_OUTLOOK_CONTACTS.find(c => c.id === selectedContactId);
    if (!contact) return;

    const parts = contact.name.split(' ');
    const firstName = parts[0] || 'Unknown';
    const lastName = parts.slice(1).join(' ') || 'Student';

    onImportStudent({
      studentId: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      firstName,
      lastName,
      emailAddress: contact.email,
      level,
      room,
      specialCircumstances: false,
      dob: '2009-01-01',
      gender: 'Other',
      address: contact.address,
      city: contact.city,
      state: contact.state,
      zipPostalCode: contact.zip,
      country: 'USA',
      emergencyContactName: 'Guardian',
      emergencyContactPhone: contact.phone,
      emergencyContactRelationship: 'Parent',
      notes: 'Imported from Microsoft Outlook MAPI contacts.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 rounded-lg shadow-xl w-full max-w-lg overflow-hidden text-xs">
        {/* Office Outlook Dialog Header */}
        <div className="bg-[#0078d4] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="w-4 h-4" />
            <span>Microsoft Outlook Contact Selector (MAPI)</span>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-slate-600">
            Select a contact from Microsoft Outlook Address Book to import into the <strong className="text-slate-900">Students</strong> table:
          </p>

          <div className="border border-slate-200 rounded divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {SAMPLE_OUTLOOK_CONTACTS.map(contact => (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`p-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                  selectedContactId === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-900">{contact.name}</div>
                  <div className="text-[11px] text-slate-500">{contact.email} • {contact.phone}</div>
                  <div className="text-[10px] text-slate-400">{contact.address}, {contact.city}, {contact.state}</div>
                </div>
                {selectedContactId === contact.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Assign Level:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Assign Homeroom:</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
              >
                <option value="Room 101">Room 101</option>
                <option value="Room 102">Room 102</option>
                <option value="Room 103">Room 103</option>
                <option value="Room 104">Room 104</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-3.5 py-1.5 bg-[#0078d4] hover:bg-[#006cbd] text-white font-semibold rounded shadow-xs"
          >
            Import Contact as Student
          </button>
        </div>
      </div>
    </div>
  );
};
