import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'instantps-dev-super-secret-key-2026';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function getPersonas(req, res) {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    yearOfStudy: u.yearOfStudy,
    interests: u.interests,
    avatar: u.avatar,
    personaLabel: u.personaLabel
  }));
  res.json({ personas: users });
}

export function login(req, res) {
  const { email, password, personaId } = req.body;

  let user;
  if (personaId) {
    user = db.getUserById(personaId);
  } else if (email) {
    user = db.getUserByEmail(email);
  }

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // If standard login with password
  if (password && user.passwordHash) {
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
  }

  const token = generateToken(user);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      interests: user.interests,
      avatar: user.avatar,
      digestPreference: user.digestPreference,
      personaLabel: user.personaLabel
    }
  });
}

export function getMe(req, res) {
  res.json({ user: req.user });
}

export function updatePreferences(req, res) {
  const { interests, department, yearOfStudy, digestPreference } = req.body;
  const user = db.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (interests !== undefined) user.interests = interests;
  if (department !== undefined) user.department = department;
  if (yearOfStudy !== undefined) user.yearOfStudy = Number(yearOfStudy);
  if (digestPreference !== undefined) {
    user.digestPreference = { ...user.digestPreference, ...digestPreference };
  }

  db.saveUser(user);
  res.json({ message: 'Preferences updated successfully', user });
}
