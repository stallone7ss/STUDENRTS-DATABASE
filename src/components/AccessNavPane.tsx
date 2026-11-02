/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Table, 
  FileText, 
  Layers, 
  BookOpen, 
  Scroll, 
  Code, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronsLeft, 
  ChevronsRight,
  Plus
} from 'lucide-react';
import { AccessObjectType } from '../types/database';

interface AccessNavPaneProps {
  activeTabId: string;
  onOpenObject: (id: string, name: string, type: AccessObjectType) => void;
  onNewStudent: () => void;
}

export const AccessNavPane: React.FC<AccessNavPaneProps> = ({
  activeTabId,
  onOpenObject,
  onNewStudent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section toggle states
  const [openSections, setOpenSections] = useState({
    tables: true,
    queries: true,
    forms: true,
    reports: true,
    macros: true,
    modules: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tables = [
    { id: 'tbl_Filters', name: 'Filters', type: 'table' as const },
    { id: 'tbl_Guardians', name: 'Guardians', type: 'table' as const },
    { id: 'tbl_Settings', name: 'Settings', type: 'table' as const },
    { id: 'tbl_Student_Attendance', name: 'Student Attendance', type: 'table' as const },
    { id: 'tbl_Students', name: 'Students', type: 'table' as const },
    { id: 'tbl_Students_and_Guardians', name: 'Students and Guardians', type: 'table' as const },
  ];

  const queries = [
    { id: 'qry_Guardians_Extended', name: 'Guardians Extended', type: 'query' as const },
    { id: 'qry_Student_Attendance_Count', name: 'Student Attendance Count', type: 'query' as const },
    { id: 'qry_Student_Attendance_Extended', name: 'Student Attendance Extended', type: 'query' as const },
    { id: 'qry_Students_and_Guardians_Extended', name: 'Students and Guardians Extended', type: 'query' as const },
    { id: 'qry_Students_Extended', name: 'Students Extended', type: 'query' as const },
  ];

  const forms = [
    { id: 'frm_Attendance_Subform', name: 'Attendance Subform', type: 'form' as const },
    { id: 'frm_Filter_Details', name: 'Filter Details', type: 'form' as const },
    { id: 'frm_Guardian_Details', name: 'Guardian Details', type: 'form' as const },
    { id: 'frm_Guardian_List', name: 'Guardian List', type: 'form' as const },
    { id: 'frm_Guardians_Subform', name: 'Guardians Subform', type: 'form' as const },
    { id: 'frm_Student_Details', name: 'Student Details', type: 'form' as const },
    { id: 'frm_Student_List', name: 'Student List', type: 'form' as const },
    { id: 'frm_Welcome', name: 'Welcome', type: 'form' as const },
  ];

  const reports = [
    { id: 'rpt_All_Students', name: 'All Students', type: 'report' as const },
    { id: 'rpt_Allergies_and_Medications', name: 'Allergies and Medications', type: 'report' as const },
    { id: 'rpt_Emergency_Contact_Information', name: 'Emergency Contact Information', type: 'report' as const },
    { id: 'rpt_Guardian_Information', name: 'Guardian Information', type: 'report' as const },
    { id: 'rpt_Student_Address_Book', name: 'Student Address Book', type: 'report' as const },
    { id: 'rpt_Student_Attendance_by_Date', name: 'Student Attendance by Date', type: 'report' as const },
    { id: 'rpt_Student_Phone_List', name: 'Student Phone List', type: 'report' as const },
    { id: 'rpt_Students_Attendance_by', name: 'Students Attendance by...', type: 'report' as const },
    { id: 'rpt_Students_by_Circumstance', name: 'Students by Circumstance', type: 'report' as const },
    { id: 'rpt_Students_by_Level', name: 'Students by Level', type: 'report' as const },
    { id: 'rpt_Students_by_Room', name: 'Students by Room', type: 'report' as const },
  ];

  const macros = [
    { id: 'mcr_AutoExec', name: 'AutoExec', type: 'macro' as const },
    { id: 'mcr_Filters', name: 'Filters', type: 'macro' as const },
    { id: 'mcr_Search', name: 'Search', type: 'macro' as const },
  ];

  const modules = [
    { id: 'mod_modMapping', name: 'modMapping', type: 'module' as const },
  ];

  const filterItems = <T extends { name: string }>(items: T[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  if (isCollapsed) {
    return (
      <aside className="w-10 bg-slate-100 border-r border-slate-300 flex flex-col items-center py-3 select-none shrink-0 shadow-inner">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors mb-4"
          title="Open Navigation Pane"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
        <div className="rotate-90 origin-left translate-x-3.5 translate-y-6 text-xs font-semibold tracking-wider text-slate-600 whitespace-nowrap">
          All Access Objects
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-300 flex flex-col shrink-0 select-none text-xs text-slate-800 shadow-sm h-full">
      {/* Access Pane Header */}
      <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-red-900 tracking-tight text-sm">
          <span>All Access Obje...</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 cursor-pointer" />
        </div>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
          title="Collapse Navigation Pane"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Pane Search Box */}
      <div className="p-2 border-b border-slate-200 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-6 py-1 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-800 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Access Objects Tree */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-1">
        {/* Tables Section */}
        <div>
          <button
            onClick={() => toggleSection('tables')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-amber-800">Tables</span>
              <span className="text-slate-400 font-normal">({filterItems(tables).length})</span>
            </span>
            {openSections.tables ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.tables && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(tables).map((tbl) => {
                const isSelected = activeTabId === tbl.id;
                return (
                  <div
                    key={tbl.id}
                    onClick={() => onOpenObject(tbl.id, tbl.name, tbl.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-blue-100 text-blue-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access Table Grid Icon */}
                    <div className="w-3.5 h-3.5 border border-blue-700 grid grid-cols-2 grid-rows-2 bg-blue-50 shrink-0">
                      <div className="border-r border-b border-blue-400"></div>
                      <div className="border-b border-blue-400"></div>
                      <div className="border-r border-blue-400"></div>
                      <div></div>
                    </div>
                    <span className="truncate">{tbl.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Queries Section */}
        <div>
          <button
            onClick={() => toggleSection('queries')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-teal-800">Queries</span>
              <span className="text-slate-400 font-normal">({filterItems(queries).length})</span>
            </span>
            {openSections.queries ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.queries && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(queries).map((qry) => {
                const isSelected = activeTabId === qry.id;
                return (
                  <div
                    key={qry.id}
                    onClick={() => onOpenObject(qry.id, qry.name, qry.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-teal-100 text-teal-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access Query Icon */}
                    <div className="w-3.5 h-3.5 border border-teal-700 bg-teal-50 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 border-t-2 border-r-2 border-teal-600"></div>
                    </div>
                    <span className="truncate">{qry.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Forms Section */}
        <div>
          <button
            onClick={() => toggleSection('forms')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-pink-800">Forms</span>
              <span className="text-slate-400 font-normal">({filterItems(forms).length})</span>
            </span>
            {openSections.forms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.forms && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(forms).map((frm) => {
                const isSelected = activeTabId === frm.id;
                return (
                  <div
                    key={frm.id}
                    onClick={() => onOpenObject(frm.id, frm.name, frm.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-pink-100 text-pink-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access Form Icon */}
                    <div className="w-3.5 h-3.5 border border-pink-700 bg-pink-50 flex flex-col justify-between p-0.5 shrink-0">
                      <div className="h-1 bg-pink-700"></div>
                      <div className="h-1 bg-slate-300"></div>
                    </div>
                    <span className="truncate">{frm.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div>
          <button
            onClick={() => toggleSection('reports')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-emerald-800">Reports</span>
              <span className="text-slate-400 font-normal">({filterItems(reports).length})</span>
            </span>
            {openSections.reports ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.reports && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(reports).map((rpt) => {
                const isSelected = activeTabId === rpt.id;
                return (
                  <div
                    key={rpt.id}
                    onClick={() => onOpenObject(rpt.id, rpt.name, rpt.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-emerald-100 text-emerald-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access Green Report Icon */}
                    <div className="w-3.5 h-3.5 border border-emerald-700 bg-emerald-600 rounded-[1px] flex items-center justify-center shrink-0">
                      <div className="w-2 h-0.5 bg-white mb-1"></div>
                    </div>
                    <span className="truncate">{rpt.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Macros Section */}
        <div>
          <button
            onClick={() => toggleSection('macros')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-amber-700">Macros</span>
              <span className="text-slate-400 font-normal">({filterItems(macros).length})</span>
            </span>
            {openSections.macros ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.macros && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(macros).map((mcr) => {
                const isSelected = activeTabId === mcr.id;
                return (
                  <div
                    key={mcr.id}
                    onClick={() => onOpenObject(mcr.id, mcr.name, mcr.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-amber-100 text-amber-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access Gold Scroll Macro Icon */}
                    <Scroll className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{mcr.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modules Section */}
        <div>
          <button
            onClick={() => toggleSection('modules')}
            className="w-full flex items-center justify-between px-2 py-1 text-slate-700 hover:bg-slate-200/60 font-bold text-left rounded"
          >
            <span className="flex items-center gap-1">
              <span className="text-indigo-800">Modules</span>
              <span className="text-slate-400 font-normal">({filterItems(modules).length})</span>
            </span>
            {openSections.modules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.modules && (
            <div className="pl-2 space-y-0.5 mt-0.5">
              {filterItems(modules).map((mod) => {
                const isSelected = activeTabId === mod.id;
                return (
                  <div
                    key={mod.id}
                    onClick={() => onOpenObject(mod.id, mod.name, mod.type)}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded transition-colors ${
                      isSelected 
                        ? 'bg-indigo-100 text-indigo-900 font-medium' 
                        : 'hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {/* Access VBA Hammers/Cogs Module Icon */}
                    <Code className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{mod.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pane Footer Status */}
      <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Datasheet View</span>
        <span className="text-[10px] text-slate-400">MS Access 365</span>
      </div>
    </aside>
  );
};
