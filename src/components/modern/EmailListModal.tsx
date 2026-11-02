/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Copy, Check, X, ExternalLink, Send } from 'lucide-react';

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailAddresses: string[];
}

export const EmailListModal: React.FC<EmailListModalProps> = ({
  isOpen,
  onClose,
  emailAddresses,
}) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('Northwood Academy: Academic Announcement');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const validEmails = Array.from(new Set(emailAddresses.filter(Boolean)));
  const joinedEmails = validEmails.join(', ');

  const handleCopy = () => {
    navigator.clipboard.writeText(joinedEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoHref = `mailto:?bcc=${encodeURIComponent(joinedEmails)}&subject=${encodeURIComponent(subject)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Student E-mail Broadcast List</h2>
              <p className="text-[11px] text-slate-400">
                {validEmails.length} active recipient address(es) selected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Subject Line:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-700">
                BCC Recipient Emails ({validEmails.length}):
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy All Emails'}</span>
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-700 leading-relaxed break-all">
              {joinedEmails || 'No email addresses available.'}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Clicking <strong>"Launch Email Client"</strong> opens your default desktop or web mail application (Outlook, Apple Mail, Gmail) with all recipients pre-populated in BCC to protect student privacy.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-xs"
          >
            Close
          </button>

          <a
            href={mailtoHref}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Email Client</span>
          </a>
        </div>
      </div>
    </div>
  );
};
