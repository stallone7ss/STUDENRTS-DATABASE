/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, Search, Bell, ShieldCheck, ExternalLink } from 'lucide-react';
import { isRealSupabaseConfigured } from '../../lib/supabase';
import { ModernNavSection } from './Sidebar';

interface HeaderProps {
  activeSection: ModernNavSection;
  onOpenSchema: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenSchema,
}) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'students':
        return 'Student Directory & Enrollment';
      case 'guardians':
        return 'Guardians & Primary Caregivers';
      case 'attendance':
        return 'Daily Attendance & Absence Tracking';
      case 'reports':
        return 'Academic & Emergency Reports';
      case 'schema':
        return 'Supabase PostgreSQL Architecture (DDL)';
      case 'settings':
        return 'Institutional Configuration & Parameters';
      default:
        return 'Academic Portal';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none">
      {/* Breadcrumb Section */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">Northwood Academy</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">{getSectionTitle()}</span>
      </div>

      {/* Status & Database Indicator */}
      <div className="flex items-center gap-3">
        {/* Supabase Connection Pill */}
        <button
          onClick={onOpenSchema}
          className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs transition-colors"
          title="Inspect PostgreSQL schema and DDL"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700">
            {isRealSupabaseConfigured ? 'Supabase Connected' : 'PostgreSQL Engine (Active)'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v15</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AD
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-900 leading-tight">Admin Registrar</div>
            <div className="text-[10px] text-slate-400">admin@schoolnet.org</div>
          </div>
        </div>
      </div>
    </header>
  );
};
