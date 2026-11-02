/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_STUDENTS, 
  INITIAL_GUARDIANS, 
  INITIAL_STUDENTS_AND_GUARDIANS, 
  INITIAL_ATTENDANCE, 
  INITIAL_FILTERS, 
  INITIAL_SETTINGS 
} from './data/initialData';
import { Student, Guardian, StudentGuardianRelation, StudentAttendance, FilterSetting, SystemSetting, OpenTab, AccessObjectType } from './types/database';
import { AccessRibbon } from './components/AccessRibbon';
import { AccessNavPane } from './components/AccessNavPane';
import { TabBar } from './components/TabBar';
import { WelcomeForm } from './components/forms/WelcomeForm';
import { StudentListForm } from './components/forms/StudentListForm';
import { StudentDetailsForm } from './components/forms/StudentDetailsForm';
import { GuardianDetailsForm, GuardianListForm } from './components/forms/GuardianDetailsForm';
import { OutlookImportModal } from './components/forms/OutlookImportModal';
import { TableDatasheetView } from './components/tables/TableDatasheetView';
import { QueryDataView } from './components/queries/QueryDataView';
import { ReportViewer } from './components/reports/ReportViewer';
import { MacroViewer } from './components/macros/MacroViewer';
import { VbaModuleViewer } from './components/modules/VbaModuleViewer';
import { ArchitectureModal } from './components/documentation/ArchitectureModal';
import { MapModal } from './components/modals/MapModal';
import { BulkEditModal } from './components/modals/BulkEditModal';

// Modern Components
import { Sidebar, ModernNavSection } from './components/modern/Sidebar';
import { Header } from './components/modern/Header';
import { StudentList, ExtendedStudentView } from './components/modern/StudentList';
import { EmailListModal } from './components/modern/EmailListModal';
import { NewStudentModal } from './components/modern/NewStudentModal';
import { StudentDetailDrawer } from './components/modern/StudentDetailDrawer';
import { SchemaInspector } from './components/modern/SchemaInspector';
import { GuardiansView } from './components/modern/GuardiansView';
import { AttendanceView } from './components/modern/AttendanceView';
import { ModernReportsView } from './components/modern/ModernReportsView';

import { localStore } from './lib/supabase';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  // App Mode: Modern Web App (Supabase + React 19) vs Legacy Access Desktop UI
  const [appMode, setAppMode] = useState<'modern' | 'legacy'>('modern');

  // Modern Navigation State
  const [activeModernSection, setActiveModernSection] = useState<ModernNavSection>('students');

  // Modern Modals State
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isEmailListModalOpen, setIsEmailListModalOpen] = useState(false);
  const [emailListRecipients, setEmailListRecipients] = useState<string[]>([]);
  const [selectedDrawerStudent, setSelectedDrawerStudent] = useState<ExtendedStudentView | null>(null);

  // Core Data State (synchronized with localStore)
  const [students, setStudents] = useState<Student[]>(localStore.students);
  const [guardians, setGuardians] = useState<Guardian[]>(localStore.guardians);
  const [relations, setRelations] = useState<StudentGuardianRelation[]>(localStore.relations);
  const [attendance, setAttendance] = useState<StudentAttendance[]>(localStore.attendance);
  const [filters, setFilters] = useState<FilterSetting[]>(INITIAL_FILTERS);
  const [settings, setSettings] = useState<SystemSetting[]>(INITIAL_SETTINGS);

  // Multi-Record Selection
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // Undo Stack for Bulk Operations
  const [undoStack, setUndoStack] = useState<Student[][]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tabs for Legacy Access mode
  const [tabs, setTabs] = useState<OpenTab[]>([
    { id: 'frm_Student_List', title: 'Student List', type: 'form', targetId: 'Student List' },
    { id: 'frm_Welcome', title: 'Welcome', type: 'form', targetId: 'Welcome' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('frm_Student_List');

  // Legacy Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isOutlookModalOpen, setIsOutlookModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [mappingStudent, setMappingStudent] = useState<Student | null>(null);

  // Synchronize state on localStore change
  useEffect(() => {
    const unsub = localStore.subscribe(() => {
      setStudents([...localStore.students]);
      setGuardians([...localStore.guardians]);
      setRelations([...localStore.relations]);
      setAttendance([...localStore.attendance]);
    });
    return () => unsub();
  }, []);

  // Keyboard shortcut for Undo (Ctrl+Z / Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (undoStack.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack]);

  // Bulk Update Execution
  const handleApplyBulkUpdate = (updatedStudents: Student[], changeLogSummary: string) => {
    setUndoStack(prev => [...prev, students]);
    localStore.students = updatedStudents;
    localStore.notify();
    setSelectedStudentIds([]);
    setToastMessage(changeLogSummary);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Undo Last Bulk Update
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    localStore.students = previousState;
    localStore.notify();
    setToastMessage("Last bulk update reverted.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle opening an object from the Legacy Navigation Pane
  const handleOpenObject = (id: string, name: string, type: AccessObjectType, params?: Record<string, any>) => {
    const existingIndex = tabs.findIndex(t => t.id === id);
    if (existingIndex >= 0) {
      setActiveTabId(id);
    } else {
      setTabs(prev => [...prev, { id, title: name, type, targetId: name, params }]);
      setActiveTabId(id);
    }
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  // Modern Student Detail Opener
  const handleOpenModernStudentDetails = (studentId: number) => {
    const all = localStore.getViewStudentsExtended();
    const st = all.find(s => s.id === studentId) || null;
    setSelectedDrawerStudent(st);
  };

  // Modern Email List Opener
  const handleOpenEmailList = (emails: string[]) => {
    setEmailListRecipients(emails);
    setIsEmailListModalOpen(true);
  };

  // Delete student
  const handleDeleteStudent = (studentId: number) => {
    localStore.deleteStudent(studentId);
    setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    handleCloseTab(`student_details_${studentId}`);
  };

  // Render Modern View Content
  const renderModernSectionContent = () => {
    switch (activeModernSection) {
      case 'students':
        return (
          <StudentList
            onNewStudent={() => setIsNewStudentModalOpen(true)}
            onOpenEmailList={handleOpenEmailList}
            onOpenStudentDetails={handleOpenModernStudentDetails}
            onOpenBulkEdit={() => setIsBulkEditModalOpen(true)}
            onOpenSchema={() => setActiveModernSection('schema')}
          />
        );
      case 'guardians':
        return <GuardiansView />;
      case 'attendance':
        return <AttendanceView />;
      case 'reports':
        return <ModernReportsView />;
      case 'schema':
        return <SchemaInspector />;
      case 'settings':
        return (
          <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h1 className="font-bold text-base text-slate-900">System & School Configuration</h1>
            <p className="text-xs text-slate-500">Settings table values replicated in PostgreSQL</p>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Setting Key</th>
                    <th className="px-4 py-3 font-semibold">Setting Value</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settings.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-medium text-slate-800">{s.settingName}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-800">{s.settingValue}</td>
                      <td className="px-4 py-3 text-slate-500">{s.category}</td>
                      <td className="px-4 py-3 text-slate-600">{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Top Transition Switcher Bar */}
      <div className="bg-slate-950 text-white px-4 py-1.5 flex items-center justify-between text-xs shrink-0 border-b border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">Application Architecture:</span>
          <span className="text-slate-300">
            {appMode === 'modern' ? 'Supabase PostgreSQL + React 19 (Modernized)' : 'Microsoft Access Desktop Interface (Legacy)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppMode('modern')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              appMode === 'modern' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Modern Web App (Supabase)
          </button>
          <button
            onClick={() => setAppMode('legacy')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              appMode === 'legacy' ? 'bg-[#8b1f24] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Legacy Access Desktop UI
          </button>
        </div>
      </div>

      {appMode === 'modern' ? (
        /* MODERN FULL-STACK APPLICATION VIEW */
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <Sidebar
            activeSection={activeModernSection}
            onSelectSection={setActiveModernSection}
            onSwitchToLegacyAccess={() => setAppMode('legacy')}
            studentCount={students.length}
          />

          {/* Main Content Viewport */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Header
              activeSection={activeModernSection}
              onOpenSchema={() => setActiveModernSection('schema')}
            />

            <main className="flex-1 overflow-hidden relative">
              {renderModernSectionContent()}
            </main>

            {/* Action Notification Toast */}
            {toastMessage && (
              <div className="absolute bottom-4 right-4 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 text-xs border border-slate-700 animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
                {undoStack.length > 0 && (
                  <button
                    onClick={handleUndo}
                    className="ml-2 flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-semibold text-xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LEGACY MICROSOFT ACCESS REPLICANT VIEW */
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-200">
          <AccessRibbon
            onNewStudent={() => setIsNewStudentModalOpen(true)}
            onOpenOutlookImport={() => setIsOutlookModalOpen(true)}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
            onRefreshData={() => setStudents([...localStore.students])}
            onQuickReport={(rpt) => handleOpenObject(`rpt_${rpt.replace(/\s+/g, '_')}`, rpt, 'report')}
            onOpenBulkEdit={() => setIsBulkEditModalOpen(true)}
            canUndo={undoStack.length > 0}
            onUndo={handleUndo}
          />

          <div className="flex-1 flex overflow-hidden">
            <AccessNavPane
              activeTabId={activeTabId}
              onOpenObject={handleOpenObject}
              onNewStudent={() => setIsNewStudentModalOpen(true)}
            />

            <main className="flex-1 flex flex-col overflow-hidden bg-slate-100 relative">
              <TabBar
                tabs={tabs}
                activeTabId={activeTabId}
                onSelectTab={setActiveTabId}
                onCloseTab={handleCloseTab}
              />

              <div className="flex-1 overflow-hidden relative">
                {activeTabId === 'frm_Welcome' ? (
                  <WelcomeForm
                    onOpenStudentList={() => handleOpenObject('frm_Student_List', 'Student List', 'form')}
                    onNewStudent={() => setIsNewStudentModalOpen(true)}
                    onOpenAttendance={() => handleOpenObject('frm_Attendance_Subform', 'Attendance Subform', 'form')}
                    onOpenReport={(rpt) => handleOpenObject(`rpt_${rpt.replace(/\s+/g, '_')}`, rpt, 'report')}
                    onOpenArchitecture={() => setIsArchitectureOpen(true)}
                  />
                ) : activeTabId === 'frm_Student_List' ? (
                  <StudentListForm
                    students={students}
                    onOpenStudentDetails={handleOpenModernStudentDetails}
                    onNewStudent={() => setIsNewStudentModalOpen(true)}
                    onOpenOutlookImport={() => setIsOutlookModalOpen(true)}
                    onOpenMap={(st) => setMappingStudent(st)}
                    selectedStudentIds={selectedStudentIds}
                    onToggleSelectStudent={(id) => {
                      setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                    }}
                    onSelectAllStudents={setSelectedStudentIds}
                    onClearStudentSelection={() => setSelectedStudentIds([])}
                    onOpenBulkEdit={() => setIsBulkEditModalOpen(true)}
                  />
                ) : (
                  <TableDatasheetView
                    tableName="Students"
                    students={students}
                    guardians={guardians}
                    relations={relations}
                    attendance={attendance}
                    filters={filters}
                    settings={settings}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Modern Student Creation Modal */}
      <NewStudentModal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        onStudentCreated={() => {
          setStudents([...localStore.students]);
          setToastMessage("New student enrolled in Supabase PostgreSQL database.");
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Modern E-mail List Modal */}
      <EmailListModal
        isOpen={isEmailListModalOpen}
        onClose={() => setIsEmailListModalOpen(false)}
        emailAddresses={emailListRecipients}
      />

      {/* Modern Student Detail Slide-Over Drawer */}
      <StudentDetailDrawer
        student={selectedDrawerStudent}
        onClose={() => setSelectedDrawerStudent(null)}
        onDelete={handleDeleteStudent}
        onOpenMap={(addr) => {
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
        }}
      />

      {/* Bulk Edit & Find/Replace Utility Modal */}
      <BulkEditModal
        isOpen={isBulkEditModalOpen}
        onClose={() => setIsBulkEditModalOpen(false)}
        allStudents={students}
        selectedStudentIds={selectedStudentIds}
        filteredStudentIds={students.map(s => s.id)}
        onApplyBulkUpdate={handleApplyBulkUpdate}
      />

      {/* Architecture & SQL DDL Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Outlook Contacts Importer Modal */}
      <OutlookImportModal
        isOpen={isOutlookModalOpen}
        onClose={() => setIsOutlookModalOpen(false)}
        onImportStudent={(imported) => {
          localStore.insertStudent(imported);
          setToastMessage("Student imported from Outlook contacts.");
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* modMapping Address Resolver Modal */}
      <MapModal
        isOpen={!!mappingStudent}
        student={mappingStudent}
        onClose={() => setMappingStudent(null)}
      />
    </div>
  );
}
