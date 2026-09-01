import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  Send, 
  AlertTriangle, 
  Calendar, 
  Tag, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'ALL',
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Information Technology',
  'Civil Engineering'
];

export function PostCreatorModal({ isOpen, onClose, onPostCreated }) {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [tags, setTags] = useState('exams, schedule');
  const [targetDept, setTargetDept] = useState('ALL');
  const [targetYears, setTargetYears] = useState([1, 2, 3, 4]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [isUrgentOverride, setIsUrgentOverride] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleYearToggle = (year) => {
    if (targetYears.includes(year)) {
      setTargetYears(targetYears.filter(y => y !== year));
    } else {
      setTargetYears([...targetYears, year]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setSubmitting(true);
      const payload = {
        title,
        content,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        targetDepartments: targetDept === 'ALL' ? ['ALL'] : [targetDept],
        targetYears,
        deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : null,
        actionUrl: actionUrl || null,
        isUrgentOverride,
        sourceOrg: user?.department || 'Department Administration'
      };

      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onPostCreated();
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to post announcement:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Broadcast Campus Notice</h2>
              <p className="text-xs text-slate-400">Publish targeted update with priority metadata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-400 animate-bounce" />
            <h3 className="text-base font-bold text-white">Notice Published Successfully!</h3>
            <p className="text-xs text-slate-400">Feed ranking dynamically updated for students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Cloud Practitioner Certification Free Voucher Registration"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Category & Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="ACADEMIC">📚 Academic / Exam</option>
                  <option value="CAREER_INTERNSHIP">💼 Placement / Job</option>
                  <option value="COMPETITION_HACKATHON">🏆 Hackathon / Contest</option>
                  <option value="CAMPUS_EVENT">🎉 Campus Event / Club</option>
                  <option value="ADMIN_ALERT">📢 Administrative Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department</label>
                <select
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Study Years */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Eligible Student Batches / Years</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => handleYearToggle(y)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                      targetYears.includes(y)
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    Year {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide details, eligibility criteria, and instructions..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Deadline & Action Link Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Action / Registration URL</label>
                <input
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://forms.campus.edu/apply"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. placements, google, cloud, workshop"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Urgent Override Checkbox */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgentOverride}
                onChange={(e) => setIsUrgentOverride(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
              />
              <div>
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Mark as Emergency Campus Alert (Force Top Priority)
                </span>
                <p className="text-[10px] text-slate-400">Instantly pins to top of all relevant student dashboards.</p>
              </div>
            </label>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Broadcasting...' : 'Publish Announcement'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
