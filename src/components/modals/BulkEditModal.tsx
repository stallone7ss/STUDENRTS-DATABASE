/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Replace, 
  Edit3, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Code, 
  Database, 
  GraduationCap, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Student } from '../../types/database';

export interface BulkEditChange {
  studentId: number;
  studentNumber: string;
  studentName: string;
  field: keyof Student;
  oldValue: any;
  newValue: any;
}

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStudents: Student[];
  selectedStudentIds: number[];
  filteredStudentIds: number[];
  onApplyBulkUpdate: (updatedStudents: Student[], changeLogSummary: string) => void;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  allStudents,
  selectedStudentIds,
  filteredStudentIds,
  onApplyBulkUpdate,
}) => {
  // Mode: 'field_update' | 'find_replace' | 'promotion'
  const [activeMode, setActiveMode] = useState<'field_update' | 'find_replace' | 'promotion'>('field_update');

  // Target scope: 'selected' | 'filtered' | 'all'
  const initialScope = selectedStudentIds.length > 0 ? 'selected' : (filteredStudentIds.length < allStudents.length ? 'filtered' : 'all');
  const [targetScope, setTargetScope] = useState<'selected' | 'filtered' | 'all'>(initialScope);

  // Field Update State
  const [updateField, setUpdateField] = useState<keyof Student>('room');
  const [newFieldValue, setNewFieldValue] = useState<string>('Room 105');
  const [onlyIfCurrentValue, setOnlyIfCurrentValue] = useState<string>('');
  const [applyOnlyIfMatch, setApplyOnlyIfMatch] = useState<boolean>(false);

  // Find and Replace State
  const [findField, setFindField] = useState<keyof Student>('room');
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [matchWholeField, setMatchWholeField] = useState<boolean>(false);

  // Promotion State
  const [promotionOption, setPromotionOption] = useState<'advance_all' | 'set_homerooms'>('advance_all');
  const [targetHomeroomMap, setTargetHomeroomMap] = useState<Record<string, string>>({
    'Grade 9': 'Room 101',
    'Grade 10': 'Room 102',
    'Grade 11': 'Room 103',
    'Grade 12': 'Room 104',
  });

  // UI tabs
  const [showSql, setShowSql] = useState<boolean>(false);

  // Calculate target pool of students
  const targetStudents = useMemo(() => {
    if (targetScope === 'selected') {
      if (selectedStudentIds.length === 0) return allStudents;
      return allStudents.filter(s => selectedStudentIds.includes(s.id));
    }
    if (targetScope === 'filtered') {
      return allStudents.filter(s => filteredStudentIds.includes(s.id));
    }
    return allStudents;
  }, [allStudents, selectedStudentIds, filteredStudentIds, targetScope]);

  // Compute calculated changes (Diffs)
  const proposedChanges = useMemo(() => {
    const changes: BulkEditChange[] = [];

    if (activeMode === 'field_update') {
      targetStudents.forEach(st => {
        const currentVal = st[updateField];

        // Conditional check if enabled
        if (applyOnlyIfMatch && onlyIfCurrentValue.trim() !== '') {
          if (String(currentVal).toLowerCase() !== onlyIfCurrentValue.trim().toLowerCase()) {
            return;
          }
        }

        let computedNewValue: any = newFieldValue;
        if (updateField === 'specialCircumstances') {
          computedNewValue = newFieldValue === 'true';
        }

        if (currentVal !== computedNewValue) {
          changes.push({
            studentId: st.id,
            studentNumber: st.studentId,
            studentName: `${st.lastName}, ${st.firstName}`,
            field: updateField,
            oldValue: currentVal ?? '',
            newValue: computedNewValue
          });
        }
      });
    } else if (activeMode === 'find_replace') {
      if (!findText) return [];

      targetStudents.forEach(st => {
        const currentVal = String(st[findField] ?? '');
        if (!currentVal) return;

        let isMatch = false;
        let replacedVal = currentVal;

        if (matchWholeField) {
          const c = matchCase ? currentVal : currentVal.toLowerCase();
          const f = matchCase ? findText : findText.toLowerCase();
          if (c === f) {
            isMatch = true;
            replacedVal = replaceText;
          }
        } else {
          const flags = matchCase ? 'g' : 'gi';
          const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
          if (regex.test(currentVal)) {
            isMatch = true;
            replacedVal = currentVal.replace(regex, replaceText);
          }
        }

        if (isMatch && replacedVal !== currentVal) {
          changes.push({
            studentId: st.id,
            studentNumber: st.studentId,
            studentName: `${st.lastName}, ${st.firstName}`,
            field: findField,
            oldValue: currentVal,
            newValue: replacedVal
          });
        }
      });
    } else if (activeMode === 'promotion') {
      targetStudents.forEach(st => {
        let newLevel = st.level;
        if (st.level === 'Grade 9') newLevel = 'Grade 10';
        else if (st.level === 'Grade 10') newLevel = 'Grade 11';
        else if (st.level === 'Grade 11') newLevel = 'Grade 12';
        else if (st.level === 'Grade 12') newLevel = 'Alumni / Graduated';

        if (newLevel !== st.level) {
          changes.push({
            studentId: st.id,
            studentNumber: st.studentId,
            studentName: `${st.lastName}, ${st.firstName}`,
            field: 'level',
            oldValue: st.level,
            newValue: newLevel
          });
        }
      });
    }

    return changes;
  }, [
    targetStudents,
    activeMode,
    updateField,
    newFieldValue,
    applyOnlyIfMatch,
    onlyIfCurrentValue,
    findField,
    findText,
    replaceText,
    matchCase,
    matchWholeField
  ]);

  // Construct representative Access Action Query SQL
  const generatedSql = useMemo(() => {
    let sql = '';
    const tableName = '[Students]';
    let whereClause = '';

    if (targetScope === 'selected' && selectedStudentIds.length > 0) {
      whereClause = `WHERE [ID] IN (${selectedStudentIds.join(', ')})`;
    } else if (targetScope === 'filtered') {
      whereClause = `WHERE [ID] IN (${filteredStudentIds.join(', ')})`;
    }

    if (activeMode === 'field_update') {
      const fieldEscaped = `[${String(updateField).replace(/([A-Z])/g, ' $1').trim()}]`;
      const valEscaped = updateField === 'specialCircumstances' 
        ? (newFieldValue === 'true' ? 'True' : 'False') 
        : `'${newFieldValue.replace(/'/g, "''")}'`;

      let condition = whereClause;
      if (applyOnlyIfMatch && onlyIfCurrentValue) {
        condition += (condition ? ' AND ' : 'WHERE ') + `${fieldEscaped} = '${onlyIfCurrentValue.replace(/'/g, "''")}'`;
      }
      sql = `UPDATE ${tableName}\nSET ${fieldEscaped} = ${valEscaped}\n${condition};`;
    } else if (activeMode === 'find_replace') {
      const fieldEscaped = `[${String(findField).replace(/([A-Z])/g, ' $1').trim()}]`;
      sql = `UPDATE ${tableName}\nSET ${fieldEscaped} = Replace(${fieldEscaped}, '${findText.replace(/'/g, "''")}', '${replaceText.replace(/'/g, "''")}')\n${whereClause ? whereClause + ' AND ' : 'WHERE '}${fieldEscaped} LIKE '*${findText.replace(/'/g, "''")}*';`;
    } else if (activeMode === 'promotion') {
      sql = `-- Microsoft Access Grade Level Rollover Batch Query
UPDATE ${tableName} SET [Level] = 'Alumni / Graduated' WHERE [Level] = 'Grade 12';
UPDATE ${tableName} SET [Level] = 'Grade 12' WHERE [Level] = 'Grade 11';
UPDATE ${tableName} SET [Level] = 'Grade 11' WHERE [Level] = 'Grade 10';
UPDATE ${tableName} SET [Level] = 'Grade 10' WHERE [Level] = 'Grade 9';`;
    }

    return sql;
  }, [
    activeMode, 
    updateField, 
    newFieldValue, 
    applyOnlyIfMatch, 
    onlyIfCurrentValue, 
    findField, 
    findText, 
    replaceText, 
    targetScope, 
    selectedStudentIds, 
    filteredStudentIds
  ]);

  if (!isOpen) return null;

  const handleExecute = () => {
    if (proposedChanges.length === 0) {
      alert("No matching student records found to update.");
      return;
    }

    // Apply changes to students map
    const changeMap = new Map<number, Partial<Student>>();
    proposedChanges.forEach(ch => {
      const existing = changeMap.get(ch.studentId) || {};
      (existing as any)[ch.field] = ch.newValue;
      changeMap.set(ch.studentId, existing);
    });

    const updated = allStudents.map(st => {
      if (changeMap.has(st.id)) {
        return { ...st, ...changeMap.get(st.id) };
      }
      return st;
    });

    const summary = `${proposedChanges.length} field update(s) applied across ${changeMap.size} student record(s).`;
    onApplyBulkUpdate(updated, summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
        {/* Office Access Header */}
        <div className="bg-[#8b1f24] text-white px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Replace className="w-4 h-4 text-amber-300" />
            <div>
              <h1 className="font-bold text-sm">Bulk Editing & Find/Replace Utility</h1>
              <p className="text-[11px] text-red-200">
                Action Query Simulator (UPDATE [Students]) • Multi-Row Batch Processing
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-red-900 rounded text-red-100 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Scope Selection Strip */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Target Records:</span>
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5">
              <button
                onClick={() => setTargetScope('selected')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  targetScope === 'selected' ? 'bg-[#8b1f24] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selected Only ({selectedStudentIds.length})
              </button>
              <button
                onClick={() => setTargetScope('filtered')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  targetScope === 'filtered' ? 'bg-[#8b1f24] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Current Filtered ({filteredStudentIds.length})
              </button>
              <button
                onClick={() => setTargetScope('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  targetScope === 'all' ? 'bg-[#8b1f24] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Students ({allStudents.length})
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowSql(!showSql)}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-red-900 font-medium"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showSql ? 'Hide Access Action SQL' : 'View Action Query SQL'}</span>
          </button>
        </div>

        {/* SQL Viewer Drawer */}
        {showSql && (
          <div className="bg-slate-900 text-teal-300 p-3 font-mono text-[11px] border-b border-slate-800 max-h-32 overflow-auto shrink-0">
            <div className="text-[10px] text-slate-400 mb-0.5">// Microsoft Access ACE / Jet Action Query (UPDATE):</div>
            <pre className="whitespace-pre-wrap">{generatedSql}</pre>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="bg-slate-200 border-b border-slate-300 px-4 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveMode('field_update')}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
              activeMode === 'field_update'
                ? 'border-red-900 text-red-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Batch Field Update</span>
            </span>
          </button>

          <button
            onClick={() => setActiveMode('find_replace')}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
              activeMode === 'find_replace'
                ? 'border-red-900 text-red-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Replace className="w-3.5 h-3.5" />
              <span>Find & Replace in Fields</span>
            </span>
          </button>

          <button
            onClick={() => setActiveMode('promotion')}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors ${
              activeMode === 'promotion'
                ? 'border-red-900 text-red-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Year Level Promotion</span>
            </span>
          </button>
        </div>

        {/* Operations Configuration Area */}
        <div className="p-4 bg-white border-b border-slate-200 shrink-0">
          {activeMode === 'field_update' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Field to Update:
                  </label>
                  <select
                    value={updateField}
                    onChange={(e) => {
                      const f = e.target.value as keyof Student;
                      setUpdateField(f);
                      if (f === 'level') setNewFieldValue('Grade 10');
                      else if (f === 'room') setNewFieldValue('Room 102');
                      else if (f === 'specialCircumstances') setNewFieldValue('true');
                      else setNewFieldValue('');
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
                  >
                    <option value="level">Level / Grade</option>
                    <option value="room">Room / Homeroom</option>
                    <option value="specialCircumstances">Special Circumstances Flag</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="country">Country</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    New Value:
                  </label>
                  {updateField === 'level' ? (
                    <select
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    >
                      <option value="Grade 9">Grade 9 (Freshman)</option>
                      <option value="Grade 10">Grade 10 (Sophomore)</option>
                      <option value="Grade 11">Grade 11 (Junior)</option>
                      <option value="Grade 12">Grade 12 (Senior)</option>
                      <option value="Alumni / Graduated">Alumni / Graduated</option>
                    </select>
                  ) : updateField === 'room' ? (
                    <select
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                    >
                      <option value="Room 101">Room 101</option>
                      <option value="Room 102">Room 102</option>
                      <option value="Room 103">Room 103</option>
                      <option value="Room 104">Room 104</option>
                      <option value="Room 105">Room 105</option>
                      <option value="Room 106">Room 106</option>
                      <option value="Science Lab A">Science Lab A</option>
                      <option value="Library Hall">Library Hall</option>
                    </select>
                  ) : updateField === 'specialCircumstances' ? (
                    <select
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    >
                      <option value="true">True (Flagged for Accommodations/IEP)</option>
                      <option value="false">False (Standard Track)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      placeholder="Enter new value..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Conditional Filter:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="chkConditional"
                      checked={applyOnlyIfMatch}
                      onChange={(e) => setApplyOnlyIfMatch(e.target.checked)}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <label htmlFor="chkConditional" className="text-[11px] text-slate-600 cursor-pointer">
                      Only if current is:
                    </label>
                    <input
                      type="text"
                      disabled={!applyOnlyIfMatch}
                      value={onlyIfCurrentValue}
                      onChange={(e) => setOnlyIfCurrentValue(e.target.value)}
                      placeholder="e.g. Room 101"
                      className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'find_replace' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Target Column:
                  </label>
                  <select
                    value={findField}
                    onChange={(e) => setFindField(e.target.value as keyof Student)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
                  >
                    <option value="room">Room / Homeroom</option>
                    <option value="level">Level</option>
                    <option value="emailAddress">E-mail Address</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="address">Street Address</option>
                    <option value="allergies">Allergies</option>
                    <option value="medications">Medications</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Find What:
                  </label>
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="e.g. Room 101, @schoolnet.org, Seattle"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Replace With:
                  </label>
                  <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="e.g. Room 204, @academynet.org, Bellevue"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Match Options */}
              <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchCase}
                    onChange={(e) => setMatchCase(e.target.checked)}
                    className="rounded text-red-900 focus:ring-red-900"
                  />
                  <span>Match Case</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchWholeField}
                    onChange={(e) => setMatchWholeField(e.target.checked)}
                    className="rounded text-red-900 focus:ring-red-900"
                  />
                  <span>Match Entire Field Value (exact match)</span>
                </label>
              </div>
            </div>
          )}

          {activeMode === 'promotion' && (
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-950 space-y-2">
              <div className="font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Annual Student Rollover Rule:</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Advances student grade levels simultaneously across selected records:
                <br />
                <span className="font-mono font-medium">Grade 9 ➔ Grade 10</span> • <span className="font-mono font-medium">Grade 10 ➔ Grade 11</span> • <span className="font-mono font-medium">Grade 11 ➔ Grade 12</span> • <span className="font-mono font-medium">Grade 12 ➔ Alumni / Graduated</span>.
              </p>
            </div>
          )}
        </div>

        {/* Live Diff Preview Table */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs">
                Preview Modifications ({proposedChanges.length} record changes)
              </span>
              {proposedChanges.length > 0 && (
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                  Ready to Update
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              Examining {targetStudents.length} candidate students in scope
            </span>
          </div>

          <div className="border border-slate-300 rounded bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[11px]">
                <tr>
                  <th className="px-3 py-1.5 border-r border-slate-200 font-semibold">Student ID</th>
                  <th className="px-3 py-1.5 border-r border-slate-200 font-semibold">Student Name</th>
                  <th className="px-3 py-1.5 border-r border-slate-200 font-semibold">Field Name</th>
                  <th className="px-3 py-1.5 border-r border-slate-200 font-semibold text-rose-800">Current Value</th>
                  <th className="px-3 py-1.5 font-semibold text-emerald-800">New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {proposedChanges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No field modifications detected. Adjust find criteria or select a new value.
                    </td>
                  </tr>
                ) : (
                  proposedChanges.map((ch, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-1.5 border-r border-slate-100 font-mono text-slate-600">
                        {ch.studentNumber}
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-100 font-medium text-slate-900">
                        {ch.studentName}
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-100 font-mono text-[11px] text-slate-700">
                        {ch.field}
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-100 text-rose-700 line-through">
                        {String(ch.oldValue)}
                      </td>
                      <td className="px-3 py-1.5 font-bold text-emerald-700 bg-emerald-50/40">
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                          <span>{String(ch.newValue)}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            {proposedChanges.length > 0 
              ? `Action query will execute across ${proposedChanges.length} field instance(s)` 
              : 'Specify updates above to preview results'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium text-xs"
            >
              Cancel
            </button>

            <button
              onClick={handleExecute}
              disabled={proposedChanges.length === 0}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-semibold text-xs transition-colors ${
                proposedChanges.length > 0
                  ? 'bg-[#8b1f24] hover:bg-[#72191d] text-white shadow-xs cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Updates ({proposedChanges.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
