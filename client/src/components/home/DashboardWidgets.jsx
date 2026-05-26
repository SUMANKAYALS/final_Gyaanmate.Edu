import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Sparkles, ClipboardList, BookOpen, Zap } from '../../lib/icons';
import GlassCard from '../ui/GlassCard';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

const widgets = [
  {
    title: 'Continue Learning',
    desc: 'Pick up where you left off',
    icon: BookOpen,
    to: '/my-courses',
    color: 'from-violet-600/20 to-indigo-600/10',
    stat: '3 courses',
  },
  {
    title: 'AI Suggestions',
    desc: 'Personalized for your goals',
    icon: Sparkles,
    to: '/ai-search',
    color: 'from-fuchsia-600/20 to-violet-600/10',
    stat: '12 ideas',
  },
  {
    title: 'Learning Progress',
    desc: 'Track your milestones',
    icon: TrendingUp,
    to: '/student/dashboard',
    color: 'from-emerald-600/20 to-teal-600/10',
    stat: '68% avg',
  },
  {
    title: 'Daily Streak',
    desc: 'Keep your momentum',
    icon: Flame,
    to: '/student/dashboard',
    color: 'from-orange-600/20 to-amber-600/10',
    stat: '7 days',
  },
  {
    title: 'Upcoming Mock Tests',
    desc: 'Practice & improve',
    icon: ClipboardList,
    to: '/browse',
    color: 'from-blue-600/20 to-cyan-600/10',
    stat: '2 scheduled',
  },
  {
    title: 'Recommended Courses',
    desc: 'Curated for you',
    icon: Zap,
    to: '/browse',
    color: 'from-purple-600/20 to-pink-600/10',
    stat: 'Top picks',
  },
];

export default function DashboardWidgets() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
    >
      {widgets.map((w) => (
        <motion.div key={w.title} variants={fadeInUp}>
          <Link to={w.to}>
            <GlassCard className={`p-5 bg-gradient-to-br ${w.color} hover:!transform-none`}>
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300">
                  <w.icon size={20} />
                </div>
                <span className="text-xs font-semibold text-violet-400">{w.stat}</span>
              </div>
              <h3 className="font-semibold text-white mt-3">{w.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{w.desc}</p>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
