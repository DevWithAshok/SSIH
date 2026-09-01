import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  X, 
  Clock, 
  ExternalLink, 
  CalendarPlus,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DeadlineCalendarModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDeadlines();
    }
  }, [isOpen, user]);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/deadlines', { headers });
      const data = await res.json();
      if (data.deadlines) {
        setDeadlines(data.deadlines);
      }
    } catch (err) {
      console.error('Failed to fetch deadlines:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helper to generate Google Calendar Add URL
  const generateGCalUrl = (item) => {
    if (!item.deadlineDate) return '#';
    const d = new Date(item.deadlineDate);
    const end = new Date(d.getTime() + 60 * 60 * 1000);
    const formatGCalDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');
    const dates = `${formatGCalDate(d)}/${formatGCalDate(end)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.title)}&details=${encodeURIComponent(item.content)}&dates=${dates}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upcoming Deadlines Timeline</h2>
              <p className="text-xs text-slate-400">All submissions, exams & registrations in chronological order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
            <p className="text-xs text-slate-400">Loading deadline schedule...</p>
          </div>
        ) : deadlines.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No upcoming deadlines found for your active filters.
          </div>
        ) : (
          <div className="py-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            {deadlines.map((item) => {
              const dateObj = new Date(item.deadlineDate);
              const formattedDate = dateObj.toLocaleDateString(undefined, { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              });
              const formattedTime = dateObj.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });

              return (
                <div 
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Date Badge Box */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">
                        {dateObj.toLocaleDateString(undefined, { month: 'short' })}
                      </span>
                      <span className="text-base font-extrabold text-white leading-none mt-0.5">
                        {dateObj.getDate()}
                      </span>
                    </div>

                    {/* Deadline Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.deadlineStatus?.level === 'critical'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          <Clock className="w-2.5 h-2.5 inline mr-1" />
                          {item.deadlineStatus?.text} ({formattedTime})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.source?.organization}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>

                  {/* Actions: Add to Calendar & Direct Link */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={generateGCalUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4 text-purple-400" />
                    </a>

                    {item.actionUrl && (
                      <a
                        href={item.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 shadow-sm transition-all"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
