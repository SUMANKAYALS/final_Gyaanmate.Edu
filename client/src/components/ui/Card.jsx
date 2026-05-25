import { motion } from 'framer-motion';

const cardVariants = {
  default: 'glass-card',
  elevated: 'glass-card hover:shadow-2xl hover:shadow-indigo-500/20',
  flat: 'bg-slate-800/50 border border-slate-700/50 rounded-xl',
  gradient: 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  ...props
}) {
  const baseClasses = cardVariants[variant];
  const hoverClasses = hover ? 'hover:scale-[1.02] cursor-pointer' : '';
  
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
