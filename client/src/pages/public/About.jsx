import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Sparkles, Target, Heart } from '../../lib/icons';
import Card from '../../components/ui/Card';
import { fadeInUp } from '../../animations/motionVariants';

export default function About() {
  const stats = [
    { value: '50K+', label: 'Active Learners', icon: Users },
    { value: '1,200+', label: 'Courses Available', icon: BookOpen },
    { value: '98%', label: 'Satisfaction Rate', icon: Heart },
    { value: '24/7', label: 'Learning Support', icon: Sparkles },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: 'AI-Powered Learning',
      description: 'Personalized course recommendations and intelligent learning paths powered by cutting-edge AI technology.',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators who bring real-world expertise to every lesson.',
    },
    {
      icon: Target,
      title: 'Goal-Oriented Approach',
      description: 'Set clear learning goals, track your progress, and achieve milestones with our structured curriculum system.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
          <Sparkles size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300 font-medium">About GyaanMate</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-white">Empowering Your</span>
          <br />
          <span className="gradient-text">Learning Journey</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          GyaanMate is an AI-powered EdTech platform designed to make learning accessible, engaging, and effective for everyone.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.label} variants={fadeInUp}>
            <Card className="p-6 text-center">
              <stat.icon size={32} className="mx-auto mb-4 text-indigo-400" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission */}
      <Card className="p-8 mb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              At GyaanMate, we believe that quality education should be accessible to everyone. Our mission is to democratize learning by providing world-class courses, personalized AI recommendations, and a supportive community that helps learners achieve their goals.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We combine cutting-edge technology with proven pedagogical methods to create an immersive learning experience that adapts to your unique needs and learning style.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
              <GraduationCap size={120} className="text-indigo-400/50" />
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold gradient-text mb-8 text-center">Why Choose GyaanMate?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story */}
      <Card className="p-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">Our Story</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          GyaanMate was founded with a simple yet powerful vision: to make learning smarter and more accessible. We recognized that traditional education often fails to adapt to individual learning needs, leaving many learners behind.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          By leveraging artificial intelligence and modern web technologies, we've built a platform that understands your learning goals, recommends the right courses, and provides the support you need to succeed.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Today, GyaanMate serves thousands of learners worldwide, helping them acquire new skills, advance their careers, and achieve their dreams through quality education.
        </p>
      </Card>
    </div>
  );
}
