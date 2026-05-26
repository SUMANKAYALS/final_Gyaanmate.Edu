import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Users, Target, Brain } from '../lib/icons';
import GlassCard from '../components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '../animations/motionVariants';

const features = [
  { icon: Brain, title: 'AI-Powered Learning', desc: 'Smart search and personalized recommendations.' },
  { icon: Target, title: 'Goal-Oriented Paths', desc: 'Career roadmaps tailored to your ambitions.' },
  { icon: Users, title: 'Community Driven', desc: 'Share notes and learn together.' },
  { icon: Sparkles, title: 'Premium Experience', desc: 'Modern tools designed for focus and growth.' },
];

const team = [
  { name: 'Snehadwip', role: 'Founder & Lead Developer' },
  { name: 'GyaanMate Team', role: 'Education & Content' },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <GraduationCap className="text-violet-400" size={32} />
          <h1 className="text-4xl font-bold gradient-text">About GyaanMate</h1>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          GyaanMate is an AI-powered EdTech platform helping learners master skills faster with intelligent tools, quality courses, and community study materials.
        </p>
      </div>

      <GlassCard className="p-8 mb-10">
        <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
        <p className="text-slate-400 leading-relaxed">
          We believe education should be accessible, engaging, and personalized. GyaanMate combines world-class course content with AI assistants, smart search, and collaborative note-sharing — so every learner can achieve more with less friction.
        </p>
      </GlassCard>

      <h2 className="text-2xl font-bold gradient-text mb-6">Why GyaanMate?</h2>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid sm:grid-cols-2 gap-4 mb-12">
        {features.map((f) => (
          <motion.div key={f.title} variants={fadeInUp}>
            <GlassCard className="p-6">
              <f.icon className="text-violet-400 mb-3" size={28} />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <h2 className="text-2xl font-bold gradient-text mb-6">Our Team</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {team.map((m) => (
          <GlassCard key={m.name} className="p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white mb-3">
              {m.name[0]}
            </div>
            <h3 className="font-semibold text-white">{m.name}</h3>
            <p className="text-sm text-violet-400">{m.role}</p>
          </GlassCard>
        ))}
      </div>

      <div className="text-center">
        <Link to="/browse" className="btn-primary">Start Learning</Link>
      </div>
    </motion.div>
  );
}
