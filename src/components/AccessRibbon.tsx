/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  RotateCw, 
  UserPlus, 
  Mail, 
  Filter, 
  FileSpreadsheet, 
  Printer, 
  FileCode, 
  HelpCircle, 
  Search, 
  MapPin, 
  RefreshCw, 
  Database,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  BookOpen,
  Replace
} from 'lucide-react';

interface AccessRibbonProps {
  onNewStudent: () => void;
  onOpenOutlookImport: () => void;
  onOpenArchitecture: () => void;
  onRefreshData: () => void;
  onQuickReport: (reportName: string) => void;
  onOpenBulkEdit: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

export const AccessRibbon: React.FC<AccessRibbonProps> = ({
  onNewStudent,
  onOpenOutlookImport,
  onOpenArchitecture,
  onRefreshData,
  onQuickReport,
  onOpenBulkEdit,
  canUndo,
  onUndo,
}) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Create' | 'External' | 'DatabaseTools' | 'Architecture'>('Home');

  return (
    <header className="bg-slate-100 border-b border-slate-300 select-none text-xs text-slate-800 shrink-0">
      {/* Top Office Title Bar (Burgundy Access 365 style) */}
      <div className="bg-[#a22b32] text-white px-3 py-1 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Access Logo / App Title */}
          <div className="flex items-center gap-1.5 font-bold tracking-wide">
            <div className="w-5 h-5 bg-white text-[#a22b32] rounded flex items-center justify-center text-xs font-black">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight">Student Management : Database (Access 2016 - 2026 format)</span>
          </div>

          {/* Quick Access Toolbar */}
          <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-red-800/80">
            <button 
              onClick={onRefreshData}
              className="p-1 hover:bg-red-900/60 rounded text-red-100 transition-colors"
              title="Save & Refresh (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onUndo || onRefreshData}
              disabled={!canUndo && !onUndo}
              className={`p-1 rounded text-red-100 transition-colors ${
                canUndo ? 'hover:bg-red-900/80 bg-red-800/60 text-white cursor-pointer' : 'hover:bg-red-900/60 opacity-60'
              }`}
              title={canUndo ? "Undo Last Bulk Edit (Ctrl+Z)" : "Undo (Ctrl+Z)"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button 
              className="p-1 hover:bg-red-900/60 rounded text-red-100 transition-colors opacity-50 cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button: Architecture Blueprint */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-2.5 py-1 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Architecture & SQL DDL</span>
          </button>
        </div>
      </div>

      {/* Ribbon Navigation Tabs */}
      <div className="flex items-center px-2 bg-slate-200 border-b border-slate-300">
        <button className="px-3 py-1.5 bg-[#8b1f24] text-white font-semibold rounded-t-sm text-xs hover:bg-[#72191d] transition-colors">
          File
        </button>
        
        <button
          onClick={() => setActiveTab('Home')}
          className={`px-3 py-1.5 font-medium border-b-2 text-xs transition-colors ${
            activeTab === 'Home' 
              ? 'bg-slate-50 text-slate-900 border-[#a22b32] font-semibold' 
              : 'text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          Home
        </button>
        
        <button
          onClick={() => setActiveTab('Create')}
          className={`px-3 py-1.5 font-medium border-b-2 text-xs transition-colors ${
            activeTab === 'Create' 
              ? 'bg-slate-50 text-slate-900 border-[#a22b32] font-semibold' 
              : 'text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          Create
        </button>

        <button
          onClick={() => setActiveTab('External')}
          className={`px-3 py-1.5 font-medium border-b-2 text-xs transition-colors ${
            activeTab === 'External' 
              ? 'bg-slate-50 text-slate-900 border-[#a22b32] font-semibold' 
              : 'text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          External Data
        </button>

        <button
          onClick={() => setActiveTab('DatabaseTools')}
          className={`px-3 py-1.5 font-medium border-b-2 text-xs transition-colors ${
            activeTab === 'DatabaseTools' 
              ? 'bg-slate-50 text-slate-900 border-[#a22b32] font-semibold' 
              : 'text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
        >
          Database Tools
        </button>

        <button
          onClick={onOpenArchitecture}
          className="ml-auto flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-900 hover:text-red-950 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Reverse-Engineering Specs</span>
        </button>
      </div>

      {/* Ribbon Command Strip */}
      <div className="bg-slate-50 px-3 py-1.5 flex items-stretch gap-3 overflow-x-auto border-b border-slate-300 min-h-[64px]">
        {activeTab === 'Home' && (
          <>
            {/* Records Group */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-300">
              <button
                onClick={onNewStudent}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/80 rounded transition-colors text-slate-800 cursor-pointer min-w-[56px]"
              >
                <div className="w-6 h-6 bg-amber-100 border border-amber-400 text-amber-900 rounded flex items-center justify-center mb-0.5">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium leading-tight">New Student</span>
              </button>

              <button
                onClick={onOpenOutlookImport}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/80 rounded transition-colors text-slate-800 cursor-pointer min-w-[64px]"
              >
                <div className="w-6 h-6 bg-blue-100 border border-blue-400 text-blue-900 rounded flex items-center justify-center mb-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium leading-tight whitespace-nowrap">Add From Outlook</span>
              </button>

              <button
                onClick={onOpenBulkEdit}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/80 rounded transition-colors text-slate-800 cursor-pointer min-w-[64px]"
                title="Bulk field updates and find-and-replace across student records"
              >
                <div className="w-6 h-6 bg-amber-100 border border-amber-400 text-amber-900 rounded flex items-center justify-center mb-0.5">
                  <Replace className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium leading-tight whitespace-nowrap">Bulk Edit</span>
              </button>

              <button
                onClick={onRefreshData}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/80 rounded transition-colors text-slate-800 cursor-pointer min-w-[52px]"
              >
                <RefreshCw className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-[11px] font-medium leading-tight">Refresh All</span>
              </button>
            </div>

            {/* Quick Reports Group */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-300">
              <div className="text-[10px] uppercase font-bold text-slate-400 mr-1 rotate-180 [writing-mode:vertical-lr]">
                Reports
              </div>
              <button
                onClick={() => onQuickReport('All Students')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs flex items-center gap-1"
              >
                <Printer className="w-3 h-3 text-emerald-700" />
                <span>All Students</span>
              </button>
              <button
                onClick={() => onQuickReport('Emergency Contact Information')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs flex items-center gap-1"
              >
                <Printer className="w-3 h-3 text-emerald-700" />
                <span>Emergency Contacts</span>
              </button>
              <button
                onClick={() => onQuickReport('Allergies and Medications')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs flex items-center gap-1"
              >
                <Printer className="w-3 h-3 text-rose-700" />
                <span>Medical Alerts</span>
              </button>
            </div>

            {/* Architecture Quick Jump */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenArchitecture}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-800 font-medium"
              >
                <Database className="w-4 h-4 text-[#a22b32]" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Inspect Schema & DDL</div>
                  <div className="text-[10px] text-slate-500">6 Tables • 5 Queries • 11 Reports</div>
                </div>
              </button>
            </div>
          </>
        )}

        {activeTab === 'Create' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-xs">Standard Access Designers:</span>
            <button onClick={onNewStudent} className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-blue-700" />
              <span>Student Form Wizard</span>
            </button>
            <button onClick={onOpenArchitecture} className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-700" />
              <span>Query SQL View</span>
            </button>
          </div>
        )}

        {activeTab === 'External' && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenOutlookImport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded text-blue-900 hover:bg-blue-100"
            >
              <Mail className="w-4 h-4 text-blue-700" />
              <span>Import from Outlook Contacts</span>
            </button>
            <button 
              onClick={() => {
                alert("Export to Excel completed: 'Students_Roster_Export.xlsx' generated.");
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 hover:bg-emerald-100"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Export Selected to Excel (.xlsx)</span>
            </button>
          </div>
        )}

        {activeTab === 'DatabaseTools' && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              <Database className="w-4 h-4 text-[#a22b32]" />
              <span>Visual Relationships Diagram</span>
            </button>
            <button 
              onClick={() => onQuickReport('Student Attendance by Date')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100"
            >
              <Printer className="w-4 h-4 text-indigo-700" />
              <span>Database Documenter</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
