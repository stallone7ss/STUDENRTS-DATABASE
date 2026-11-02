/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, ExternalLink, X, Code, Navigation } from 'lucide-react';
import { Student } from '../../types/database';

interface MapModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  const fullAddress = `${student.address}, ${student.city}, ${student.state} ${student.zipPostalCode}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-[#8b1f24] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300" />
            <span className="font-bold">modMapping : Geographical Address Resolver</span>
          </div>
          <button onClick={onClose} className="hover:bg-red-900 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="border border-slate-200 rounded p-3 bg-slate-50">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Student Record:</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {student.firstName} {student.lastName} ({student.studentId})
            </div>
            <div className="text-xs text-slate-700 mt-1 flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-red-800 shrink-0" />
              <span>{fullAddress}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded p-3 bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
            <div className="text-slate-400 text-[10px]">// modMapping.BuildMapURL() output:</div>
            <div className="text-emerald-300 break-all">{mapUrl}</div>
          </div>

          <p className="text-slate-600 text-xs">
            In the native Microsoft Access desktop application, <code>modMapping</code> uses <code>Application.FollowHyperlink</code> or calls the Win32 <code>ShellExecute</code> API to launch the default web browser, or populates an ActiveX WebBrowser control embedded on the <code>Student Details</code> form.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
          >
            Close
          </button>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8b1f24] hover:bg-[#72191d] text-white font-semibold rounded shadow-xs"
          >
            <span>Open in Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
