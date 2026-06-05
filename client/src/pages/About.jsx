// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Github, Globe, GraduationCap, Sparkles, Users, Target, Brain } from '../lib/icons';
import GlassCard from '../components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '../animations/motionVariants';

const features = [
  { icon: Brain, title: 'AI-Powered Learning', desc: 'Smart search and personalized recommendations.' },
  { icon: Target, title: 'Goal-Oriented Paths', desc: 'Career roadmaps tailored to your ambitions.' },
  { icon: Users, title: 'Community Driven', desc: 'Share notes and learn together.' },
  { icon: Sparkles, title: 'Premium Experience', desc: 'Modern tools designed for focus and growth.' },
];

const team = [
  {
    name: 'Debanjan Roy',
    initials: 'DR',
    role: 'Final Year B.Tech, CSE',
    college: 'Gargi Memorial Institute of Technology',
    accent: 'from-blue-500 to-indigo-600',
    border: 'border-blue-400/20',
    glow: 'shadow-blue-500/10',
    github: 'https://github.com/Debanjan-Projects',
    cv: '/cv/Debanjan-Roy.pdf',
    portfolio: 'https://www.linkedin.com/in/debanjan-roy7/',
  },
  {
    name: 'Anik Pal',
    initials: 'AP',
    role: 'Final Year B.Tech, CSE',
    college: 'Gargi Memorial Institute of Technology',
    accent: 'from-emerald-500 to-green-600',
    border: 'border-emerald-400/20',
    glow: 'shadow-emerald-500/10',
    github: 'https://github.com/the-anik-2004',
    cv: '/cv/Anik Pal Resume4online.pdf',
    portfolio: 'https://www.linkedin.com/in/the-anik-pal/',
  },
  {
    name: 'Sandipan Mondal',
    initials: 'SM',
    role: 'Final Year B.Tech, CSE',
    college: 'Gargi Memorial Institute of Technology',
    accent: 'from-teal-500 to-cyan-600',
    border: 'border-teal-400/20',
    glow: 'shadow-teal-500/10',
    github: 'https://github.com/sandipan-m18',
    cv: '/cv/sandipan-mandal.pdf',
    portfolio: 'https://www.linkedin.com/in/sandipanmondal18/',
  },
  {
    name: 'Suman Kayal',
    initials: 'SK',
    role: 'Final Year B.Tech, CSE',
    college: 'Gargi Memorial Institute of Technology',
    accent: 'from-fuchsia-500 to-pink-600',
    border: 'border-fuchsia-400/20',
    glow: 'shadow-fuchsia-500/10',
    github: 'https://github.com/SUMANKAYALS',
    cv: '/cv/Resume_SumanKayal_2026_05_04.pdf',
    portfolio: 'https://sumankayaldev.vercel.app/',
  },
  {
    name: 'Snehadwip Mondal',
    initials: 'SM',
    role: 'Final Year B.Tech, CSE',
    college: 'Gargi Memorial Institute of Technology',
    accent: 'from-orange-500 to-rose-600',
    border: 'border-orange-400/20',
    glow: 'shadow-orange-500/10',
    github: 'https://github.com/Snehadwip-Mondal18',
    cv: '/cv/Snehadwip_CV.pdf',
    portfolio: 'https://my-portfolio-orpin-sigma-72.vercel.app/',
  },
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

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Meet Our Development Team</h2>
        <p className="text-slate-400 max-w-3xl mx-auto">
          We are five passionate Computer Science Engineering students from Gargi Memorial Institute of Technology,
          collaborating to build innovative solutions that make a difference.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {team.map((m) => (
          <GlassCard key={m.name} className={`p-6 text-center border ${m.border} shadow-xl ${m.glow}`}>
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${m.accent} flex items-center justify-center text-2xl font-bold text-white mb-4`}>
              {m.initials}
            </div>
            <h3 className="text-xl font-semibold text-white">{m.name}</h3>
            <p className="text-sm text-violet-300 mt-1">{m.role}</p>
            <p className="text-sm text-slate-400 mt-1 min-h-[40px]">{m.college}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a
                href={m.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900/80 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href={m.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
              >
                <FileText size={16} />
                CV
              </a>
              <a
                href={m.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                <Globe size={16} />
                Portfolio
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="text-center">
        <Link to="/browse" className="btn-primary">Start Learning</Link>
      </div>
    </motion.div>
  );
}
