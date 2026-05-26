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

import {
  FileText,
  Download,
  Heart,
  Search,
  Loader2,
  Upload,
  User,
  Calendar,
  Grid3x3,
  List,
  Bookmark,
  Eye,
} from '../lib/icons';

import axios from 'axios';

import { useAuthStore } from '../store/authStore';

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

// ===================================
// NOTE CARD
// ===================================

function NoteCard({
  note,
  onLike,
  onDownload,
  isLiked,
  isAuth,
  isBookmarked,
  onBookmark,
  viewMode,
}) {
  const isList = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl border border-slate-700/40 overflow-hidden hover:border-violet-500/30 transition h-full ${
        isList ? 'flex flex-col sm:flex-row sm:items-stretch' : 'flex flex-col'
      }`}
    >
      {note.thumbnail && (
        <div
          className={`relative overflow-hidden shrink-0 bg-slate-800/50 ${
            isList ? 'sm:w-44 md:w-52 h-40 sm:h-auto sm:min-h-[200px]' : 'h-44 w-full'
          }`}
        >
          <img
            src={note.thumbnail}
            alt={note.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-sm text-xs text-white max-w-[85%] truncate">
            {note.category}
          </div>
        </div>
      )}

      <div className={`flex flex-col flex-1 min-w-0 p-5 ${isList ? 'sm:py-5' : ''}`}>
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {note.title}
          </h3>

          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {note.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              {note.category}
            </span>
            {note.department && (
              <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                {note.department}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              {note.subject}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {note.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
          <span className="flex items-center gap-1 min-w-0">
            <User size={14} className="shrink-0" />
            <span className="truncate max-w-[120px]">{note.uploaderName}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar size={14} />
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 shrink-0">
              {isAuth ? (
                <button
                  type="button"
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
              <button
                type="button"
                onClick={() => onBookmark(note._id)}
                className={`p-1.5 rounded-lg transition ${
                  isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
                }`}
                title="Bookmark"
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
              <button
                type="button"
                onClick={() => onDownload(note)}
                className="flex-1 sm:flex-none px-3 py-2 rounded-lg border border-violet-500/40 text-violet-300 text-sm hover:bg-violet-500/10 flex items-center justify-center gap-1"
              >
                <Eye size={14} /> View
              </button>
              <button
                type="button"
                onClick={() => onDownload(note)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===================================
// NOTES LIST PAGE
// ===================================

const PAGE_META = {
  notes: {
    title: 'Notes Library',
    subtitle: 'Browse and download notes shared by the community',
  },
  study: {
    title: 'Study Materials',
    subtitle: 'PDFs, notes, and resources for your subjects',
  },
  bookmarks: {
    title: 'My Bookmarks',
    subtitle: 'Notes you saved for quick access',
  },
};

export default function NotesList({ variant = 'notes' }) {
  const { user } = useAuthStore();
  const meta = PAGE_META[variant] || PAGE_META.notes;

  const isAuth = !!user;

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('');

  const [sort, setSort] = useState('newest');

  const [likedNotes, setLikedNotes] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('gyaanmate-note-bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [viewMode, setViewMode] = useState('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(variant === 'bookmarks');

  // ===================================
  // FETCH NOTES
  // ===================================

  const fetchNotes = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search) {
        params.append('search', search);
      }

      if (category) {
        params.append('category', category);
      }

      params.append('sort', sort);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api'
        }/notes?${params}`
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

  // ===================================
  // LIKE NOTE
  // ===================================

  const handleLike = async (noteId) => {
    if (!isAuth) {
      toast.error('Please login first');

      return;
    }

    try {
      const token =
        localStorage.getItem('learnhub_token');

      await axios.patch(
        `${import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api'
        }/notes/${noteId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // ===================================
  // DOWNLOAD NOTE
  // ===================================

  // const handleDownload = async (note) => {
  //   try {
  //     await axios.patch(
  //       `${
  //         import.meta.env.VITE_API_URL ||
  //         'http://localhost:5000/api'
  //       }/notes/${note._id}/downloads`
  //     );

  //     window.open(note.file.url, '_blank');

  //     fetchNotes();
  //   } catch (err) {
  //     console.error(err);

  //     window.open(note.file.url, '_blank');
  //   }
  // };

  const handleDownload = async (note) => {
    try {
      const token = localStorage.getItem(
        'learnhub_token'
      );

      // Increment downloads
      await axios.patch(
        `${import.meta.env.VITE_API_URL ||
        'http://localhost:5000/api'
        }/notes/${note._id}/downloads`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fileUrl = note.file?.url;

      const mimeType = note.file?.mimeType;

      console.log('NOTE:', note);

      console.log('FILE URL:', fileUrl);

      console.log('MIME TYPE:', mimeType);

      // Only open PDF
      // if (
      //   mimeType === 'application/pdf' ||
      //   fileUrl?.toLowerCase().includes('.pdf')
      // ) {
      //   window.open(fileUrl, '_blank');
      // } else {
      //   toast.error(
      //     'This note does not contain a PDF file'
      //   );
      // }

      // Only download PDF
      if (
        mimeType === 'application/pdf' ||
        fileUrl?.toLowerCase().includes('.pdf')
      ) {

        const link = document.createElement('a');

        link.href = fileUrl;

        link.setAttribute(
          'download',
          `${note.title}.pdf`
        );

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

      } else {

        toast.error(
          'This note does not contain a PDF file'
        );

      }

      fetchNotes();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error(
          'Please login to download notes'
        );
      } else {
        toast.error('Failed to download file');
      }
    }
  };

  // ===================================
  // UI
  // ===================================

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('gyaanmate-note-bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  const displayedNotes = showBookmarksOnly
    ? notes.filter((n) => bookmarks.has(n._id))
    : notes;

  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold gradient-text">{meta.title}</h1>
            <p className="text-slate-400 mt-1 text-sm">{meta.subtitle}</p>
          </div>

          <a
            href="/notes/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium transition hover:opacity-90"
          >
            <Upload size={18} />
            Upload Notes
          </a>
        </div>

        {recentNotes.length > 0 && !search && !category && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Recent notes</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentNotes.map((n) => (
                <div key={n._id} className="shrink-0 glass-card p-3 w-44 border border-violet-500/10">
                  <FileText className="text-violet-400 mb-2" size={20} />
                  <p className="text-sm font-medium text-white line-clamp-2">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{n.subject}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">

          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search notes by title, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white"
          >
            <option value="">All Subjects</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-white"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Downloaded</option>
            <option value="likes">Most Liked</option>
          </select>

          <div className="flex rounded-xl border border-slate-700/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-violet-600/30 text-violet-300' : 'text-slate-400'}`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-violet-600/30 text-violet-300' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`mt-3 text-sm flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
            showBookmarksOnly ? 'border-amber-500/50 text-amber-300 bg-amber-500/10' : 'border-slate-600 text-slate-400'
          }`}
        >
          <Bookmark size={14} /> Bookmarks only
        </button>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            size={40}
            className="animate-spin text-indigo-400"
          />
        </div>
      ) : displayedNotes.length === 0 ? (
        <div className="text-center py-20">

          <FileText
            size={64}
            className="mx-auto mb-4 text-slate-600"
          />

          <h3 className="text-xl font-semibold text-white mb-2">
            No notes found
          </h3>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr items-stretch'
          : 'flex flex-col gap-4 max-w-4xl'
        }>
          {displayedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onLike={handleLike}
              onDownload={handleDownload}
              isLiked={likedNotes.has(note._id)}
              isAuth={isAuth}
              isBookmarked={bookmarks.has(note._id)}
              onBookmark={toggleBookmark}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
