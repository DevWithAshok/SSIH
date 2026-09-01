import React from 'react';
import { AlertCircle, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export function UrgentBanner({ deadlines = [], onSelectPost }) {
  if (!deadlines || deadlines.length === 0) {
    return null;
  }

  // Take top 2 most urgent items
  const urgentItems = deadlines.slice(0, 2);

  return (
    <div className="w-full mb-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-amber-950/30 border border-rose-500/20 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Today's Urgent Focus ({deadlines.length} Critical Dues)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Prioritized for your branch & year</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {urgentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectPost(item)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all hover:translate-y-[-1px] group"
          >
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  <Clock className="w-2.5 h-2.5" />
                  {item.deadlineStatus?.text || 'Due Soon'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {item.source?.organization || 'Campus'}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100 truncate group-hover:text-rose-200 transition-colors">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {item.actionUrl ? (
                <a
                  href={item.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div className="p-1 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-slate-700">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
