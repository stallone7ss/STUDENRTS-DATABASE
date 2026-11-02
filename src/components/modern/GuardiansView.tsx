/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Phone, Mail, MapPin, Users, Search } from 'lucide-react';
import { localStore } from '../../lib/supabase';

export const GuardiansView: React.FC = () => {
  const [search, setSearch] = useState('');
  const guardians = localStore.guardians;
  const students = localStore.students;
  const relations = localStore.relations;

  const filtered = guardians.filter(g => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return g.firstName.toLowerCase().includes(q) || g.lastName.toLowerCase().includes(q) || g.primaryPhone.includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h1 className="font-bold text-sm text-slate-900">Guardian & Caregiver Directory</h1>
          <p className="text-[11px] text-slate-500">Parent contacts, emergency pickup authorizations, and family accounts</p>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search guardians..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => {
            const linkedRelations = relations.filter(r => r.guardianId === g.id);
            return (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                    {g.firstName[0]}{g.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{g.firstName} {g.lastName}</h3>
                    <span className="text-[11px] text-slate-400">{g.relationshipType}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-600 border-t border-slate-100 pt-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{g.primaryPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${g.emailAddress}`} className="text-blue-600 hover:underline truncate">{g.emailAddress}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{g.city}, {g.state} {g.zipPostalCode}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Linked Dependents ({linkedRelations.length}):
                  </span>
                  <div className="space-y-1">
                    {linkedRelations.map(rel => {
                      const st = students.find(s => s.id === rel.studentId);
                      return (
                        <div key={rel.id} className="p-1.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-medium text-slate-800">{st?.firstName} {st?.lastName}</span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1 rounded">{rel.relationship}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
