import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultSchema = {
  users: [],
  announcements: [],
  userInteractions: [],
  categories: [
    { id: 'ALL', name: 'All Updates', icon: 'LayoutGrid' },
    { id: 'URGENT', name: '🔥 Urgent / Due Soon', icon: 'Flame' },
    { id: 'ACADEMIC', name: '📚 Academics & Exams', icon: 'GraduationCap' },
    { id: 'CAREER_INTERNSHIP', name: '💼 Placements & Jobs', icon: 'Briefcase' },
    { id: 'COMPETITION_HACKATHON', name: '🏆 Hackathons & Contests', icon: 'Trophy' },
    { id: 'CAMPUS_EVENT', name: '🎉 Campus Events & Clubs', icon: 'PartyPopper' },
    { id: 'ADMIN_ALERT', name: '📢 Official Alerts', icon: 'AlertTriangle' }
  ]
};

// Thread-safe read/write helper
class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSchema, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.init();
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB, resetting to defaults:', err.message);
      this.write(defaultSchema);
      return defaultSchema;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing DB:', err.message);
    }
  }

  // Users
  getUsers() {
    return this.read().users || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user) {
    const data = this.read();
    const index = data.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      data.users.push(user);
    }
    this.write(data);
    return user;
  }

  // Announcements
  getAnnouncements() {
    return this.read().announcements || [];
  }

  getAnnouncementById(id) {
    return this.getAnnouncements().find(a => a.id === id);
  }

  saveAnnouncement(announcement) {
    const data = this.read();
    const index = data.announcements.findIndex(a => a.id === announcement.id);
    if (index >= 0) {
      data.announcements[index] = announcement;
    } else {
      data.announcements.unshift(announcement);
    }
    this.write(data);
    return announcement;
  }

  deleteAnnouncement(id) {
    const data = this.read();
    data.announcements = data.announcements.filter(a => a.id !== id);
    this.write(data);
  }

  // User Interactions (Bookmarks, Read status, Dismissals)
  getUserInteractions(userId) {
    const data = this.read();
    return (data.userInteractions || []).filter(i => i.userId === userId);
  }

  saveUserInteraction(interaction) {
    const data = this.read();
    data.userInteractions = data.userInteractions || [];
    const index = data.userInteractions.findIndex(
      i => i.userId === interaction.userId && i.announcementId === interaction.announcementId
    );
    if (index >= 0) {
      data.userInteractions[index] = { ...data.userInteractions[index], ...interaction };
    } else {
      data.userInteractions.push(interaction);
    }
    this.write(data);
    return interaction;
  }

  // Categories
  getCategories() {
    return this.read().categories || defaultSchema.categories;
  }

  // Full reset (for seeders)
  reset(initialData) {
    this.write(initialData || defaultSchema);
  }
}

export const db = new Database();
