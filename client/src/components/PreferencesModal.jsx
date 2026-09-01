import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Save, 
  Moon, 
  Tag, 
  Sparkles, 
  Check,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVAILABLE_TAGS = [
  { id: 'placements', label: 'Placements & Jobs' },
  { id: 'internships', label: 'Internships' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'ai-ml', label: 'AI / Machine Learning' },
  { id: 'robotics', label: 'Robotics & Hardware' },
  { id: 'cloud-computing', label: 'Cloud & DevOps' },
  { id: 'campus-clubs', label: 'Clubs & Societies' },
  { id: 'cultural-fest', label: 'Cultural & Fests' },
  { id: 'sports', label: 'Sports & Athletics' },
  { id: 'academics', label: 'Academics & Exams' },
  { id: 'scholarships', label: 'Scholarships & Aid' }
];

export function PreferencesModal({ isOpen, onClose, onPreferencesUpdated }) {
  const { user, updatePreferences } = useAuth();
  
  const [interests, setInterests] = useState(user?.interests || []);
  const [quietStart, setQuietStart] = useState(user?.digestPreference?.quietHoursStart || '22:00');
  const [quietEnd, setQuietEnd] = useState(user?.digestPreference?.quietHoursEnd || '07:00');
  const [digestTime, setDigestTime] = useState(user?.digestPreference?.time || '08:00');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tagId) => {
    if (interests.includes(tagId)) {
      setInterests(interests.filter(t => t !== tagId));
    } else {
      setInterests([...interests, tagId]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updatePreferences({
        interests,
        digestPreference: {
          ...user?.digestPreference,
          time: digestTime,
          quietHoursStart: quietStart,
          quietHoursEnd: quietEnd
        }
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onPreferencesUpdated();
        onClose();
      }, 800);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Focus Preferences</h2>
              <p className="text-xs text-slate-400">Personalize what surfaces to the top of your feed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-400 animate-bounce" />
            <h3 className="text-base font-bold text-white">Preferences Saved!</h3>
            <p className="text-xs text-slate-400">Re-ranking your personalized feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="py-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Interest Tags Pill Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-400" />
                  Select Your Topics of Interest
                </label>
                <span className="text-[11px] text-brand-400">{interests.length} selected</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Notices matching your selected tags receive a 35% priority score boost.
              </p>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = interests.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-sm'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-brand-400" />}
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calm Quiet Hours Settings */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-slate-200">Quiet Hours (Anti-Burnout)</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                During these hours, SSIH silences all non-emergency campus alerts.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Silence From</label>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Resume At</label>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Daily Digest Delivery Schedule */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Digest Delivery Time</label>
              <input
                type="time"
                value={digestTime}
                onChange={(e) => setDigestTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
              />
            </div>

            {/* Action Buttons */}
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
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Apply & Re-Rank'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
