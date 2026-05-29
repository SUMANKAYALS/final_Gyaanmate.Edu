import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '../../lib/icons';
import GlassCard from '../ui/GlassCard';

export default function FeaturePageShell({
  title,
  subtitle,
  icon: Icon,
  children,
  badge,
  backTo = '/',
  backLabel = 'Back to home',
  backMode = 'link',
}) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(backTo);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="feature-page-shell max-w-4xl mx-auto">
      {backMode === 'history' ? (
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-300 mb-6"
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>
      ) : (
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-300 mb-6">
          <ArrowLeft size={16} /> {backLabel}
        </Link>
      )}
      <div className="flex items-start gap-4 mb-8">
        {Icon && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shrink-0">
            <Icon className="text-white" size={28} />
          </div>
        )}
        <div>
          {badge && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-2">
              {badge}
            </span>
          )}
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-2">{subtitle}</p>}
        </div>
      </div>
      <GlassCard className="p-6 md:p-8" hover={false}>
        {children}
      </GlassCard>
    </motion.div>
  );
}
