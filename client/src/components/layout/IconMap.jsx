import {
  Home,
  BookOpen,
  Sparkles,
  FileText,
  GraduationCap,
  Bookmark,
  ClipboardList,
  Flame,
  Crown,
  Library,
  Info,
  Mail,
  Shield,
  Settings,
  User,
  Users,
  Menu,
  X,
  ScrollText,
  Code2,
} from '../../lib/icons';

const map = {
  Home,
  BookOpen,
  Sparkles,
  FileText,
  GraduationCap,
  Bookmark,
  ClipboardList,
  Flame,
  Crown,
  Library,
  Info,
  Mail,
  Shield,
  Settings,
  User,
  Users,
  Menu,
  X,
  ScrollText,
  Code2,
};

export function NavIcon({ name, size = 18, className = '' }) {
  const Icon = map[name] || Home;
  return <Icon size={size} className={className} />;
}
