/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scroll, Play, Code, CheckCircle, Info } from 'lucide-react';
import { ACCESS_MACROS, MacroDefinition } from '../../data/vbaCode';

interface MacroViewerProps {
  macroName: string;
}

export const MacroViewer: React.FC<MacroViewerProps> = ({ macroName }) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'vba'>('designer');
  const [lastRunMessage, setLastRunMessage] = useState<string | null>(null);

  const macro = ACCESS_MACROS.find(m => m.name.toLowerCase() === macroName.toLowerCase()) || ACCESS_MACROS[0];

  const handleSimulateRun = () => {
    setLastRunMessage(`Macro [${macro.name}] executed successfully! Trigger: ${macro.trigger}`);
    setTimeout(() => setLastRunMessage(null), 3500);
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs select-none">
      {/* Macro Bar */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Scroll className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-slate-800 text-sm">{macro.name} : Macro</span>
          <span className="text-[11px] text-slate-500 font-mono">({macro.actions.length} action steps)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateRun}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Macro</span>
          </button>

          <div className="flex items-center bg-slate-200 p-0.5 rounded border border-slate-300">
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'designer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Action Catalog
            </button>
            <button
              onClick={() => setActiveTab('vba')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'vba' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              VBA Equivalent
            </button>
          </div>
        </div>
      </div>

      {lastRunMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 text-emerald-900 flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastRunMessage}</span>
        </div>
      )}

      {/* Purpose Banner */}
      <div className="p-3 bg-amber-50/70 border-b border-amber-200 text-amber-950">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-xs mb-0.5">Purpose & Event Binding:</div>
            <p className="text-[11px] leading-relaxed text-slate-700">{macro.purpose}</p>
            <div className="mt-1 text-[10px] font-mono text-amber-800">
              <strong>Event Trigger: </strong> {macro.trigger}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'designer' ? (
        <div className="flex-1 overflow-auto p-4">
          <div className="border border-slate-300 rounded overflow-hidden max-w-4xl mx-auto shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-200 text-slate-800 border-b border-slate-300 text-xs">
                <tr>
                  <th className="w-12 px-3 py-2 border-r border-slate-300 text-center">Step</th>
                  <th className="w-40 px-3 py-2 border-r border-slate-300 font-semibold">Action Name</th>
                  <th className="px-3 py-2 border-r border-slate-300 font-semibold">Action Arguments</th>
                  <th className="px-3 py-2 font-semibold">Comment / Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {macro.actions.map((act, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="px-3 py-2 text-center border-r border-slate-200 font-mono text-slate-500 bg-slate-50">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 font-bold text-amber-900 font-mono">
                      {act.actionName}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200 font-mono text-[11px] text-slate-700">
                      {Object.entries(act.arguments).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-slate-400">{key}: </span>
                          <span className="text-blue-900 font-semibold">{val}</span>
                        </div>
                      ))}
                      {Object.keys(act.arguments).length === 0 && <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-xs italic">
                      {act.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 bg-slate-900 text-slate-100 font-mono text-xs">
          <pre className="whitespace-pre-wrap leading-relaxed text-amber-200">
            {macro.vbaEquivalent}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Macro Designer • MS Access Embedded Macro Engine</span>
        <span>Standard Jet Macro</span>
      </div>
    </div>
  );
};
