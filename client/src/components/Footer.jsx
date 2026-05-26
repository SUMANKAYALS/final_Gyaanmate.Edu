import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from '../lib/icons';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 text-slate-400 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <GraduationCap className="text-white" size={18} />
              </div>
              <h3 className="text-white text-lg font-semibold">GyaanMate</h3>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered learning platform. Master any skill with intelligent discovery powered by Google Gemini.
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-violet-300 transition">All Courses</Link></li>
              <li><Link to="/ai-search" className="hover:text-violet-300 transition">AI Search</Link></li>
              <li><Link to="/notes" className="hover:text-violet-300 transition">Study Materials</Link></li>
              <li><Link to="/subscription" className="hover:text-violet-300 transition">Subscription</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-violet-300 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-violet-300 transition">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-violet-300 transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-violet-300 transition">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h3>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-xl bg-slate-800/80 hover:bg-violet-600/40 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="flex items-center gap-2 mt-4 text-sm">
              <Mail size={14} className="text-violet-400" /> gyaanmate.edu@gmail.com
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-wrap justify-between text-sm gap-4">
          <p>© {new Date().getFullYear()} GyaanMate. All rights reserved.</p>
          <p className="text-slate-500">Learn Smarter. Achieve More.</p>
        </div>
      </div>
    </footer>
  );
}
