/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  Mail, 
  Search, 
  Filter, 
  RotateCcw, 
  ExternalLink, 
  AlertTriangle, 
  User, 
  Phone, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Replace,
  ArrowUpDown
} from 'lucide-react';
import { supabase, localStore } from '../../lib/supabase';

export interface ExtendedStudentView {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  email_address: string;
  level: string;
  room: string;
  special_circumstances: boolean;
  special_circumstances_notes?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_postal_code?: string | null;
  full_address?: string | null;
  allergies?: string | null;
  medications?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relationship?: string | null;
  notes?: string | null;
  created_at?: string;
  primary_guardian_id?: number | null;
  primary_guardian_name?: string | null;
  primary_guardian_phone?: string | null;
  primary_guardian_email?: string | null;
  primary_guardian_relationship?: string | null;
}

interface StudentListProps {
  onNewStudent: () => void;
  onOpenEmailList: (emails: string[]) => void;
  onOpenStudentDetails: (studentId: number) => void;
  onOpenBulkEdit: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  onNewStudent,
  onOpenEmailList,
  onOpenStudentDetails,
  onOpenBulkEdit,
}) => {
  const [students, setStudents] = useState<ExtendedStudentView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search by Student Last Name (State-driven real-time filter)
  const [searchLastName, setSearchLastName] = useState<string>('');
  
  // Quick Filters
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedRoom, setSelectedRoom] = useState<string>('ALL');
  const [specialCircumstancesOnly, setSpecialCircumstancesOnly] = useState<boolean>(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof ExtendedStudentView>('last_name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  // Fetch data using Supabase JS Client
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query database view: view_students_extended
      const { data, error: supaError } = await supabase
        .from('view_students_extended')
        .select('*')
        .order('last_name', { ascending: true });

      if (supaError) {
        throw supaError;
      }

      setStudents((data as ExtendedStudentView[]) || []);
    } catch (err: any) {
      console.error('Error fetching students from Supabase:', err);
      setError(err.message || 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    // Subscribe to reactive store changes
    const unsubscribe = localStore.subscribe(() => {
      fetchStudents();
    });

    return () => unsubscribe();
  }, []);

  // Real-time filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // 1. Filter in real-time by student last name (and first name as convenience)
      if (searchLastName.trim()) {
        const query = searchLastName.trim().toLowerCase();
        const matchesLastName = student.last_name.toLowerCase().includes(query);
        const matchesFullName = student.full_name.toLowerCase().includes(query);
        const matchesStudentId = student.student_id.toLowerCase().includes(query);
        if (!matchesLastName && !matchesFullName && !matchesStudentId) {
          return false;
        }
      }

      // 2. Filter by Level
      if (selectedLevel !== 'ALL' && student.level !== selectedLevel) {
        return false;
      }

      // 3. Filter by Room
      if (selectedRoom !== 'ALL' && student.room !== selectedRoom) {
        return false;
      }

      // 4. Filter by Special Circumstances
      if (specialCircumstancesOnly && !student.special_circumstances) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortAscending ? -1 : 1;
      if (valA > valB) return sortAscending ? 1 : -1;
      return 0;
    });
  }, [students, searchLastName, selectedLevel, selectedRoom, specialCircumstancesOnly, sortField, sortAscending]);

  const levels = useMemo(() => Array.from(new Set(students.map(s => s.level))).sort(), [students]);
  const rooms = useMemo(() => Array.from(new Set(students.map(s => s.room))).sort(), [students]);

  const activeEmailList = useMemo(() => {
    return filteredStudents
      .map(s => s.email_address)
      .filter(Boolean);
  }, [filteredStudents]);

  const handleSort = (field: keyof ExtendedStudentView) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const handleClearFilters = () => {
    setSearchLastName('');
    setSelectedLevel('ALL');
    setSelectedRoom('ALL');
    setSpecialCircumstancesOnly(false);
  };

  const activeFilterCount = (selectedLevel !== 'ALL' ? 1 : 0) + (selectedRoom !== 'ALL' ? 1 : 0) + (specialCircumstancesOnly ? 1 : 0) + (searchLastName ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* 1. TOP ACTION RIBBON */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: Buttons for "➕ New Student" and "📧 E-mail List" */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* ➕ New Student Button */}
          <button
            onClick={onNewStudent}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>➕ New Student</span>
          </button>

          {/* 📧 E-mail List Button */}
          <button
            onClick={() => onOpenEmailList(activeEmailList)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>📧 E-mail List ({activeEmailList.length})</span>
          </button>

          {/* Bulk Operations Trigger */}
          <button
            onClick={onOpenBulkEdit}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all"
            title="Batch Update or Find-and-Replace across records"
          >
            <Replace className="w-3.5 h-3.5 text-amber-700" />
            <span>Bulk Edit</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Levels</option>
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Room Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Room:</span>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Rooms</option>
              {rooms.map(rm => (
                <option key={rm} value={rm}>{rm}</option>
              ))}
            </select>
          </div>

          {/* Special Circumstances Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={specialCircumstancesOnly}
              onChange={(e) => setSpecialCircumstancesOnly(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-medium">Special Circumstances</span>
          </label>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-rose-700 hover:text-rose-900 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 2. STATE-DRIVEN SEARCH BAR (Filtering in real-time by Student Last Name) */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by last name..."
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchLastName && (
            <button
              onClick={() => setSearchLastName('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 3. CLEAN, MODERN HTML TABLE (Tailwind CSS) */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
              <tr>
                {/* ID */}
                <th 
                  onClick={() => handleSort('student_id')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Name */}
                <th 
                  onClick={() => handleSort('last_name')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Email */}
                <th 
                  onClick={() => handleSort('email_address')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Email</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Level */}
                <th 
                  onClick={() => handleSort('level')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Room */}
                <th 
                  onClick={() => handleSort('room')}
                  className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Room</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Linked Guardian (Calculated via view_students_extended) */}
                <th className="px-4 py-3 font-semibold">
                  <span>Linked Guardian</span>
                </th>

                {/* Actions */}
                <th className="px-4 py-3 font-semibold text-right">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Querying Supabase PostgreSQL (view_students_extended)...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="font-medium text-slate-700">No student records found</p>
                      <p className="text-[11px] text-slate-400">
                        {searchLastName ? `No students found with last name containing "${searchLastName}"` : 'Try clearing your filter parameters'}
                      </p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={handleClearFilters}
                          className="mt-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      onClick={() => onOpenStudentDetails(student.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* ID Column */}
                      <td className="px-4 py-3 font-mono text-slate-500 tabular-nums">
                        <span className="font-semibold text-slate-700">{student.student_id}</span>
                      </td>

                      {/* Name Column */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {student.first_name} {student.last_name}
                            </div>
                            {student.special_circumstances && (
                              <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Special Circumstances (IEP)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${student.email_address}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-[200px]"
                        >
                          {student.email_address}
                        </a>
                      </td>

                      {/* Level Column */}
                      <td className="px-4 py-3 text-slate-700">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                          {student.level}
                        </span>
                      </td>

                      {/* Room Column */}
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {student.room}
                      </td>

                      {/* Linked Guardian Column (Joined from view_students_extended) */}
                      <td className="px-4 py-3">
                        {student.primary_guardian_name ? (
                          <div>
                            <div className="font-medium text-slate-900">
                              {student.primary_guardian_name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {student.primary_guardian_relationship || 'Guardian'} • {student.primary_guardian_phone || 'No phone'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None assigned</span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenStudentDetails(student.id);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1 shadow-2xs"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Table Footer Stats */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <div>
              Showing <strong className="text-slate-800 font-semibold">{filteredStudents.length}</strong> of{' '}
              <strong className="text-slate-800 font-semibold">{students.length}</strong> enrolled students
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono">view_students_extended</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Supabase JS Client Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
