/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_STUDENTS, INITIAL_GUARDIANS, INITIAL_STUDENTS_AND_GUARDIANS, INITIAL_ATTENDANCE } from '../data/initialData';

function getRealSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  if (typeof url !== 'string' || typeof key !== 'string') return null;
  if (url.includes('your-project-id') || url.includes('placeholder')) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return createClient(url, key);
  } catch (_e) {
    return null;
  }
}

// Safely instantiate real client only if valid URL is supplied
export const realSupabase: SupabaseClient | null = getRealSupabaseClient();
export const isRealSupabaseConfigured: boolean = realSupabase !== null;

// Local In-Memory Reactive Store (Emulating Supabase Database for instant local testing)
class LocalSupabaseStore {
  students = [...INITIAL_STUDENTS];
  guardians = [...INITIAL_GUARDIANS];
  relations = [...INITIAL_STUDENTS_AND_GUARDIANS];
  attendance = [...INITIAL_ATTENDANCE];
  listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb());
  }

  getViewStudentsExtended() {
    return this.students.map(s => {
      const rel = this.relations.find(r => r.studentId === s.id && r.primaryContact);
      const guardian = rel ? this.guardians.find(g => g.id === rel.guardianId) : null;

      const dobYear = s.dob ? new Date(s.dob).getFullYear() : 2009;
      const age = 2026 - dobYear;

      return {
        id: s.id,
        student_id: s.studentId,
        first_name: s.firstName,
        last_name: s.lastName,
        full_name: `${s.firstName} ${s.lastName}`,
        display_name: `${s.lastName}, ${s.firstName}`,
        email_address: s.emailAddress,
        level: s.level,
        room: s.room,
        special_circumstances: s.specialCircumstances,
        special_circumstances_notes: s.specialCircumstancesNotes || null,
        date_of_birth: s.dob,
        age,
        gender: s.gender,
        address: s.address,
        city: s.city,
        state: s.state,
        zip_postal_code: s.zipPostalCode,
        full_address: `${s.address}, ${s.city}, ${s.state} ${s.zipPostalCode}`,
        allergies: s.allergies || 'None',
        medications: s.medications || 'None',
        emergency_contact_name: s.emergencyContactName,
        emergency_contact_phone: s.emergencyContactPhone,
        emergency_contact_relationship: s.emergencyContactRelationship,
        notes: s.notes || null,
        photo_url: s.photoUrl || null,
        created_at: new Date().toISOString(),
        primary_guardian_id: guardian?.id || null,
        primary_guardian_name: guardian ? `${guardian.firstName} ${guardian.lastName}` : null,
        primary_guardian_phone: guardian?.primaryPhone || null,
        primary_guardian_email: guardian?.emailAddress || null,
        primary_guardian_relationship: rel?.relationship || null
      };
    });
  }

  insertStudent(studentData: any) {
    const newId = Math.max(...this.students.map(s => s.id), 0) + 1;
    const newStudent = {
      id: newId,
      studentId: studentData.student_id || `STU-2024-${100 + newId}`,
      firstName: studentData.first_name || 'New',
      lastName: studentData.last_name || 'Student',
      emailAddress: studentData.email_address || '',
      level: studentData.level || 'Grade 9',
      room: studentData.room || 'Room 101',
      specialCircumstances: Boolean(studentData.special_circumstances),
      specialCircumstancesNotes: studentData.special_circumstances_notes || '',
      dob: studentData.date_of_birth || '2010-01-01',
      gender: studentData.gender || 'M',
      address: studentData.address || '',
      city: studentData.city || '',
      state: studentData.state || 'WA',
      zipPostalCode: studentData.zip_postal_code || '',
      country: studentData.country || 'USA',
      allergies: studentData.allergies || 'None',
      medications: studentData.medications || 'None',
      emergencyContactName: studentData.emergency_contact_name || '',
      emergencyContactPhone: studentData.emergency_contact_phone || '',
      emergencyContactRelationship: studentData.emergency_contact_relationship || 'Parent',
      notes: studentData.notes || ''
    };
    this.students = [newStudent, ...this.students];
    this.notify();
    return newStudent;
  }

  updateStudent(id: number, updates: any) {
    this.students = this.students.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        firstName: updates.first_name !== undefined ? updates.first_name : s.firstName,
        lastName: updates.last_name !== undefined ? updates.last_name : s.lastName,
        emailAddress: updates.email_address !== undefined ? updates.email_address : s.emailAddress,
        level: updates.level !== undefined ? updates.level : s.level,
        room: updates.room !== undefined ? updates.room : s.room,
        specialCircumstances: updates.special_circumstances !== undefined ? updates.special_circumstances : s.specialCircumstances,
        specialCircumstancesNotes: updates.special_circumstances_notes !== undefined ? updates.special_circumstances_notes : s.specialCircumstancesNotes,
        address: updates.address !== undefined ? updates.address : s.address,
        city: updates.city !== undefined ? updates.city : s.city,
        state: updates.state !== undefined ? updates.state : s.state,
      };
    });
    this.notify();
  }

  deleteStudent(id: number) {
    this.students = this.students.filter(s => s.id !== id);
    this.relations = this.relations.filter(r => r.studentId !== id);
    this.attendance = this.attendance.filter(a => a.studentId !== id);
    this.notify();
  }
}

export const localStore = new LocalSupabaseStore();

/**
 * Unified Client API mimicking Supabase Client syntax
 */
export const supabase = {
  from(tableName: string) {
    if (isRealSupabaseConfigured && realSupabase) {
      return realSupabase.from(tableName);
    }

    // Local Supabase emulator query builder
    return {
      select(columns = '*') {
        return {
          order(column: string, { ascending = true } = {}) {
            let data: any[] = [];
            if (tableName === 'view_students_extended') {
              data = localStore.getViewStudentsExtended();
            } else if (tableName === 'students') {
              data = localStore.students;
            } else if (tableName === 'guardians') {
              data = localStore.guardians;
            } else if (tableName === 'student_attendance') {
              data = localStore.attendance;
            }

            data.sort((a, b) => {
              const valA = a[column] ?? '';
              const valB = b[column] ?? '';
              if (valA < valB) return ascending ? -1 : 1;
              if (valA > valB) return ascending ? 1 : -1;
              return 0;
            });

            return Promise.resolve({ data, error: null });
          },
          ilike(column: string, pattern: string) {
            const rawPattern = pattern.replace(/%/g, '').toLowerCase();
            const allData = tableName === 'view_students_extended' 
              ? localStore.getViewStudentsExtended()
              : localStore.students;
            
            const filtered = allData.filter((item: any) => {
              const val = String(item[column] ?? '').toLowerCase();
              return val.includes(rawPattern);
            });

            return Promise.resolve({ data: filtered, error: null });
          },
          async then(resolve: any) {
            let data: any[] = [];
            if (tableName === 'view_students_extended') {
              data = localStore.getViewStudentsExtended();
            } else if (tableName === 'students') {
              data = localStore.students;
            }
            resolve({ data, error: null });
          }
        };
      },
      async insert(records: any | any[]) {
        const toInsert = Array.isArray(records) ? records : [records];
        const inserted = toInsert.map(r => localStore.insertStudent(r));
        return { data: inserted, error: null };
      },
      update(updates: any) {
        return {
          eq(column: string, value: any) {
            if (column === 'id') {
              localStore.updateStudent(Number(value), updates);
            }
            return Promise.resolve({ data: updates, error: null });
          }
        };
      },
      delete() {
        return {
          eq(column: string, value: any) {
            if (column === 'id') {
              localStore.deleteStudent(Number(value));
            }
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    };
  }
};
