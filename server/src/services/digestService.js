import { rankAnnouncements } from './rankingEngine.js';

/**
 * Generates a clean, low-stress Daily Morning Briefing
 */
export function generateDailyDigest(user, allAnnouncements, userInteractions) {
  const ranked = rankAnnouncements(allAnnouncements, user, { userInteractions });
  const now = new Date();

  // 1. Find Action Items / Deadlines due within 48h
  const upcomingDeadlines = ranked.filter(post => {
    if (!post.deadlineDate) return false;
    const deadline = new Date(post.deadlineDate);
    const diffHours = (deadline - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  });

  // 2. High-priority opportunities or official updates
  const topPriorities = ranked
    .filter(p => !upcomingDeadlines.some(d => d.id === p.id))
    .slice(0, 3);

  // 3. Greeting message based on hour
  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  if (hour >= 17) greeting = 'Good evening';

  // 4. Generate structured summary
  return {
    generatedAt: now.toISOString(),
    greeting: `${greeting}, ${user ? user.name.split(' ')[0] : 'Student'}!`,
    summaryHeadline: upcomingDeadlines.length > 0 
      ? `You have ${upcomingDeadlines.length} urgent deadline${upcomingDeadlines.length > 1 ? 's' : ''} requiring your attention today.`
      : `Your feed is clear of imminent deadlines today. Here are your top recommendations.`,
    deadlinesCount: upcomingDeadlines.length,
    urgentDeadlines: upcomingDeadlines.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      deadlineText: d.deadlineStatus?.text || 'Due soon',
      organization: d.source?.organization || 'Campus Notice',
      actionUrl: d.actionUrl
    })),
    topHighlights: topPriorities.map(p => ({
      id: p.id,
      title: p.title,
      summary: p.summary || p.content.substring(0, 120) + '...',
      category: p.category,
      priorityScore: p.priorityScore,
      organization: p.source?.organization
    })),
    totalActiveNotices: ranked.length
  };
}
