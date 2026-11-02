/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Phone, Mail, Check, ShieldAlert } from 'lucide-react';
import { Guardian, StudentGuardianRelation } from '../../types/database';

interface GuardiansSubformProps {
  studentId: number;
  relations: StudentGuardianRelation[];
  guardians: Guardian[];
  onAddRelation: (newRelation: Omit<StudentGuardianRelation, 'id'>) => void;
  onRemoveRelation: (relationId: number) => void;
  onOpenGuardianDetails: (guardianId: number) => void;
}

export const GuardiansSubform: React.FC<GuardiansSubformProps> = ({
  studentId,
  relations,
  guardians,
  onAddRelation,
  onRemoveRelation,
  onOpenGuardianDetails,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGuardianId, setSelectedGuardianId] = useState<number>(guardians[0]?.id || 1);
  const [relationship, setRelationship] = useState('Parent');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isPickup, setIsPickup] = useState(true);
  const [isEmergency, setIsEmergency] = useState(true);

  // Filter relations for this specific student (Child Field: Student ID = Master Field: ID)
  const studentRelations = relations.filter(r => r.studentId === studentId);

  const handleSaveNew = () => {
    onAddRelation({
      studentId,
      guardianId: Number(selectedGuardianId),
      relationship,
      primaryContact: isPrimary,
      pickupAuthorized: isPickup,
      emergencyContact: isEmergency,
    });
    setIsAdding(false);
  };

  return (
    <div className="border border-slate-300 rounded bg-white overflow-hidden text-xs">
      {/* Subform Control Header */}
      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Guardians Subform</span>
          <span className="text-[11px] text-slate-500 font-mono">
            LinkMasterFields: [ID] | LinkChildFields: [Student ID]
          </span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-[11px] font-medium"
        >
          <Plus className="w-3 h-3 text-emerald-700" />
          <span>Add Guardian Link</span>
        </button>
      </div>

      {/* Add New Guardian Link Row */}
      {isAdding && (
        <div className="p-2.5 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block">Guardian:</span>
            <select
              value={selectedGuardianId}
              onChange={(e) => setSelectedGuardianId(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
            >
              {guardians.map(g => (
                <option key={g.id} value={g.id}>
                  {g.lastName}, {g.firstName} ({g.primaryPhone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block">Relationship:</span>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Mother, Father"
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-28"
            />
          </div>

          <label className="flex items-center gap-1 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded text-red-900 focus:ring-red-900"
            />
            <span>Primary</span>
          </label>

          <label className="flex items-center gap-1 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPickup}
              onChange={(e) => setIsPickup(e.target.checked)}
              className="rounded text-red-900 focus:ring-red-900"
            />
            <span>Pickup Auth</span>
          </label>

          <div className="flex items-center gap-1.5 mt-3 ml-auto">
            <button
              onClick={handleSaveNew}
              className="px-2.5 py-1 bg-red-900 hover:bg-red-950 text-white rounded text-xs font-medium"
            >
              Save Link
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

      {/* Subform Datasheet Grid */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px]">
          <tr>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Guardian Name</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Relationship</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">Primary Phone</th>
            <th className="px-3 py-1 font-semibold border-r border-slate-200">E-mail</th>
            <th className="px-2 py-1 font-semibold text-center border-r border-slate-200">Primary</th>
            <th className="px-2 py-1 font-semibold text-center border-r border-slate-200">Pickup</th>
            <th className="px-2 py-1 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {studentRelations.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-slate-400 italic">
                No guardians linked for this student record. Click "Add Guardian Link" above.
              </td>
            </tr>
          ) : (
            studentRelations.map((rel) => {
              const guardian = guardians.find(g => g.id === rel.guardianId);
              if (!guardian) return null;
              return (
                <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-1.5 border-r border-slate-100 font-medium text-slate-900">
                    <button
                      onClick={() => onOpenGuardianDetails(guardian.id)}
                      className="text-left hover:text-red-900 hover:underline"
                      title="Open Guardian Details"
                    >
                      {guardian.lastName}, {guardian.firstName}
                    </button>
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-100 text-slate-600">
                    {rel.relationship}
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-100 font-mono text-slate-700">
                    {guardian.primaryPhone}
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-100 text-blue-700 underline truncate max-w-[160px]">
                    {guardian.emailAddress}
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-100 text-center">
                    {rel.primaryContact ? (
                      <span className="inline-block w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] leading-4 text-center">✓</span>
                    ) : '-'}
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-100 text-center">
                    {rel.pickupAuthorized ? (
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] leading-4 text-center">✓</span>
                    ) : '-'}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <button
                      onClick={() => onRemoveRelation(rel.id)}
                      className="p-1 text-slate-400 hover:text-red-700 hover:bg-slate-100 rounded"
                      title="Remove relation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
