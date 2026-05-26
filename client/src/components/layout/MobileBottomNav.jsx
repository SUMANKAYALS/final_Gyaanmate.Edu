import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mobileNavLinks } from '../../config/navigation';
import { NavIcon } from './IconMap';

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname === item.to;
  };

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
      <div className="glass rounded-2xl border border-white/15 px-2 py-2 flex justify-around shadow-2xl shadow-black/30">
        {mobileNavLinks.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium transition ${
                active ? 'text-violet-400' : 'text-slate-500'
              }`}
            >
              <motion.div animate={active ? { scale: 1.1 } : { scale: 1 }}>
                <NavIcon name={item.icon} size={20} className={active ? 'text-violet-400' : ''} />
              </motion.div>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
