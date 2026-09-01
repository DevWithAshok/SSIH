import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Mail, 
  CalendarDays,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DailyDigestModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDigest();
    }
  }, [isOpen, user]);

  const fetchDigest = async () => {
    try {
      setLoading(true);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/digest/today', { headers });
      const data = await res.json();
      if (data.digest) {
        setDigest(data.digest);
      }
    } catch (err) {
      console.error('Failed to fetch daily digest:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Daily Smart Digest</h2>
              <p className="text-xs text-slate-400">Calm summary of today's key priorities</p>
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
            <div className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin"></div>
            <p className="text-xs text-slate-400">Generating your personalized briefing...</p>
          </div>
        ) : digest ? (
          <div className="py-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Greeting & Headline */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/30 to-slate-900 border border-brand-500/20">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
                {digest.greeting}
              </p>
              <p className="text-sm font-medium text-slate-200">
                {digest.summaryHeadline}
              </p>
            </div>

            {/* Section 1: Urgent Deadlines */}
            {digest.urgentDeadlines && digest.urgentDeadlines.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Urgent Deadlines ({digest.urgentDeadlines.length})
                </h3>
                <div className="space-y-2">
                  {digest.urgentDeadlines.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-rose-500/20">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {item.deadlineText}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-200 mt-1">{item.title}</h4>
                      </div>
                      {item.actionUrl && (
                        <a
                          href={item.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-xs rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1 shrink-0 ml-2"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Top 3 Recommendations */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CalendarDays className="w-3.5 h-3.5 text-brand-400" />
                Curated For Your Profile
              </h3>
              <div className="space-y-2">
                {digest.topHighlights.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400">{item.organization}</span>
                      <span className="text-[10px] font-mono text-brand-400 font-bold">{item.priorityScore} pts</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Calm Promise */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                No notification spam enabled
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-950 hover:bg-white transition-all"
              >
                Done
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
