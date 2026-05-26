import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`glass-card ${hover ? '' : 'hover:transform-none hover:shadow-none'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
