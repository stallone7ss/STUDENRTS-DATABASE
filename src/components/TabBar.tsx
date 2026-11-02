/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Table, FileText, Layers, BookOpen, Scroll, Code } from 'lucide-react';
import { OpenTab, AccessObjectType } from '../types/database';

interface TabBarProps {
  tabs: OpenTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}) => {
  const getTabIcon = (type: AccessObjectType) => {
    switch (type) {
      case 'table':
        return (
          <div className="w-3 h-3 border border-blue-700 grid grid-cols-2 grid-rows-2 bg-blue-50 shrink-0">
            <div className="border-r border-b border-blue-400"></div>
            <div className="border-b border-blue-400"></div>
            <div className="border-r border-blue-400"></div>
            <div></div>
          </div>
        );
      case 'query':
        return (
          <div className="w-3 h-3 border border-teal-700 bg-teal-50 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 border-t border-r border-teal-600"></div>
          </div>
        );
      case 'form':
        return (
          <div className="w-3 h-3 border border-pink-700 bg-pink-50 flex flex-col justify-between p-0.5 shrink-0">
            <div className="h-0.5 bg-pink-700"></div>
            <div className="h-0.5 bg-slate-300"></div>
          </div>
        );
      case 'report':
        return (
          <div className="w-3 h-3 border border-emerald-700 bg-emerald-600 rounded-[1px] flex items-center justify-center shrink-0">
            <div className="w-1.5 h-0.5 bg-white mb-0.5"></div>
          </div>
        );
      case 'macro':
        return <Scroll className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'module':
        return <Code className="w-3 h-3 text-indigo-600 shrink-0" />;
    }
  };

  return (
    <div className="flex items-center bg-slate-200 border-b border-slate-300 px-1 pt-1 overflow-x-auto text-xs select-none shrink-0 gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 border-t border-l border-r rounded-t-sm cursor-pointer transition-colors max-w-[220px] ${
              isActive
                ? 'bg-white border-slate-300 text-slate-900 font-semibold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-50 border-slate-300 text-slate-600'
            }`}
          >
            {getTabIcon(tab.type)}
            <span className="truncate text-xs">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                title="Close Tab"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
