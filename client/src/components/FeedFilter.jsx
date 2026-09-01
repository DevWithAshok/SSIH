import React from 'react';
import { 
  LayoutGrid, 
  Flame, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  PartyPopper, 
  Bookmark,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Updates', icon: LayoutGrid },
  { id: 'URGENT', label: '🔥 Urgent', icon: Flame },
  { id: 'ACADEMIC', label: 'Academics', icon: GraduationCap },
  { id: 'CAREER_INTERNSHIP', label: 'Placements & Jobs', icon: Briefcase },
  { id: 'COMPETITION_HACKATHON', label: 'Hackathons', icon: Trophy },
  { id: 'CAMPUS_EVENT', label: 'Events & Clubs', icon: PartyPopper }
];

export function FeedFilter({ 
  activeCategory, 
  setActiveCategory, 
  onlyBookmarked, 
  setOnlyBookmarked,
  totalCount,
  userInterests = []
}) {
  return (
    <div className="mb-6 space-y-3">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id && !onlyBookmarked;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setOnlyBookmarked(false);
                setActiveCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow-md shadow-slate-100/10'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Bookmarked Filter Pill */}
        <button
          onClick={() => setOnlyBookmarked(!onlyBookmarked)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            onlyBookmarked
              ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border border-slate-800/80'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-slate-950' : ''}`} />
          <span>Saved</span>
        </button>
      </div>

      {/* Sub-bar showing active student personalized tags */}
      {userInterests.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span className="text-[11px]">Ranked for your interests:</span>
          <div className="flex flex-wrap gap-1">
            {userInterests.slice(0, 4).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-brand-300 border border-brand-500/20 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
