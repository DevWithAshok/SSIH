import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  SlidersHorizontal, 
  PlusCircle, 
  Sparkles, 
  UserCheck, 
  ChevronDown, 
  Search,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ 
  onOpenDigest, 
  onOpenCalendar, 
  onOpenPreferences, 
  onOpenPostCreator,
  searchQuery,
  setSearchQuery,
  digestCount = 0
}) {
  const { user, personas, switchPersona } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'FACULTY';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-emerald-400/30">
            <GraduationCap className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SSIH
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Calm Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Smart Student Information Prioritizer</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices, exams, internships, hackathons..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Daily Digest Briefing Button */}
          <button
            onClick={onOpenDigest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-brand-500/40 hover:text-white transition-all shadow-sm group relative"
            title="Open Morning Digest"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400 group-hover:animate-spin" />
            <span className="hidden sm:inline">Daily Digest</span>
            {digestCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            )}
          </button>

          {/* Calendar & Deadlines */}
          <button
            onClick={onOpenCalendar}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-slate-800/80 transition-all"
            title="Deadlines Calendar"
          >
            <Calendar className="w-4 h-4 text-slate-300" />
          </button>

          {/* Preferences Button */}
          <button
            onClick={onOpenPreferences}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-slate-800/80 transition-all"
            title="My Interests & Calm Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-300" />
          </button>

          {/* Post Notice Button (for Staff / Faculty) */}
          {isStaff && (
            <button
              onClick={onOpenPostCreator}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          )}

          {/* Interactive Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-500/50"
              />
              <div className="hidden lg:block max-w-[120px] truncate">
                <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.department || user?.role}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown Menu */}
            {showPersonaMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowPersonaMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-200">Switch Demo Persona</p>
                  <p className="text-[11px] text-slate-400">See how feed ranking adapts in real time</p>
                </div>
                <div className="py-1 space-y-1">
                  {personas.map((p) => {
                    const active = user?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => switchPersona(p.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          active 
                            ? 'bg-brand-500/10 border border-brand-500/30 text-white' 
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div className="truncate">
                            <p className="text-xs font-semibold truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.personaLabel}</p>
                          </div>
                        </div>
                        {active && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
