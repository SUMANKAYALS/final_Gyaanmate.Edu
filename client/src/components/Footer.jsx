import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from '../lib/icons';

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-700/50 text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-indigo-400" />
              <h3 className="text-white text-lg font-semibold">Gyaanmate</h3>
            </div>
            <p className="text-sm">
              Global AI-powered learning platform. Master any skill with intelligent course discovery powered by Google Gemini.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-indigo-300">All Courses</Link></li>
              <li><Link to="/category/programming" className="hover:text-indigo-300">Programming</Link></li>
              <li><Link to="/category/ai-machine-learning" className="hover:text-indigo-300">AI & ML</Link></li>
              <li><Link to="/category/web-development" className="hover:text-indigo-300">Web Development</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-indigo-300">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-indigo-300">Create Account</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-indigo-300">Student Dashboard</Link></li>
              <li><Link to="/instructor/dashboard" className="hover:text-indigo-300">Teach on LearnHub</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition"><Facebook size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition"><Twitter size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition"><Instagram size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition"><Linkedin size={18} /></a>
            </div>
            <p className="flex items-center gap-2 mt-4 text-sm">
              <Mail size={16} /> support@learnhub.ai
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700/50 mt-8 pt-6 flex flex-wrap justify-between text-sm">
          <p>© {new Date().getFullYear()} Gyaanmate. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-indigo-300">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-indigo-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
