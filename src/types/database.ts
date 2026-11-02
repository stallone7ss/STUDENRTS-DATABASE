/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: number;
  studentId: string; // e.g. "STU-2024-001"
  firstName: string;
  lastName: string;
  emailAddress: string;
  level: string; // e.g. "Freshman", "Grade 9", "Sophomore", "Junior", "Senior"
  room: string; // e.g. "Room 101", "Room 204"
  specialCircumstances: boolean;
  specialCircumstancesNotes?: string;
  dob: string; // YYYY-MM-DD
  gender: 'M' | 'F' | 'Other';
  address: string;
  city: string;
  state: string;
  zipPostalCode: string;
  country: string;
  webPage?: string;
  allergies?: string;
  medications?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  notes?: string;
  photoUrl?: string;
}

export interface Guardian {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  primaryPhone: string;
  secondaryPhone?: string;
  address: string;
  city: string;
  state: string;
  zipPostalCode: string;
  country: string;
  relationshipType: string; // e.g. "Parent", "Legal Guardian", "Foster Parent"
  notes?: string;
}

export interface StudentGuardianRelation {
  id: number;
  studentId: number; // Foreign Key -> Student.id
  guardianId: number; // Foreign Key -> Guardian.id
  relationship: string; // e.g. "Mother", "Father", "Step-Mother", "Grandparent"
  primaryContact: boolean;
  pickupAuthorized: boolean;
  emergencyContact: boolean;
}

export interface StudentAttendance {
  id: number;
  studentId: number; // Foreign Key -> Student.id
  attendanceDate: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Tardy' | 'Excused';
  reason?: string;
  recordedBy: string;
}

export interface FilterSetting {
  id: number;
  filterName: string;
  filterField: string;
  filterOperator: '=' | 'LIKE' | '>' | '<' | 'IN';
  filterValue: string;
  active: boolean;
  description: string;
}

export interface SystemSetting {
  id: number;
  settingName: string;
  settingValue: string;
  category: 'School Info' | 'Academic' | 'Integrations' | 'System';
  description: string;
}

export type AccessObjectType = 'table' | 'query' | 'form' | 'report' | 'macro' | 'module';

export interface AccessObjectItem {
  id: string;
  name: string;
  type: AccessObjectType;
  category: string;
  description: string;
  badge?: string;
}

export interface OpenTab {
  id: string;
  title: string;
  type: AccessObjectType;
  targetId: string;
  params?: Record<string, any>;
}
