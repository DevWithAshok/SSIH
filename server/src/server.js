import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './config/db.js';
import { runSeed } from './utils/seeder.js';
import { authenticate, authorizeRoles } from './middleware/auth.js';
import {
  login,
  getMe,
  getPersonas,
  updatePreferences
} from './controllers/authController.js';
import {
  getFeed,
  getDeadlines,
  getTodayDigest,
  createAnnouncement,
  toggleBookmark,
  dismissPost
} from './controllers/announcementController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure DB has data
if (db.getUsers().length === 0 || db.getAnnouncements().length === 0) {
  console.log('Database empty. Automatically populating initial seed dataset...');
  runSeed();
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SSIH — Smart Student Information Hub API',
    timestamp: new Date().toISOString()
  });
});

// Auth & Persona Routes
app.get('/api/personas', getPersonas);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticate, getMe);
app.put('/api/auth/preferences', authenticate, updatePreferences);

// Feed & Deadline Routes (Accessible anonymously or with user auth)
app.get('/api/feed', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, getFeed);

app.get('/api/deadlines', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, getDeadlines);

app.get('/api/digest/today', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, getTodayDigest);

// Announcement Creation & Actions
app.post('/api/announcements', authenticate, authorizeRoles('FACULTY', 'ADMIN', 'CLUB_LEAD'), createAnnouncement);
app.patch('/api/announcements/:id/bookmark', authenticate, toggleBookmark);
app.patch('/api/announcements/:id/dismiss', authenticate, dismissPost);

// Reset / Seed route for demo
app.post('/api/demo/reset', (req, res) => {
  runSeed();
  res.json({ message: 'Database reset to default seed state' });
});

// Production Static Serving (Vite build)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    // Only route non-API requests to React SPA
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  SSIH Smart Prioritization Server running on port ${PORT}`);
  console.log(`  Health URL: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
