// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import {
//   FileText,
//   Download,
//   Heart,
//   Search,
//   Filter,
//   Loader2,
//   Upload,
//   User,
//   Calendar,
//   Tag as TagIcon,
// } from '../lib/icons';
// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

// const CATEGORIES = [
//   'Programming', 'Mathematics', 'Science', 'Engineering', 'Medical',
//   'Business', 'Arts', 'Languages', 'History', 'Geography',
//   'Psychology', 'Economics', 'Law', 'Philosophy', 'Other',
// ];

// function NoteCard({ note, onLike, onDownload, isLiked }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="glass-card rounded-2xl border border-slate-700/40 overflow-hidden hover:border-indigo-500/30 transition"
//     >
//       {note.thumbnail && (
//         <div className="relative h-48 overflow-hidden">
//           <img
//             src={note.thumbnail}
//             alt={note.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-xs text-white">
//             {note.category}
//           </div>
//         </div>
//       )}
//       <div className="p-5 space-y-4">
//         <div>
//           <h3 className="text-lg font-semibold text-white line-clamp-2">{note.title}</h3>
//           <p className="text-sm text-slate-400 mt-1 line-clamp-2">{note.description}</p>
//           <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
//             <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
//               {note.category}
//             </span>
//             {note.department && (
//               <span className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300">
//                 {note.department}
//               </span>
//             )}
//             <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
//               {note.subject}
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {note.tags?.slice(0, 3).map((tag, i) => (
//             <span
//               key={i}
//               className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>

//         <div className="flex items-center gap-4 text-xs text-slate-500">
//           <div className="flex items-center gap-1">
//             <User size={14} />
//             <span>{note.uploaderName}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Calendar size={14} />
//             <span>{new Date(note.createdAt).toLocaleDateString()}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
//           <div className="flex items-center gap-4">
//             {isAuth && (
//               <button
//                 onClick={() => onLike(note._id)}
//                 className={`flex items-center gap-1.5 text-sm transition ${
//                   isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
//                 }`}
//               >
//                 <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
//                 <span>{note.likes}</span>
//               </button>
//             )}
//             {!isAuth && (
//               <div className="flex items-center gap-1.5 text-sm text-slate-400">
//                 <Heart size={16} />
//                 <span>{note.likes}</span>
//               </div>
//             )}
//             <div className="flex items-center gap-1.5 text-sm text-slate-400">
//               <Download size={16} />
//               <span>{note.downloads}</span>
//             </div>
//           </div>
//           <button
//             onClick={() => onDownload(note)}
//             className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition flex items-center gap-2"
//           >
//             <Download size={16} />
//             Download
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default function NotesList() {
//   const { user } = useAuthStore();
//   const isAuth = !!user;
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('');
//   const [sort, setSort] = useState('newest');
//   const [likedNotes, setLikedNotes] = useState(new Set());

//   const fetchNotes = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append('search', search);
//       if (category) params.append('category', category);
//       params.append('sort', sort);

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes?${params}`
//       );
//       setNotes(response.data.notes);
//     } catch (err) {
//       toast.error('Failed to load notes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [search, category, sort]);

//   const handleLike = async (noteId) => {
//     if (!isAuth) {
//       toast.error('Please login to like notes');
//       return;
//     }
//     try {
//       const token = localStorage.getItem('learnhub_token');
//       await axios.patch(
//         `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes/${noteId}/like`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setLikedNotes((prev) => {
//         const newSet = new Set(prev);
//         if (newSet.has(noteId)) {
//           newSet.delete(noteId);
//         } else {
//           newSet.add(noteId);
//         }
//         return newSet;
//       });

//       fetchNotes();
//     } catch (err) {
//       toast.error('Failed to like note');
//     }
//   };

//   const handleDownload = async (note) => {
//     try {
//       await axios.patch(
//         `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes/${note._id}/downloads`
//       );
//       window.open(note.file.url, '_blank');
//       fetchNotes();
//     } catch (err) {
//       window.open(note.file.url, '_blank');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold gradient-text">Study Materials</h1>
//             <p className="text-slate-400 mt-1 text-sm">
//               Browse and download notes shared by the community
//             </p>
//           </div>
//           <a
//             href="/notes/upload"
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
//           >
//             <Upload size={18} />
//             Upload Notes
//           </a>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
//             />
//             <input
//               type="text"
//               placeholder="Search notes..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
//             />
//           </div>

//           <div className="flex gap-2">
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
//             >
//               <option value="">All Categories</option>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>

//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition"
//             >
//               <option value="newest">Newest</option>
//               <option value="popular">Most Downloaded</option>
//               <option value="likes">Most Liked</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 size={40} className="animate-spin text-indigo-400" />
//         </div>
//       ) : notes.length === 0 ? (
//         <div className="text-center py-20">
//           <FileText size={64} className="mx-auto mb-4 text-slate-600" />
//           <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
//           <p className="text-slate-400 mb-6">
//             {search || category ? 'Try adjusting your filters' : 'Be the first to share!'}
//           </p>
//           <a
//             href="/notes/upload"
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
//           >
//             <Upload size={18} />
//             Upload Your Notes
//           </a>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {notes.map((note) => (
//             <NoteCard
//               key={note._id}
//               note={note}
//               onLike={handleLike}
//               onDownload={handleDownload}
//               isLiked={likedNotes.has(note._id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// ===============================
// NotesList.jsx FULL FIXED CODE
// ===============================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Heart,
  Search,
  Loader2,
  Upload,
  User,
  Calendar,
  Grid,
  List,
  Filter,
  Bookmark,
} from '../lib/icons';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { staggerContainer, fadeInUp } from '../animations/motionVariants';

const CATEGORIES = [
  'Programming',
  'Mathematics',
  'Science',
  'Engineering',
  'Medical',
  'Business',
  'Arts',
  'Languages',
  'History',
  'Geography',
  'Psychology',
  'Economics',
  'Law',
  'Philosophy',
  'Other',
];

function NoteCard({ note, onLike, onDownload, isLiked, isAuth }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card hover className="overflow-hidden">
        {note.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={note.thumbnail}
              alt={note.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-xs text-white">
              {note.category}
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white line-clamp-2">{note.title}</h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{note.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                {note.category}
              </span>
              {note.department && (
                <span className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300">
                  {note.department}
                </span>
              )}
              <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                {note.subject}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {note.tags?.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{note.uploaderName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
            <div className="flex items-center gap-4">
              {isAuth ? (
                <button
                  onClick={() => onLike(note._id)}
                  className={`flex items-center gap-1.5 text-sm transition ${
                    isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{note.likes}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Heart size={16} />
                  <span>{note.likes}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Download size={16} />
                <span>{note.downloads}</span>
              </div>
            </div>
            <button
              onClick={() => onDownload(note)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function NotesList() {
  const { user } = useAuthStore();
  const isAuth = !!user;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [likedNotes, setLikedNotes] = useState(new Set());

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('sort', sort);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes?${params}`
      );
      setNotes(response.data.notes || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, category, sort]);

  const handleLike = async (noteId) => {
    if (!isAuth) {
      toast.error('Please login first');
      return;
    }
    try {
      const token = localStorage.getItem('learnhub_token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes/${noteId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikedNotes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(noteId)) {
          newSet.delete(noteId);
        } else {
          newSet.add(noteId);
        }
        return newSet;
      });

      fetchNotes();
    } catch (err) {
      console.error(err);
      toast.error('Failed to like note');
    }
  };

  const handleDownload = async (note) => {
    try {
      const token = localStorage.getItem('learnhub_token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notes/${note._id}/downloads`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileUrl = note.file?.url;
      const mimeType = note.file?.mimeType;

      if (mimeType === 'application/pdf' || fileUrl?.toLowerCase().includes('.pdf')) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', `${note.title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('This note does not contain a PDF file');
      }

      fetchNotes();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error('Please login to download notes');
      } else {
        toast.error('Failed to download file');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Study Materials</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Browse and download notes shared by the community
          </p>
        </div>
        <Link to="/notes/upload">
          <Button icon={Upload} iconPosition="right">
            Upload Notes
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white focus:outline-none focus:border-indigo-500/70"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Downloaded</option>
            <option value="likes">Most Liked</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </Card>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-indigo-400" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={64} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
          <p className="text-slate-400 mb-6">
            {search || category ? 'Try adjusting your filters' : 'Be the first to share!'}
          </p>
          <Link to="/notes/upload">
            <Button icon={Upload} iconPosition="right">
              Upload Your Notes
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onLike={handleLike}
              onDownload={handleDownload}
              isLiked={likedNotes.has(note._id)}
              isAuth={isAuth}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
