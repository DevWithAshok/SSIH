import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from '../components/Navbar';
import { UrgentBanner } from '../components/UrgentBanner';
import { FeedFilter } from '../components/FeedFilter';
import { PostCard } from '../components/PostCard';
import { DailyDigestModal } from '../components/DailyDigestModal';
import { DeadlineCalendarModal } from '../components/DeadlineCalendarModal';
import { PostCreatorModal } from '../components/PostCreatorModal';
import { PreferencesModal } from '../components/PreferencesModal';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Layers, 
  RotateCw, 
  ShieldCheck, 
  Inbox,
  FilterX
} from 'lucide-react';

export function Dashboard() {
  const { user, token } = useAuth();
  
  const [feed, setFeed] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [digestOpen, setDigestOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [postCreatorOpen, setPostCreatorOpen] = useState(false);

  // Fetch Feed Data
  const fetchFeedData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'ALL') params.append('category', activeCategory);
      if (onlyBookmarked) params.append('onlyBookmarked', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Parallel fetch feed and imminent deadlines
      const [feedRes, deadlinesRes] = await Promise.all([
        fetch(`/api/feed?${params.toString()}`, { headers }),
        fetch('/api/deadlines', { headers })
      ]);

      const feedData = await feedRes.json();
      const deadlinesData = await deadlinesRes.json();

      if (feedData.announcements) setFeed(feedData.announcements);
      if (deadlinesData.deadlines) setDeadlines(deadlinesData.deadlines);
    } catch (err) {
      console.error('Failed to load feed data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Trigger fetch whenever active persona, category, search, or bookmark filter changes
  useEffect(() => {
    fetchFeedData();
  }, [user, activeCategory, onlyBookmarked, searchQuery]);

  // Bookmark Toggle
  const handleToggleBookmark = async (id) => {
    if (!token) return;
    // Optimistic UI update
    setFeed(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
    try {
      await fetch(`/api/announcements/${id}/bookmark`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      fetchFeedData();
    }
  };

  // Dismiss Action
  const handleDismiss = async (id) => {
    if (!token) return;
    // Optimistic UI removal
    setFeed(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/announcements/${id}/dismiss`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to dismiss notice:', err);
    }
  };

  // Reset database for demo
  const handleResetDemo = async () => {
    setRefreshing(true);
    await fetch('/api/demo/reset', { method: 'POST' });
    fetchFeedData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenDigest={() => setDigestOpen(true)}
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenPreferences={() => setPreferencesOpen(true)}
        onOpenPostCreator={() => setPostCreatorOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        digestCount={deadlines.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Today's Focus Action Strip (Urgent Dues) */}
        {!onlyBookmarked && activeCategory === 'ALL' && !searchQuery && (
          <UrgentBanner 
            deadlines={deadlines} 
            onSelectPost={(item) => {
              // Smooth scroll to card or open calendar
              setCalendarOpen(true);
            }} 
          />
        )}

        {/* User Context & Greeting Banner */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {onlyBookmarked ? 'Saved Opportunities' : 'Personalized Student Feed'}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                {feed.length} notices
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.department ? `${user.department} • Year ${user.yearOfStudy || 1}` : 'Unified Campus Notices'} • Prioritized by urgency & relevance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchFeedData();
              }}
              className="p-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
              title="Refresh Feed"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Category & Tag Filter Bar */}
        <FeedFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onlyBookmarked={onlyBookmarked}
          setOnlyBookmarked={setOnlyBookmarked}
          totalCount={feed.length}
          userInterests={user?.interests || []}
        />

        {/* Feed List Container */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Re-calculating smart priority scores...</p>
          </div>
        ) : feed.length === 0 ? (
          <div className="py-16 text-center rounded-3xl glass-card border border-slate-800/80 p-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-3 text-slate-500">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">No announcements match this filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Your feed is nice and clear. Try clearing your search or category filters to see more.
            </p>
            {(activeCategory !== 'ALL' || onlyBookmarked || searchQuery) && (
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setOnlyBookmarked(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-all"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleBookmark={handleToggleBookmark}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SSIH • Designed for zero cognitive fatigue</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleResetDemo}
              className="text-[11px] text-slate-400 hover:text-brand-400 transition-colors"
            >
              Reset Seed Data
            </button>
            <button 
              onClick={() => setDigestOpen(true)}
              className="text-[11px] text-slate-400 hover:text-brand-400 transition-colors"
            >
              Today's Digest
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DailyDigestModal
        isOpen={digestOpen}
        onClose={() => setDigestOpen(false)}
      />

      <DeadlineCalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />

      <PreferencesModal
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        onPreferencesUpdated={fetchFeedData}
      />

      <PostCreatorModal
        isOpen={postCreatorOpen}
        onClose={() => setPostCreatorOpen(false)}
        onPostCreated={fetchFeedData}
      />

    </div>
  );
}
