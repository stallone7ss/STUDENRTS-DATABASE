/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Play, Copy, Check, ExternalLink, MapPin } from 'lucide-react';
import { Student } from '../../types/database';
import { VBA_MOD_MAPPING } from '../../data/vbaCode';

interface VbaModuleViewerProps {
  students: Student[];
  onOpenMap: (student: Student) => void;
}

export const VbaModuleViewer: React.FC<VbaModuleViewerProps> = ({
  students,
  onOpenMap,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(students[0]?.id || 1);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(VBA_MOD_MAPPING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addressQuery = selectedStudent 
    ? `${selectedStudent.address}, ${selectedStudent.city}, ${selectedStudent.state} ${selectedStudent.zipPostalCode}`
    : '';
  const simulatedUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;

  return (
    <div className="h-full flex flex-col bg-white text-xs select-none">
      {/* VBA Module Bar */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-700" />
          <span className="font-bold text-slate-800 text-sm">modMapping : Standard Module</span>
          <span className="text-[11px] text-slate-500 font-mono">(VBA 7 / Win32 / Win64 compatible)</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium text-xs shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy VBA Code'}</span>
        </button>
      </div>

      {/* Simulator Strip */}
      <div className="bg-indigo-50/70 border-b border-indigo-200 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-800 shrink-0" />
          <span className="font-semibold text-indigo-950">Test Function: ShowMapForAddress()</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="px-2 py-1 bg-white border border-indigo-300 rounded text-xs"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.lastName}, {s.firstName} - {s.city}, {s.state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-600 font-mono truncate max-w-xs">
            {addressQuery}
          </span>
          <button
            onClick={() => onOpenMap(selectedStudent)}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded text-xs shadow-xs cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Invoke modMapping Function</span>
          </button>
        </div>
      </div>

      {/* VBA Code Window (Microsoft Visual Basic for Applications IDE Styling) */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e] text-slate-100 p-4 font-mono text-xs">
        <pre className="whitespace-pre-wrap leading-relaxed text-[#9cdcfe]">
          {VBA_MOD_MAPPING}
        </pre>
      </div>

      {/* Footer */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Microsoft Visual Basic for Applications 7.1 • Compile Success</span>
        <span>modMapping.bas</span>
      </div>
    </div>
  );
};
