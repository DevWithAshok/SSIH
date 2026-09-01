import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

const passwordHash = bcrypt.hashSync('password123', 10);

const now = new Date();
const hoursFromNow = (h) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const seedUsers = [
  {
    id: 'user_cse_4th',
    name: 'Aarav Sharma',
    email: 'aarav.cse@campus.edu',
    passwordHash,
    role: 'STUDENT',
    department: 'Computer Science',
    yearOfStudy: 4,
    interests: ['placements', 'internships', 'ai-ml', 'hackathons', 'cloud-computing'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    personaLabel: 'Aarav (CSE - 4th Year / Final Year Placements)',
    digestPreference: {
      enabled: true,
      time: '08:00',
      channel: 'BOTH',
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    }
  },
  {
    id: 'user_ece_2nd',
    name: 'Diya Patel',
    email: 'diya.ece@campus.edu',
    passwordHash,
    role: 'STUDENT',
    department: 'Electronics & Communication',
    yearOfStudy: 2,
    interests: ['robotics', 'iot', 'hackathons', 'campus-clubs', 'workshops'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    personaLabel: 'Diya (ECE - 2nd Year / Clubs & Hackathons)',
    digestPreference: {
      enabled: true,
      time: '08:30',
      channel: 'IN_APP',
      quietHoursStart: '23:00',
      quietHoursEnd: '07:30'
    }
  },
  {
    id: 'user_me_1st',
    name: 'Rohan Verma',
    email: 'rohan.me@campus.edu',
    passwordHash,
    role: 'STUDENT',
    department: 'Mechanical Engineering',
    yearOfStudy: 1,
    interests: ['academics', 'sports', 'cultural-fest', 'orientation'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    personaLabel: 'Rohan (ME - 1st Year / Freshman Orientation)',
    digestPreference: {
      enabled: true,
      time: '09:00',
      channel: 'BOTH',
      quietHoursStart: '22:30',
      quietHoursEnd: '08:00'
    }
  },
  {
    id: 'user_placement_head',
    name: 'Dr. Vikram Malhotra',
    email: 'placement.cell@campus.edu',
    passwordHash,
    role: 'FACULTY',
    department: 'Training & Placement Cell',
    yearOfStudy: 0,
    interests: ['placements', 'corporate-relations'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    personaLabel: 'Dr. Vikram (Placement Cell Officer)',
    digestPreference: { enabled: false }
  },
  {
    id: 'user_admin_dean',
    name: 'Dean of Academic Affairs',
    email: 'dean.academics@campus.edu',
    passwordHash,
    role: 'ADMIN',
    department: 'Administration',
    yearOfStudy: 0,
    interests: ['administration', 'compliance'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    personaLabel: 'Dean Office (Administration / Emergency Alerts)',
    digestPreference: { enabled: false }
  }
];

export const seedAnnouncements = [
  // 1. URGENT PLACEMENT DEADLINE (< 10 hours)
  {
    id: 'post_google_swe_2026',
    title: 'Google SWE Winter Internship 2026: Application Portal Closing Today!',
    content: 'Google Early Career Recruiting team has opened applications for 2026 Summer/Winter Software Engineering Internships. Eligible: 3rd & 4th year CSE, IT, and ECE students with CGPA >= 7.5. Shortlisted candidates will be notified for Google Online Assessment (OA) within 48 hours.',
    summary: 'Google SWE Internship applications close today. Eligible: 3rd & 4th year CSE/IT/ECE with CGPA >= 7.5.',
    category: 'CAREER_INTERNSHIP',
    tags: ['placements', 'internships', 'google', 'cse', 'ece'],
    targetDepartments: ['Computer Science', 'Electronics & Communication', 'Information Technology'],
    targetYears: [3, 4],
    deadlineDate: hoursFromNow(8), // Due in 8 hours!
    actionUrl: 'https://careers.google.com/students',
    isUrgentOverride: false,
    source: {
      authorId: 'user_placement_head',
      authorName: 'Dr. Vikram Malhotra',
      organization: 'Training & Placement Cell',
      trustTier: 'PLACEMENT_CELL'
    },
    createdAt: daysAgo(1)
  },

  // 2. CRITICAL EXAM TIMETABLE
  {
    id: 'post_exam_schedule_even_sem',
    title: 'Official Final Semester End-Term Examination Schedule Published',
    content: 'The Office of the Controller of Examinations has published the final datesheet for the upcoming End-Semester Theory & Practical Examinations. Hall tickets will be released on the ERP portal starting this Friday. Please clear all pending lab records.',
    summary: 'Final End-Semester datesheet released by COE. Theory exams commence next month.',
    category: 'ACADEMIC',
    tags: ['academics', 'exams', 'schedule', 'coe'],
    targetDepartments: ['ALL'],
    targetYears: [1, 2, 3, 4],
    deadlineDate: daysFromNow(4),
    actionUrl: 'https://campus.edu/exam-portal',
    isUrgentOverride: false,
    source: {
      authorId: 'user_admin_dean',
      authorName: 'Dean of Academic Affairs',
      organization: 'Controller of Examinations',
      trustTier: 'OFFICIAL'
    },
    createdAt: daysAgo(2)
  },

  // 3. HACKATHON REGISTRATION (< 28 hours)
  {
    id: 'post_hackindia_2026',
    title: 'Smart India Hackathon (SIH) Internal Campus Qualifier: Team Submission',
    content: 'Register your 6-member teams for the internal shortlist round for SIH 2026. Cash pool of $5,000 for top 3 campus finalists with sponsored travel to the national grand finale. Must have at least 1 female team member per national guidelines.',
    summary: 'Register 6-member teams for SIH 2026 Internal Qualifier. Closing in 24 hours.',
    category: 'COMPETITION_HACKATHON',
    tags: ['hackathons', 'ai-ml', 'cloud-computing', 'robotics'],
    targetDepartments: ['ALL'],
    targetYears: [1, 2, 3, 4],
    deadlineDate: hoursFromNow(26), // Due tomorrow
    actionUrl: 'https://sih.gov.in',
    isUrgentOverride: false,
    source: {
      authorId: 'user_ece_2nd',
      authorName: 'ACM Student Chapter',
      organization: 'ACM & IEEE Student Branch',
      trustTier: 'VERIFIED_CLUB'
    },
    createdAt: daysAgo(3)
  },

  // 4. MICROSOFT ENGAGE RESUME CALL (< 18 hours)
  {
    id: 'post_msft_engage_call',
    title: 'Microsoft Accelerate Mentorship Program: Resume Submission Form',
    content: 'Mentorship and direct fast-track interview opportunity with Microsoft Redmond & India Development Center engineers. Submit your verified resume along with GitHub profile before tonight.',
    summary: 'Fast-track Microsoft mentorship and interview opportunities. Closes tonight.',
    category: 'CAREER_INTERNSHIP',
    tags: ['placements', 'internships', 'microsoft', 'cse'],
    targetDepartments: ['Computer Science', 'Information Technology'],
    targetYears: [3, 4],
    deadlineDate: hoursFromNow(16),
    actionUrl: 'https://forms.campus.edu/msft-engage',
    isUrgentOverride: false,
    source: {
      authorId: 'user_placement_head',
      authorName: 'Dr. Vikram Malhotra',
      organization: 'Training & Placement Cell',
      trustTier: 'PLACEMENT_CELL'
    },
    createdAt: daysAgo(1)
  },

  // 5. ROBOTICS WORKSHOP (ECE / Hardware)
  {
    id: 'post_ieee_robotics_workshop',
    title: 'Hands-on Autonomous Drone & ROS2 Robotics Workshop (Hardware Kit Included)',
    content: 'IEEE Robotics & Automation Society is conducting an intensive 2-day bootcamp on Robot Operating System 2 (ROS2), SLAM algorithms, and flight controllers. Kits provided during hands-on lab sessions.',
    summary: '2-day hands-on ROS2 Drone and Robotics Bootcamp. Limited to 40 seats.',
    category: 'CAMPUS_EVENT',
    tags: ['robotics', 'iot', 'workshops', 'ece'],
    targetDepartments: ['Electronics & Communication', 'Mechanical Engineering'],
    targetYears: [1, 2, 3],
    deadlineDate: daysFromNow(3),
    actionUrl: 'https://ieee.campus.edu/drone-bootcamp',
    isUrgentOverride: false,
    source: {
      authorId: 'user_ece_2nd',
      authorName: 'Robotics Club',
      organization: 'IEEE RAS Student Chapter',
      trustTier: 'VERIFIED_CLUB'
    },
    createdAt: daysAgo(2)
  },

  // 6. EMERGENCY CAMPUS ALERT (Urgent Override)
  {
    id: 'post_emergency_library_server',
    title: 'Campus Central Library & ERP Maintenance Downtime Tonight',
    content: 'Due to scheduled network switch upgrades, all online campus ERP services, WiFi access portals, and digital library resources will be unavailable from 11:30 PM to 04:30 AM tonight.',
    summary: 'Scheduled ERP & WiFi maintenance tonight between 11:30 PM - 04:30 AM.',
    category: 'ADMIN_ALERT',
    tags: ['administration', 'library', 'downtime'],
    targetDepartments: ['ALL'],
    targetYears: [1, 2, 3, 4],
    deadlineDate: null,
    isUrgentOverride: true,
    source: {
      authorId: 'user_admin_dean',
      authorName: 'Chief Technology Officer',
      organization: 'Campus IT Infrastructure',
      trustTier: 'OFFICIAL'
    },
    createdAt: hoursFromNow(-3)
  },

  // 7. FRESHMAN ORIENTATION & CLUB EXPO (1st Year)
  {
    id: 'post_freshman_club_expo',
    title: 'Annual Campus Club Induction & Cultural Extravaganza 2026',
    content: 'Explore 30+ student societies across Tech, Music, Drama, Robotics, Debate, and Motorsports at the Main Amphitheatre. Refreshments and live band performance included!',
    summary: 'Freshman Club Induction Expo this weekend at the Main Amphitheatre.',
    category: 'CAMPUS_EVENT',
    tags: ['campus-clubs', 'cultural-fest', 'orientation', 'music'],
    targetDepartments: ['ALL'],
    targetYears: [1, 2],
    deadlineDate: daysFromNow(5),
    actionUrl: 'https://clubs.campus.edu/expo',
    isUrgentOverride: false,
    source: {
      authorId: 'user_admin_dean',
      authorName: 'Student Welfare Board',
      organization: 'Dean of Student Affairs',
      trustTier: 'OFFICIAL'
    },
    createdAt: daysAgo(4)
  },

  // 8. MECHANICAL CAD COMPETITION
  {
    id: 'post_solidworks_cad_challenge',
    title: 'National Baja SAE CAD Modeling & Finite Element Analysis Challenge',
    content: 'Design an all-terrain vehicle roll cage using SolidWorks / ANSYS. Top models receive sponsorship for the SAE India National Baja Championship.',
    summary: 'Baja SAE All-Terrain CAD design challenge with national sponsorship prize.',
    category: 'COMPETITION_HACKATHON',
    tags: ['academics', 'mechanical', 'competitions'],
    targetDepartments: ['Mechanical Engineering'],
    targetYears: [2, 3, 4],
    deadlineDate: daysFromNow(6),
    actionUrl: 'https://saeindia.org/challenge',
    isUrgentOverride: false,
    source: {
      authorId: 'user_me_1st',
      authorName: 'SAE Collegiate Club',
      organization: 'SAE Student Chapter',
      trustTier: 'VERIFIED_CLUB'
    },
    createdAt: daysAgo(3)
  },

  // 9. SCHOLARSHIP DEADLINE (< 36 hours)
  {
    id: 'post_merit_cum_means_scholarship',
    title: 'Merit-Cum-Means National Higher Education Scholarship Portal Closes Soon',
    content: 'Full fee waiver opportunity for students with annual household income < $6,000 and CGPA > 8.0. Ensure income certificate and semester marksheet are uploaded.',
    summary: 'National Merit Scholarship application deadline in 36 hours.',
    category: 'ACADEMIC',
    tags: ['academics', 'scholarships', 'fees'],
    targetDepartments: ['ALL'],
    targetYears: [1, 2, 3, 4],
    deadlineDate: hoursFromNow(36),
    actionUrl: 'https://scholarships.gov.in',
    isUrgentOverride: false,
    source: {
      authorId: 'user_admin_dean',
      authorName: 'Financial Aid Office',
      organization: 'Campus Financial Aid Office',
      trustTier: 'OFFICIAL'
    },
    createdAt: daysAgo(5)
  }
];

export function runSeed() {
  console.log('Seeding InstantPS database with realistic campus data...');
  db.reset({
    users: seedUsers,
    announcements: seedAnnouncements,
    userInteractions: [],
    categories: db.getCategories()
  });
  console.log(`Successfully seeded ${seedUsers.length} users and ${seedAnnouncements.length} prioritized announcements!`);
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  runSeed();
}
