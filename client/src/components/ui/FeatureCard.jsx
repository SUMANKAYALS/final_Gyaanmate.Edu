import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../../lib/icons';

const featureList = [
  { title: "AI Note Converter", icon: "🤖", path: "/feature/note-converter", description: "Transform your notes with AI-powered conversion tools", gradient: "from-indigo-500 to-purple-500" },
  { title: "Notes Upload", icon: "📤", path: "/feature/notes-upload", description: "Upload and share your study materials with the community", gradient: "from-cyan-500 to-blue-500" },
  { title: "Study Material", icon: "📚", path: "/study", description: "Access comprehensive study resources and materials", gradient: "from-emerald-500 to-teal-500" },
  { title: "Career Roadmap", icon: "🎓", path: "/career-roadmap", description: "Plan your learning path with AI-generated career roadmaps", gradient: "from-orange-500 to-red-500" },
  { title: "Smart Video Curation", icon: "🎬", path: "/feature/video-curation", description: "AI-curated video playlists for efficient learning", gradient: "from-pink-500 to-rose-500" },
  { title: "Interactive Chat", icon: "💬", path: "/feature/interactive-chat", description: "Engage in AI-powered conversations for deeper understanding", gradient: "from-violet-500 to-purple-500" },
  { title: "Focus Assistance", icon: "🎯", path: "/feature/focus-assistance", description: "AI tools to help you stay focused and productive", gradient: "from-amber-500 to-orange-500" },
  { title: "Mock Test Generator", icon: "📋", path: "/feature/mock-test", description: "Generate personalized mock tests with AI", gradient: "from-blue-500 to-indigo-500" },
  { title: "Gamified Streaks", icon: "🔥", path: "/feature/streaks", description: "Stay motivated with gamified learning streaks", gradient: "from-red-500 to-pink-500" },
];

export default function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={feature.path}>
        <div className="group relative overflow-hidden rounded-2xl glass-card p-6 h-full">
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          {/* Glow Effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg`}
            >
              {feature.icon}
            </motion.div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              {feature.title}
            </h3>
            
            {/* Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {feature.description}
            </p>
            
            {/* CTA */}
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
              <span>Explore</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { featureList };
