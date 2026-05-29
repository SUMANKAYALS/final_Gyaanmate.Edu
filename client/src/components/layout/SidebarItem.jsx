import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SidebarItem({
  to,
  label,
  icon,
  active,
  expanded,
  onClick,
  asButton,
}) {
  const base =
    'gyaan-sidebar-item group relative flex items-center rounded-lg transition-all duration-200';
  const layout = expanded
    ? 'gap-3 mx-2 w-[calc(100%-1rem)] px-3 py-2.5 justify-start'
    : 'mx-auto w-11 h-11 justify-center';
  const state = active
    ? expanded
      ? 'gyaan-sidebar-item--active-expanded'
      : 'gyaan-sidebar-item--active-collapsed'
    : 'text-slate-400 hover:text-white hover:bg-white/5';

  const content = (
    <>
      <span className="shrink-0 flex w-5 items-center justify-center">
        {icon}
      </span>
      {expanded && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="min-w-0 text-sm font-medium truncate text-inherit"
        >
          {label}
        </motion.span>
      )}
      {!expanded && (
        <span className="gyaan-sidebar-tooltip">{label}</span>
      )}
    </>
  );

  if (asButton) {
    return (
      <button type="button" onClick={onClick} title={expanded ? undefined : label} className={`${base} ${layout} ${state}`}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} onClick={onClick} title={expanded ? undefined : label} className={`${base} ${layout} ${state}`}>
      {content}
    </Link>
  );
}
