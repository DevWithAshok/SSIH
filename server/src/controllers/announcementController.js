import { db } from '../config/db.js';
import { rankAnnouncements } from '../services/rankingEngine.js';
import { generateDailyDigest } from '../services/digestService.js';

export function getFeed(req, res) {
  const user = req.user;
  const { category, search, onlyBookmarked, onlyUrgent } = req.query;

  const allAnnouncements = db.getAnnouncements();
  const userInteractions = user ? db.getUserInteractions(user.id) : [];

  const ranked = rankAnnouncements(allAnnouncements, user, {
    category,
    search,
    onlyBookmarked: onlyBookmarked === 'true',
    onlyUrgent: onlyUrgent === 'true',
    userInteractions
  });

  res.json({
    total: ranked.length,
    announcements: ranked
  });
}

export function getDeadlines(req, res) {
  const user = req.user;
  const allAnnouncements = db.getAnnouncements();
  const userInteractions = user ? db.getUserInteractions(user.id) : [];

  const ranked = rankAnnouncements(allAnnouncements, user, { userInteractions });
  const now = new Date();

  // Filter only items with future deadlines
  const deadlines = ranked
    .filter(a => a.deadlineDate && new Date(a.deadlineDate) > now)
    .sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate));

  res.json({ deadlines });
}

export function getTodayDigest(req, res) {
  const user = req.user;
  const allAnnouncements = db.getAnnouncements();
  const userInteractions = user ? db.getUserInteractions(user.id) : [];

  const digest = generateDailyDigest(user, allAnnouncements, userInteractions);
  res.json({ digest });
}

export function createAnnouncement(req, res) {
  const {
    title,
    content,
    summary,
    category,
    tags,
    targetDepartments,
    targetYears,
    deadlineDate,
    eventDate,
    actionUrl,
    isUrgentOverride,
    sourceOrg,
    trustTier
  } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required' });
  }

  const newPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title,
    content,
    summary: summary || content.substring(0, 140) + '...',
    category,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    targetDepartments: targetDepartments || ['ALL'],
    targetYears: targetYears || [],
    deadlineDate: deadlineDate || null,
    eventDate: eventDate || null,
    actionUrl: actionUrl || null,
    isUrgentOverride: Boolean(isUrgentOverride),
    source: {
      authorId: req.user.id,
      authorName: req.user.name,
      organization: sourceOrg || (req.user.role === 'ADMIN' ? 'College Administration' : 'Department Faculty'),
      trustTier: trustTier || (req.user.role === 'ADMIN' ? 'OFFICIAL' : 'FACULTY')
    },
    createdAt: new Date().toISOString()
  };

  db.saveAnnouncement(newPost);
  res.status(201).json({ message: 'Announcement published successfully', announcement: newPost });
}

export function toggleBookmark(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const interactions = db.getUserInteractions(userId);
  const existing = interactions.find(i => i.announcementId === id) || {
    userId,
    announcementId: id,
    status: 'READ',
    isBookmarked: false,
    interactedAt: new Date().toISOString()
  };

  existing.isBookmarked = !existing.isBookmarked;
  existing.interactedAt = new Date().toISOString();

  db.saveUserInteraction(existing);
  res.json({ message: 'Bookmark updated', isBookmarked: existing.isBookmarked });
}

export function dismissPost(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const interaction = {
    userId,
    announcementId: id,
    status: 'DISMISSED',
    interactedAt: new Date().toISOString()
  };

  db.saveUserInteraction(interaction);
  res.json({ message: 'Post dismissed' });
}
