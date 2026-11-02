/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  FileText, 
  Database, 
  Settings, 
  GraduationCap, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type ModernNavSection = 'students' | 'guardians' | 'attendance' | 'reports' | 'schema' | 'settings';

interface SidebarProps {
  activeSection: ModernNavSection;
  onSelectSection: (section: ModernNavSection) => void;
  onSwitchToLegacyAccess: () => void;
  studentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onSwitchToLegacyAccess,
  studentCount,
}) => {
  const navItems = [
    {
      id: 'students' as const,
      label: 'Students',
      icon: Users,
      badge: studentCount.toString(),
      description: 'Directory, enrollment & rosters'
    },
    {
      id: 'guardians' as const,
      label: 'Guardians',
      icon: UserCheck,
      description: 'Parents & emergency caregivers'
    },
    {
      id: 'attendance' as const,
      label: 'Attendance',
      icon: CalendarCheck,
      description: 'Daily roll call & excuse records'
    },
    {
      id: 'reports' as const,
      label: 'Reports',
      icon: FileText,
      description: 'Medical alerts, emergency binders'
    },
    {
      id: 'schema' as const,
      label: 'Supabase PostgreSQL',
      icon: Database,
      badge: 'SQL DDL',
      badgeColor: 'bg-emerald-800 text-emerald-200',
      description: 'Schema DDL & view_students_extended'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      description: 'Academic calendar & config'
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none text-slate-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>Northwood OS</span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700">v2.0</span>
            </div>
            <p className="text-[11px] text-slate-400">PostgreSQL + React 19</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Academic Management
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-emerald-700 text-white' 
                    : item.badgeColor || 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legacy Access Toggle Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Modernized Legacy App</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
            Rebuilt from Microsoft Access desktop into Supabase PostgreSQL + React.
          </p>
          <button
            onClick={onSwitchToLegacyAccess}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>View Legacy Access UI</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
