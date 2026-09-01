/**
 * Smart Priority Scoring Engine for InstantPS
 * 
 * Computes a dynamic PriorityScore (0 to 100) based on:
 * 1. Urgency: Time left until deadline
 * 2. Relevance: Department, Year, and Student Interest tags match
 * 3. Source Authenticity: Official vs Placement vs Club vs Peer
 * 4. Freshness: Exponential decay for older posts
 */

export function calculatePriorityScore(announcement, user) {
  const now = new Date();

  // If Admin-forced Urgent override is active
  if (announcement.isUrgentOverride) {
    return 99;
  }

  // --- 1. URGENCY SCORE (0 to 40) ---
  let urgencyScore = 0;
  if (announcement.deadlineDate) {
    const deadline = new Date(announcement.deadlineDate);
    const diffHours = (deadline - now) / (1000 * 60 * 60);

    if (diffHours > 0) {
      if (diffHours <= 12) {
        urgencyScore = 40; // Extremely critical
      } else if (diffHours <= 24) {
        urgencyScore = 35; // Closing today
      } else if (diffHours <= 48) {
        urgencyScore = 28; // Closing tomorrow
      } else if (diffHours <= 168) { // 7 days
        urgencyScore = 18;
      } else {
        urgencyScore = 8;
      }
    } else {
      // Deadline has passed
      urgencyScore = 0;
    }
  }

  // --- 2. RELEVANCE SCORE (0 to 35) ---
  let relevanceScore = 10; // baseline relevance

  if (user) {
    // Check Department Match
    const deptMatch =
      !announcement.targetDepartments ||
      announcement.targetDepartments.includes('ALL') ||
      announcement.targetDepartments.some(d => d.toLowerCase() === (user.department || '').toLowerCase());

    // Check Year Match
    const yearMatch =
      !announcement.targetYears ||
      announcement.targetYears.length === 0 ||
      announcement.targetYears.includes(user.yearOfStudy);

    if (deptMatch) relevanceScore += 10;
    if (yearMatch) relevanceScore += 5;

    // Check Interest Tags Match
    if (user.interests && Array.isArray(user.interests) && announcement.tags) {
      const userInterests = user.interests.map(i => i.toLowerCase());
      const postTags = announcement.tags.map(t => t.toLowerCase());

      const matchingTags = postTags.filter(t => userInterests.includes(t));
      if (matchingTags.length > 0) {
        relevanceScore += Math.min(10, matchingTags.length * 4);
      }
    }
  }

  // --- 3. SOURCE TRUST SCORE (0 to 25) ---
  let sourceScore = 10;
  const trustTier = announcement.source?.trustTier || 'COMMUNITY';

  switch (trustTier) {
    case 'OFFICIAL':
      sourceScore = 25;
      break;
    case 'PLACEMENT_CELL':
      sourceScore = 24;
      break;
    case 'VERIFIED_CLUB':
      sourceScore = 18;
      break;
    case 'FACULTY':
      sourceScore = 22;
      break;
    case 'COMMUNITY':
    default:
      sourceScore = 10;
      break;
  }

  // --- 4. TIME DECAY PENALTY (0 to -10) ---
  const createdDate = new Date(announcement.createdAt || now);
  const ageHours = Math.max(0, (now - createdDate) / (1000 * 60 * 60));
  const decayPenalty = Math.min(10, Math.floor(ageHours / 24) * 2);

  // --- TOTAL COMPOSITE SCORE ---
  const totalScore = Math.max(0, Math.min(100, (urgencyScore + relevanceScore + sourceScore) - decayPenalty));

  return Math.round(totalScore);
}

/**
 * Filters and ranks a list of announcements for a given student
 */
export function rankAnnouncements(announcements, user, filters = {}) {
  const { category, search, onlyBookmarked, onlyUrgent, userInteractions = [] } = filters;

  const interactionMap = new Map();
  userInteractions.forEach(i => {
    interactionMap.set(i.announcementId, i);
  });

  const now = new Date();

  // 1. Calculate Priority Scores & attach user interaction states
  let ranked = announcements.map(post => {
    const interaction = interactionMap.get(post.id) || { status: 'UNREAD', isBookmarked: false };
    const priorityScore = calculatePriorityScore(post, user);

    // Calculate human-friendly time remaining
    let deadlineStatus = null;
    if (post.deadlineDate) {
      const deadline = new Date(post.deadlineDate);
      const diffHours = (deadline - now) / (1000 * 60 * 60);

      if (diffHours < 0) {
        deadlineStatus = { text: 'Deadline Passed', isExpired: true, level: 'expired' };
      } else if (diffHours <= 12) {
        deadlineStatus = { text: `Closes in ${Math.round(diffHours)}h`, isExpired: false, level: 'critical' };
      } else if (diffHours <= 24) {
        deadlineStatus = { text: 'Due Today', isExpired: false, level: 'critical' };
      } else if (diffHours <= 48) {
        deadlineStatus = { text: 'Due Tomorrow', isExpired: false, level: 'urgent' };
      } else {
        const days = Math.ceil(diffHours / 24);
        deadlineStatus = { text: `Due in ${days} days`, isExpired: false, level: 'upcoming' };
      }
    }

    return {
      ...post,
      priorityScore,
      isBookmarked: interaction.isBookmarked || false,
      isRead: interaction.status === 'READ',
      isDismissed: interaction.status === 'DISMISSED',
      deadlineStatus
    };
  });

  // 2. Filter out dismissed notices (unless looking at archived)
  ranked = ranked.filter(post => !post.isDismissed);

  // 3. Department & Year hard filtering (hide completely non-applicable department notices if user is a student)
  if (user && user.role === 'STUDENT') {
    ranked = ranked.filter(post => {
      const deptOk =
        !post.targetDepartments ||
        post.targetDepartments.includes('ALL') ||
        post.targetDepartments.some(d => d.toLowerCase() === (user.department || '').toLowerCase());
      
      const yearOk =
        !post.targetYears ||
        post.targetYears.length === 0 ||
        post.targetYears.includes(user.yearOfStudy);

      return deptOk && yearOk;
    });
  }

  // 4. Category Filter
  if (category && category !== 'ALL') {
    if (category === 'URGENT') {
      ranked = ranked.filter(post => 
        post.isUrgentOverride || 
        (post.deadlineStatus && (post.deadlineStatus.level === 'critical' || post.deadlineStatus.level === 'urgent')) ||
        post.priorityScore >= 75
      );
    } else {
      ranked = ranked.filter(post => post.category === category);
    }
  }

  // 5. Urgent only filter flag
  if (onlyUrgent) {
    ranked = ranked.filter(post => post.priorityScore >= 70 || post.isUrgentOverride);
  }

  // 6. Bookmarked only filter
  if (onlyBookmarked) {
    ranked = ranked.filter(post => post.isBookmarked);
  }

  // 7. Search query filter
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    ranked = ranked.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(q))) ||
      (post.source?.organization && post.source.organization.toLowerCase().includes(q))
    );
  }

  // 8. Final Sort: High priority first, then freshest
  ranked.sort((a, b) => {
    // Urgent override always on top
    if (a.isUrgentOverride && !b.isUrgentOverride) return -1;
    if (!a.isUrgentOverride && b.isUrgentOverride) return 1;

    // Score comparison
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    // Tie-breaker: Newer first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return ranked;
}
