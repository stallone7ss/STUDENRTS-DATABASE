/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export default function App() {
  // State for all 6 tables
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [guardians, setGuardians] = useState<Guardian[]>(INITIAL_GUARDIANS);
  const [relations, setRelations] = useState<StudentGuardianRelation[]>(INITIAL_STUDENTS_AND_GUARDIANS);
  const [attendance, setAttendance] = useState<StudentAttendance[]>(INITIAL_ATTENDANCE);
  const [filters, setFilters] = useState<FilterSetting[]>(INITIAL_FILTERS);
  const [settings, setSettings] = useState<SystemSetting[]>(INITIAL_SETTINGS);

  // Tabs system mimicking Microsoft Access tabbed documents
  const [tabs, setTabs] = useState<OpenTab[]>([
    { id: 'frm_Student_List', title: 'Student List', type: 'form', targetId: 'Student List' },
    { id: 'frm_Welcome', title: 'Welcome', type: 'form', targetId: 'Welcome' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('frm_Student_List');

  // Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isOutlookModalOpen, setIsOutlookModalOpen] = useState(false);
  const [mappingStudent, setMappingStudent] = useState<Student | null>(null);

  // Handle opening an object from the Navigation Pane
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
    if (tabs.length === 1) return; // Keep at least one tab open
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  // Student Actions
  const handleOpenStudentDetails = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    const tabId = `student_details_${studentId}`;
    handleOpenObject(tabId, student ? `${student.lastName}, ${student.firstName}` : 'Student Details', 'form', { studentId });
  };

  const handleNewStudent = () => {
    const newId = Math.max(...students.map(s => s.id), 0) + 1;
    const newStudentNumber = `STU-2024-${100 + newId}`;
    const newStudent: Student = {
      id: newId,
      studentId: newStudentNumber,
      firstName: 'New',
      lastName: 'Student',
      emailAddress: `new.student${newId}@schoolnet.org`,
      level: 'Grade 9',
      room: 'Room 101',
      specialCircumstances: false,
      dob: '2010-01-01',
      gender: 'M',
      address: '100 School Lane',
      city: 'Seattle',
      state: 'WA',
      zipPostalCode: '98101',
      country: 'USA',
      emergencyContactName: 'Parent Guardian',
      emergencyContactPhone: '(555) 000-0000',
      emergencyContactRelationship: 'Mother',
      notes: 'New enrollment entry.'
    };
    setStudents(prev => [newStudent, ...prev]);
    handleOpenStudentDetails(newId);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setRelations(prev => prev.filter(r => r.studentId !== studentId));
    setAttendance(prev => prev.filter(a => a.studentId !== studentId));
    handleCloseTab(`student_details_${studentId}`);
  };

  // Guardian Actions
  const handleOpenGuardianDetails = (guardianId: number) => {
    const guardian = guardians.find(g => g.id === guardianId);
    const tabId = `guardian_details_${guardianId}`;
    handleOpenObject(tabId, guardian ? `${guardian.lastName}, ${guardian.firstName}` : 'Guardian Details', 'form', { guardianId });
  };

  const handleSaveGuardian = (updatedGuardian: Guardian) => {
    setGuardians(prev => prev.map(g => g.id === updatedGuardian.id ? updatedGuardian : g));
  };

  // Student-Guardian Relations
  const handleAddRelation = (newRel: Omit<StudentGuardianRelation, 'id'>) => {
    const newId = Math.max(...relations.map(r => r.id), 0) + 1;
    setRelations(prev => [...prev, { ...newRel, id: newId }]);
  };

  const handleRemoveRelation = (relationId: number) => {
    setRelations(prev => prev.filter(r => r.id !== relationId));
  };

  // Attendance Actions
  const handleAddAttendance = (newRecord: Omit<StudentAttendance, 'id'>) => {
    const newId = Math.max(...attendance.map(a => a.id), 0) + 1;
    setAttendance(prev => [{ ...newRecord, id: newId }, ...prev]);
  };

  const handleDeleteAttendance = (attendanceId: number) => {
    setAttendance(prev => prev.filter(a => a.id !== attendanceId));
  };

  // Outlook import
  const handleImportFromOutlook = (imported: Partial<Student>) => {
    const newId = Math.max(...students.map(s => s.id), 0) + 1;
    const fullStudent: Student = {
      id: newId,
      studentId: imported.studentId || `STU-2024-${100 + newId}`,
      firstName: imported.firstName || 'Imported',
      lastName: imported.lastName || 'Student',
      emailAddress: imported.emailAddress || 'imported@example.com',
      level: imported.level || 'Grade 9',
      room: imported.room || 'Room 101',
      specialCircumstances: false,
      dob: imported.dob || '2009-01-01',
      gender: imported.gender || 'Other',
      address: imported.address || 'Address',
      city: imported.city || 'City',
      state: imported.state || 'WA',
      zipPostalCode: imported.zipPostalCode || '00000',
      country: 'USA',
      emergencyContactName: imported.emergencyContactName || 'Emergency Contact',
      emergencyContactPhone: imported.emergencyContactPhone || '(555) 000-0000',
      emergencyContactRelationship: imported.emergencyContactRelationship || 'Parent',
      notes: imported.notes
    };
    setStudents(prev => [fullStudent, ...prev]);
    handleOpenStudentDetails(newId);
  };

  // Active Tab Rendering
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const renderActiveContent = () => {
    if (!activeTab) return null;

    // Student Details
    if (activeTab.id.startsWith('student_details_')) {
      const studentId = activeTab.params?.studentId;
      const student = students.find(s => s.id === studentId);
      if (!student) {
        return (
          <div className="p-8 text-center text-slate-500">
            Student record not found or was deleted.
          </div>
        );
      }
      return (
        <StudentDetailsForm
          student={student}
          allGuardians={guardians}
          allRelations={relations}
          allAttendance={attendance}
          onSaveStudent={handleSaveStudent}
          onDeleteStudent={handleDeleteStudent}
          onClose={() => handleCloseTab(activeTab.id)}
          onOpenGuardianDetails={handleOpenGuardianDetails}
          onAddRelation={handleAddRelation}
          onRemoveRelation={handleRemoveRelation}
          onAddAttendance={handleAddAttendance}
          onDeleteAttendance={handleDeleteAttendance}
          onOpenMap={(st) => setMappingStudent(st)}
        />
      );
    }

    // Guardian Details
    if (activeTab.id.startsWith('guardian_details_')) {
      const guardianId = activeTab.params?.guardianId;
      const guardian = guardians.find(g => g.id === guardianId);
      if (!guardian) {
        return <div className="p-8 text-center text-slate-500">Guardian record not found.</div>;
      }
      return (
        <GuardianDetailsForm
          guardian={guardian}
          allStudents={students}
          allRelations={relations}
          onSaveGuardian={handleSaveGuardian}
          onClose={() => handleCloseTab(activeTab.id)}
          onOpenStudent={handleOpenStudentDetails}
        />
      );
    }

    // Standard Named Access Objects
    switch (activeTab.id) {
      // FORMS
      case 'frm_Welcome':
        return (
          <WelcomeForm
            onOpenStudentList={() => handleOpenObject('frm_Student_List', 'Student List', 'form')}
            onNewStudent={handleNewStudent}
            onOpenAttendance={() => handleOpenObject('frm_Attendance_Subform', 'Attendance Subform', 'form')}
            onOpenReport={(rpt) => handleOpenObject(`rpt_${rpt.replace(/\s+/g, '_')}`, rpt, 'report')}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
          />
        );

      case 'frm_Student_List':
        return (
          <StudentListForm
            students={students}
            onOpenStudentDetails={handleOpenStudentDetails}
            onNewStudent={handleNewStudent}
            onOpenOutlookImport={() => setIsOutlookModalOpen(true)}
            onOpenMap={(st) => setMappingStudent(st)}
          />
        );

      case 'frm_Guardian_List':
        return (
          <GuardianListForm
            guardians={guardians}
            onOpenGuardian={handleOpenGuardianDetails}
          />
        );

      case 'frm_Guardian_Details':
        return guardians[0] ? (
          <GuardianDetailsForm
            guardian={guardians[0]}
            allStudents={students}
            allRelations={relations}
            onSaveGuardian={handleSaveGuardian}
            onClose={() => handleCloseTab(activeTab.id)}
            onOpenStudent={handleOpenStudentDetails}
          />
        ) : null;

      case 'frm_Student_Details':
        return students[0] ? (
          <StudentDetailsForm
            student={students[0]}
            allGuardians={guardians}
            allRelations={relations}
            allAttendance={attendance}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onClose={() => handleCloseTab(activeTab.id)}
            onOpenGuardianDetails={handleOpenGuardianDetails}
            onAddRelation={handleAddRelation}
            onRemoveRelation={handleRemoveRelation}
            onAddAttendance={handleAddAttendance}
            onDeleteAttendance={handleDeleteAttendance}
            onOpenMap={(st) => setMappingStudent(st)}
          />
        ) : null;

      case 'frm_Attendance_Subform':
        return (
          <div className="p-4 bg-white h-full overflow-auto">
            <h2 className="font-bold text-slate-800 text-sm mb-3">Attendance Subform (Stand-alone Design View)</h2>
            <TableDatasheetView
              tableName="Student Attendance"
              students={students}
              guardians={guardians}
              relations={relations}
              attendance={attendance}
              filters={filters}
              settings={settings}
            />
          </div>
        );

      case 'frm_Guardians_Subform':
        return (
          <div className="p-4 bg-white h-full overflow-auto">
            <h2 className="font-bold text-slate-800 text-sm mb-3">Guardians Subform (Stand-alone Design View)</h2>
            <TableDatasheetView
              tableName="Students and Guardians"
              students={students}
              guardians={guardians}
              relations={relations}
              attendance={attendance}
              filters={filters}
              settings={settings}
            />
          </div>
        );

      case 'frm_Filter_Details':
        return (
          <div className="p-4 bg-white h-full overflow-auto">
            <h2 className="font-bold text-slate-800 text-sm mb-3">Filter Details (Form View)</h2>
            <TableDatasheetView
              tableName="Filters"
              students={students}
              guardians={guardians}
              relations={relations}
              attendance={attendance}
              filters={filters}
              settings={settings}
            />
          </div>
        );

      // TABLES
      case 'tbl_Students':
        return <TableDatasheetView tableName="Students" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;
      case 'tbl_Guardians':
        return <TableDatasheetView tableName="Guardians" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;
      case 'tbl_Students_and_Guardians':
        return <TableDatasheetView tableName="Students and Guardians" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;
      case 'tbl_Student_Attendance':
        return <TableDatasheetView tableName="Student Attendance" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;
      case 'tbl_Filters':
        return <TableDatasheetView tableName="Filters" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;
      case 'tbl_Settings':
        return <TableDatasheetView tableName="Settings" students={students} guardians={guardians} relations={relations} attendance={attendance} filters={filters} settings={settings} />;

      // QUERIES
      case 'qry_Guardians_Extended':
      case 'qry_Student_Attendance_Count':
      case 'qry_Student_Attendance_Extended':
      case 'qry_Students_and_Guardians_Extended':
      case 'qry_Students_Extended':
        return <QueryDataView queryName={activeTab.title} students={students} guardians={guardians} relations={relations} attendance={attendance} />;

      // MACROS
      case 'mcr_AutoExec':
      case 'mcr_Filters':
      case 'mcr_Search':
        return <MacroViewer macroName={activeTab.title} />;

      // MODULES
      case 'mod_modMapping':
        return <VbaModuleViewer students={students} onOpenMap={(st) => setMappingStudent(st)} />;

      // REPORTS
      default:
        if (activeTab.type === 'report') {
          return (
            <ReportViewer
              reportName={activeTab.title}
              students={students}
              guardians={guardians}
              relations={relations}
              attendance={attendance}
            />
          );
        }
        return <div className="p-8 text-center text-slate-500">Select an object from the left navigation pane.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-200">
      {/* Microsoft Access Top Ribbon */}
      <AccessRibbon
        onNewStudent={handleNewStudent}
        onOpenOutlookImport={() => setIsOutlookModalOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onRefreshData={() => {
          setStudents([...students]);
        }}
        onQuickReport={(rpt) => handleOpenObject(`rpt_${rpt.replace(/\s+/g, '_')}`, rpt, 'report')}
      />

      {/* Main Workspace: Left Navigation Pane + Tabbed Document Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Pane matching the user's screenshots */}
        <AccessNavPane
          activeTabId={activeTabId}
          onOpenObject={handleOpenObject}
          onNewStudent={handleNewStudent}
        />

        {/* Tabbed Documents Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            onCloseTab={handleCloseTab}
          />

          <div className="flex-1 overflow-hidden relative">
            {renderActiveContent()}
          </div>
        </main>
      </div>

      {/* Architecture & SQL DDL Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Outlook Contacts Importer Modal */}
      <OutlookImportModal
        isOpen={isOutlookModalOpen}
        onClose={() => setIsOutlookModalOpen(false)}
        onImportStudent={handleImportFromOutlook}
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
