import {
  FaRobot,
  FaUpload,
  FaBook,
  FaGraduationCap,
  FaUserTie,
  FaComments,
  FaBullseye,
  FaClipboardList,
  FaFire,
  FaVideo,
} from 'react-icons/fa';

export const mainNavLinks = [
  { id: 'home', to: '/', label: 'Home', icon: 'Home', end: true },
  { id: 'courses', to: '/browse', label: 'Courses', icon: 'BookOpen' },
  { id: 'ai-search', to: '/ai-search', label: 'AI Search', icon: 'Sparkles' },
  { id: 'recommendations', to: '/recommendations', label: 'AI Recommender', icon: 'Brain' },
  { id: 'notes', to: '/notes', label: 'Notes', icon: 'FileText' },
  { id: 'my-learning', to: '/my-courses', label: 'My Learning', icon: 'GraduationCap', auth: true },
  { id: 'community', to: '/community', label: 'Community', icon: 'Users', auth: true },
  { id: 'live-session', to: '/live-session', label: 'Live Session', icon: 'Video', auth: true },
  { id: 'bookmarks', to: '/bookmarks', label: 'Bookmarks', icon: 'Bookmark', auth: true },
  { id: 'mock-tests', to: '/mock-tests', label: 'Mock Tests', icon: 'ClipboardList' },
  { id: 'streaks', to: '/feature/streaks', label: 'Streaks', icon: 'Flame' },
  { id: 'subscription', to: '/subscription', label: 'Subscription', icon: 'Crown' },
  { id: 'study-material', to: '/study-material', label: 'Study Material', icon: 'Library' },
];

/** Legal & info — primary access via sidebar (footer hidden on mobile) */
export const infoNavLinks = [
  { id: 'about', to: '/about', label: 'About', icon: 'Info' },
  { id: 'contact', to: '/contact', label: 'Contact Us', icon: 'Mail' },
  { id: 'privacy', to: '/privacy-policy', label: 'Privacy Policy', icon: 'Shield' },
  { id: 'terms', to: '/terms-of-service', label: 'Terms of Service', icon: 'ScrollText' },
];

export const footerNavLinks = [
  ...infoNavLinks,
  { id: 'settings', to: '/account', label: 'Settings', icon: 'Settings', auth: true },
];

export const mobileNavLinks = [
  { id: 'home', to: '/', label: 'Home', icon: 'Home', end: true },
  { id: 'courses', to: '/browse', label: 'Courses', icon: 'BookOpen' },
  { id: 'ai-search', to: '/ai-search', label: 'Search', icon: 'Sparkles' },
  { id: 'notes', to: '/notes', label: 'Notes', icon: 'FileText' },
  { id: 'profile', to: '/account', label: 'Profile', icon: 'User' },
];

export const featureList = [
  { title: 'Image PDF to Text PDF', icon: FaRobot, path: '/feature/note-converter', description: 'Convert scanned notes into searchable text PDFs.' },
  { title: 'Notes Upload', icon: FaUpload, path: '/notes/upload', description: 'Share study materials with the community.', auth: true },
  { title: 'Study Material', icon: FaBook, path: '/study-material', description: 'Browse PDFs and notes from top students.' },
  { title: 'Career Roadmap', icon: FaGraduationCap, path: '/feature/career-roadmap', description: 'Plan your learning path for any career.' },
  { title: 'AI Course Recommender', icon: FaRobot, path: '/recommendations', description: 'Get personalized courses and study materials from your goals.' },
  { title: 'AI Mock Interview', icon: FaUserTie, path: '/feature/mock-interview', description: 'Practice interview questions and get AI feedback.' },
  { title: 'Live Teacher Session', icon: FaVideo, path: '/live-session', description: 'Join a real-time video classroom with your instructor.', auth: true },
  { title: 'Interactive Chat', icon: FaComments, path: '#', action: 'openChat', description: 'Ask GyaanMate AI anything, anytime.' },
  { title: 'Focus Assistance', icon: FaBullseye, path: '/feature/focus-assistance', description: 'Stay on track with personalized focus tools.' },
  { title: 'Mock Test Generator', icon: FaClipboardList, path: '/mock-tests', description: 'Practice with AI-powered mock assessments.' },
  { title: 'Gamified Streaks', icon: FaFire, path: '/feature/streaks', description: 'Build daily habits and earn streak rewards.' },
];

export const popularSearches = [
  'Machine Learning',
  'Data Structures',
  'React',
  'Python',
  'Web Development',
  'Cyber Security',
];
