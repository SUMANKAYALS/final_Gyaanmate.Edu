import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { EnrollmentProvider } from './context/EnrollmentContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';
import Home from './pages/public/Home';
import BrowseCourses from './pages/public/BrowseCourses';
import CourseDetails from './pages/public/CourseDetails';
import CourseCategoryPage from './pages/public/CourseCategoryPage';
import SearchResults from './pages/public/SearchResults';
import Checkout from './pages/public/Checkout';
import Subscription from './pages/public/Subscription';
import StudentDashboard from './pages/student/StudentDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import UploadCourse from './pages/instructor/UploadCourse';
import EditCourse from './pages/instructor/EditCourse';
import AdminDashboard from './pages/admin/AdminDashboard';
import MyCourses from './pages/MyCourses';
import CoursePlayer from './pages/CoursePlayer';
import Certificate from './pages/Certificate';
import Account from './pages/Account';
import Community from './pages/Community';
import NotesList from './pages/NotesList';
import NotesUpload from './pages/NotesUpload';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AISearchPage from './pages/public/AISearchPage';
import About from './pages/About';
import Contact from './pages/Contact';
import StudyMaterial from './pages/StudyMaterial';
import Bookmarks from './pages/Bookmarks';
import NoteConverter from './pages/features/NoteConverter';
import CareerRoadmap from './pages/features/CareerRoadmap';
import VideoCuration from './pages/features/VideoCuration';
import FocusAssistance from './pages/features/FocusAssistance';
import MockTestGenerator from './pages/features/MockTestGenerator';
import GamifiedStreaks from './pages/features/GamifiedStreaks';

const studentLinks = [
  { to: '/student/dashboard', label: 'Overview' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/community', label: 'Community' },
  { to: '/checkout', label: 'Checkout' },
];

const instructorLinks = [
  { to: '/instructor/dashboard', label: 'Overview' },
  { to: '/instructor/upload', label: 'Upload Course' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Overview' },
];

function LegacyAISearchRedirect() {
  const [params] = useSearchParams();
  const q = params.get('q');
  if (q) return <Navigate to={`/ai-search?q=${encodeURIComponent(q)}`} replace />;
  return <Navigate to="/ai-search" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
      <EnrollmentProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseCourses />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/ai-search" element={<AISearchPage />} />
            <Route path="/ai-search-legacy" element={<LegacyAISearchRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/category/:category" element={<CourseCategoryPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route
              path="/course/:id/learn"
              element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>}
            />
            <Route
              path="/course/:id/learn/:lessonId"
              element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>}
            />
            <Route
              path="/course/:id/certificate"
              element={<ProtectedRoute><Certificate /></ProtectedRoute>}
            />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/notes" element={<NotesList variant="notes" />} />
            <Route path="/notes/ai-converter" element={<NoteConverter />} />
            <Route path="/study-material" element={<StudyMaterial />} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/mock-tests" element={<MockTestGenerator />} />
            <Route path="/feature/note-converter" element={<NoteConverter />} />
            <Route path="/feature/career-roadmap" element={<CareerRoadmap />} />
            <Route path="/feature/video-curation" element={<VideoCuration />} />
            <Route path="/feature/focus-assistance" element={<FocusAssistance />} />
            <Route path="/feature/streaks" element={<GamifiedStreaks />} />
            <Route path="/notes/upload" element={<ProtectedRoute><NotesUpload /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<DashboardLayout title="Student" links={studentLinks} />}>
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          </Route>
          <Route element={<DashboardLayout title="Instructor" links={instructorLinks} />}>
            <Route path="/instructor/dashboard" element={<ProtectedRoute roles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/instructor/upload" element={<ProtectedRoute roles={['instructor', 'admin']}><UploadCourse /></ProtectedRoute>} />
            <Route path="/instructor/edit/:id" element={<ProtectedRoute roles={['instructor', 'admin']}><EditCourse /></ProtectedRoute>} />
          </Route>
          <Route element={<DashboardLayout title="Admin" links={adminLinks} />}>
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EnrollmentProvider>
      </AuthInitializer>
    </BrowserRouter>
  );
}
