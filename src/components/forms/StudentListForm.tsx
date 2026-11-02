/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Mail, 
  Search, 
  Filter, 
  RotateCcw, 
  ExternalLink, 
  MapPin, 
  Check, 
  AlertTriangle,
  ArrowUpDown,
  Replace,
  CheckSquare,
  Square
} from 'lucide-react';
import { Student } from '../../types/database';

interface StudentListFormProps {
  students: Student[];
  onOpenStudentDetails: (studentId: number) => void;
  onNewStudent: () => void;
  onOpenOutlookImport: () => void;
  onOpenMap: (student: Student) => void;
  selectedStudentIds: number[];
  onToggleSelectStudent: (id: number) => void;
  onSelectAllStudents: (ids: number[]) => void;
  onClearStudentSelection: () => void;
  onOpenBulkEdit: () => void;
}

export const StudentListForm: React.FC<StudentListFormProps> = ({
  students,
  onOpenStudentDetails,
  onNewStudent,
  onOpenOutlookImport,
  onOpenMap,
  selectedStudentIds,
  onToggleSelectStudent,
  onSelectAllStudents,
  onClearStudentSelection,
  onOpenBulkEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [specialCircumstancesOnly, setSpecialCircumstancesOnly] = useState(false);
  const [activeRowId, setActiveRowId] = useState<number | null>(students[0]?.id || null);

  // Sorting
  const [sortField, setSortField] = useState<keyof Student>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search matching Macro logic
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          student.studentId.toLowerCase().includes(q) ||
          student.firstName.toLowerCase().includes(q) ||
          student.lastName.toLowerCase().includes(q) ||
          student.emailAddress.toLowerCase().includes(q) ||
          (student.room && student.room.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Level filter
      if (levelFilter !== 'ALL' && student.level !== levelFilter) {
        return false;
      }

      // Room filter
      if (roomFilter !== 'ALL' && student.room !== roomFilter) {
        return false;
      }

      // Special circumstances filter
      if (specialCircumstancesOnly && !student.specialCircumstances) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, searchQuery, levelFilter, roomFilter, specialCircumstancesOnly, sortField, sortDirection]);

  // Unique levels and rooms for filter dropdowns
  const levels = useMemo(() => Array.from(new Set(students.map(s => s.level))).sort(), [students]);
  const rooms = useMemo(() => Array.from(new Set(students.map(s => s.room))).sort(), [students]);

  const activeFilterCount = (levelFilter !== 'ALL' ? 1 : 0) + (roomFilter !== 'ALL' ? 1 : 0) + (specialCircumstancesOnly ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setLevelFilter('ALL');
    setRoomFilter('ALL');
    setSpecialCircumstancesOnly(false);
  };

  const selectedIndex = filteredStudents.findIndex(s => s.id === activeRowId);

  // Master checkbox state
  const allFilteredSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedStudentIds.includes(s.id));
  const someFilteredSelected = filteredStudents.some(s => selectedStudentIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      onClearStudentSelection();
    } else {
      onSelectAllStudents(filteredStudents.map(s => s.id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white select-none">
      {/* Top Form Header / Action Ribbon Bar (Microsoft Access Style) */}
      <div className="bg-slate-100 border-b border-slate-300 p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* New Student Button */}
          <button
            onClick={onNewStudent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b1f24] hover:bg-[#72191d] text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student</span>
          </button>

          {/* Add From Outlook Button */}
          <button
            onClick={onOpenOutlookImport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Add From Outlook</span>
          </button>

          {/* Bulk Edit & Find/Replace Button */}
          <button
            onClick={onOpenBulkEdit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
              selectedStudentIds.length > 0 
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse-once' 
                : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800'
            }`}
            title="Batch Update / Find and Replace across multiple student records"
          >
            <Replace className={`w-3.5 h-3.5 ${selectedStudentIds.length > 0 ? 'text-white' : 'text-amber-700'}`} />
            <span>
              {selectedStudentIds.length > 0 
                ? `Bulk Edit (${selectedStudentIds.length} Selected)` 
                : 'Bulk Edit & Replace'}
            </span>
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block"></div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-medium text-slate-600">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-900 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Room Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-medium text-slate-600">Room:</span>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-900 focus:outline-none"
            >
              <option value="ALL">All Rooms</option>
              {rooms.map(rm => (
                <option key={rm} value={rm}>{rm}</option>
              ))}
            </select>
          </div>

          {/* Special Circumstances Checkbox */}
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={specialCircumstancesOnly}
              onChange={(e) => setSpecialCircumstancesOnly(e.target.checked)}
              className="rounded border-slate-300 text-red-900 focus:ring-red-900"
            />
            <span className="font-medium">Special Circumstances</span>
          </label>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-800 hover:text-red-950 hover:bg-red-50 rounded transition-colors"
              title="Clear all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-7 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Floating Selection Alert when records are selected */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-950 shrink-0">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-700" />
            <span className="font-semibold">
              {selectedStudentIds.length} of {students.length} student records selected
            </span>
            <span className="text-slate-400">|</span>
            <button
              onClick={handleToggleSelectAll}
              className="text-amber-900 hover:underline font-medium text-[11px]"
            >
              {allFilteredSelected ? 'Deselect All' : `Select All ${filteredStudents.length} Filtered`}
            </button>
            <button
              onClick={onClearStudentSelection}
              className="text-slate-500 hover:text-slate-800 text-[11px]"
            >
              Clear Selection
            </button>
          </div>

          <button
            onClick={onOpenBulkEdit}
            className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs shadow-xs"
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Launch Bulk Editor</span>
          </button>
        </div>
      )}

      {/* Datasheet Table View */}
      <div className="flex-1 overflow-auto bg-white border-b border-slate-300">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header with Microsoft Access Grey Datasheet styling */}
          <thead className="bg-slate-200 text-slate-800 sticky top-0 border-b border-slate-300 z-10 shadow-xs">
            <tr>
              {/* Record Selector & Master Select-All Checkbox */}
              <th className="w-12 px-2 py-1.5 border-r border-slate-300 text-center font-normal">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={el => {
                    if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                  }}
                  onChange={handleToggleSelectAll}
                  className="rounded border-slate-300 text-red-900 focus:ring-red-900 cursor-pointer"
                  title="Select / Deselect all visible records"
                />
              </th>
              <th 
                onClick={() => handleSort('studentId')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>Student ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('firstName')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>First Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('lastName')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>Last Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('emailAddress')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>E-mail Address</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('level')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('room')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>Room</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('specialCircumstances')}
                className="px-3 py-1.5 border-r border-slate-300 font-semibold text-center cursor-pointer hover:bg-slate-300/80 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Special Circumstances</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="px-3 py-1.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-slate-400" />
                    <span>No students match the selected filter criteria.</span>
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs text-slate-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isActiveRow = student.id === activeRowId;
                const isChecked = selectedStudentIds.includes(student.id);

                return (
                  <tr
                    key={student.id}
                    onClick={() => setActiveRowId(student.id)}
                    onDoubleClick={() => onOpenStudentDetails(student.id)}
                    className={`cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-amber-50/80 text-amber-950 font-medium'
                        : isActiveRow 
                          ? 'bg-blue-100/90 text-blue-950 font-medium' 
                          : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {/* Access Record Selector & Checkbox Column */}
                    <td 
                      className="px-2 py-1.5 text-center border-r border-slate-200 bg-slate-100/70"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-[9px] text-slate-400 w-2.5">
                          {isActiveRow ? '▶' : ''}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSelectStudent(student.id)}
                          className="rounded border-slate-300 text-red-900 focus:ring-red-900 cursor-pointer"
                        />
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="px-3 py-1.5 border-r border-slate-200 font-mono tabular-nums text-slate-700">
                      {student.studentId}
                    </td>

                    {/* First Name */}
                    <td className="px-3 py-1.5 border-r border-slate-200">
                      {student.firstName}
                    </td>

                    {/* Last Name */}
                    <td className="px-3 py-1.5 border-r border-slate-200 font-medium">
                      {student.lastName}
                    </td>

                    {/* Email */}
                    <td className="px-3 py-1.5 border-r border-slate-200 text-blue-700 underline truncate max-w-[220px]">
                      {student.emailAddress}
                    </td>

                    {/* Level */}
                    <td className="px-3 py-1.5 border-r border-slate-200">
                      {student.level}
                    </td>

                    {/* Room */}
                    <td className="px-3 py-1.5 border-r border-slate-200 font-mono">
                      {student.room}
                    </td>

                    {/* Special Circumstances */}
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                      {student.specialCircumstances ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Flagged</span>
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-1.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMap(student);
                          }}
                          className="p-1 text-slate-600 hover:text-red-900 hover:bg-slate-200 rounded"
                          title="Open Map via modMapping"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStudentDetails(student.id);
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium text-slate-700 flex items-center gap-1"
                        >
                          <span>Open Details</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Access Bottom Record Navigation Bar */}
      <div className="bg-slate-100 border-t border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs text-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">Record:</span>
          <div className="flex items-center border border-slate-300 rounded bg-white">
            <button
              disabled={filteredStudents.length === 0 || selectedIndex <= 0}
              onClick={() => setActiveRowId(filteredStudents[0]?.id)}
              className="px-1.5 py-0.5 hover:bg-slate-100 disabled:opacity-30 border-r border-slate-300"
              title="First Record"
            >
              |◀
            </button>
            <button
              disabled={filteredStudents.length === 0 || selectedIndex <= 0}
              onClick={() => {
                if (selectedIndex > 0) setActiveRowId(filteredStudents[selectedIndex - 1].id);
              }}
              className="px-1.5 py-0.5 hover:bg-slate-100 disabled:opacity-30 border-r border-slate-300"
              title="Previous Record"
            >
              ◀
            </button>
            <span className="px-2 py-0.5 font-mono tabular-nums text-slate-900 font-semibold">
              {selectedIndex >= 0 ? selectedIndex + 1 : 0} of {filteredStudents.length}
            </span>
            <button
              disabled={filteredStudents.length === 0 || selectedIndex >= filteredStudents.length - 1}
              onClick={() => {
                if (selectedIndex < filteredStudents.length - 1) setActiveRowId(filteredStudents[selectedIndex + 1].id);
              }}
              className="px-1.5 py-0.5 hover:bg-slate-100 disabled:opacity-30 border-l border-slate-300"
              title="Next Record"
            >
              ▶
            </button>
            <button
              disabled={filteredStudents.length === 0 || selectedIndex >= filteredStudents.length - 1}
              onClick={() => setActiveRowId(filteredStudents[filteredStudents.length - 1]?.id)}
              className="px-1.5 py-0.5 hover:bg-slate-100 disabled:opacity-30 border-l border-slate-300"
              title="Last Record"
            >
              ▶|
            </button>
          </div>
          {selectedStudentIds.length > 0 && (
            <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {selectedStudentIds.length} Selected
            </span>
          )}
          {activeFilterCount > 0 && (
            <span className="text-[11px] text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Filtered ({filteredStudents.length} records)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span>Check boxes to select multiple records for <strong>Bulk Editing</strong></span>
        </div>
      </div>
    </div>
  );
};
