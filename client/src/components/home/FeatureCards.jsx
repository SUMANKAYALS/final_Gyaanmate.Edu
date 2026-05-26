import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from '../../lib/icons';
import { featureList } from '../../config/navigation';
import { useChat } from '../../context/ChatContext';
import { useAuthStore } from '../../store/authStore';
import { staggerContainer, fadeInUp } from '../../animations/motionVariants';

export default function FeatureCards() {
  const navigate = useNavigate();
  const { openChat } = useChat();
  const user = useAuthStore((s) => s.user);

  const handleClick = (f) => {
    if (f.auth && !user) {
      navigate('/login');
      return;
    }
    if (f.action === 'openChat') openChat();
    else navigate(f.path);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Powerful Features</h2>
        <Link to="/browse" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {featureList.map((f) => (
          <motion.div key={f.title} variants={fadeInUp}>
            <motion.button
              type="button"
              onClick={() => handleClick(f)}
              whileHover={{ y: -4 }}
              className="w-full text-left glass-card p-4 h-full flex flex-col group border border-violet-500/10 hover:border-violet-500/40"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-violet-500/20">
                <f.icon className="text-white" size={18} />
              </div>
              <h3 className="font-semibold text-white text-sm leading-snug">{f.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 flex-1">{f.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-violet-400 font-medium opacity-0 group-hover:opacity-100 transition">
                Open <ArrowRight size={12} />
              </span>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
