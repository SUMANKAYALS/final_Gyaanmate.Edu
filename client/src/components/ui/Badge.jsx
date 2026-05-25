import { motion } from 'framer-motion';

const badgeVariants = {
  default: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  primary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  gradient: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${badgeVariants[variant]}
        ${badgeSizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.span>
  );
}
