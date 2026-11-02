/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ACCESS_REPORTS } from '../../data/sqlDefinitions';
import { localStore } from '../../lib/supabase';
import { ReportViewer } from '../reports/ReportViewer';

export const ModernReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('All Students');
  const students = localStore.students;
  const guardians = localStore.guardians;
  const relations = localStore.relations;
  const attendance = localStore.attendance;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h1 className="font-bold text-sm text-slate-900">Academic & Administrative Reports</h1>
          <p className="text-[11px] text-slate-500">Export, preview, and print standardized institutional rosters</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
          >
            {ACCESS_REPORTS.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Report</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ReportViewer
          reportName={selectedReport}
          students={students}
          guardians={guardians}
          relations={relations}
          attendance={attendance}
        />
      </div>
    </div>
  );
};
