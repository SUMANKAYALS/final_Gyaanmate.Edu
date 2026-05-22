import { useEffect, useState } from 'react';
import { Plus, ThumbsUp, ThumbsDown, MessageSquare, Eye, Pin, CheckCircle2, Filter } from '../lib/icons';
import { communityAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Discussions({ channel }) {
  const user = useAuthStore((s) => s.user);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('discussion');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadThreads();
  }, [channel, filterCategory]);

  const loadThreads = async () => {
    try {
      const params = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (channel) params.channel = channel._id;
      
      const res = await communityAPI.getThreads(params);
      setThreads(res.data.threads);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      await communityAPI.createThread({
        title: newThreadTitle,
        content: newThreadContent,
        category: newThreadCategory,
        channel: channel?._id,
      });
      setShowCreateModal(false);
      setNewThreadTitle('');
      setNewThreadContent('');
      setNewThreadCategory('discussion');
      loadThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleVote = async (threadId, vote) => {
    try {
      await communityAPI.voteThread(threadId, { vote });
      loadThreads();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      question: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      discussion: 'bg-green-600/20 text-green-400 border-green-600/30',
      announcement: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      resource: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
      showcase: 'bg-pink-600/20 text-pink-400 border-pink-600/30',
    };
    return colors[category] || colors.discussion;
  };

  const formatDate = (date) => {
    const now = new Date();
    const threadDate = new Date(date);
    const diff = now - threadDate;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return threadDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Loading discussions...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Discussions</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="question">Questions</option>
              <option value="discussion">Discussions</option>
              <option value="announcement">Announcements</option>
              <option value="resource">Resources</option>
              <option value="showcase">Showcase</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          New Discussion
        </button>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto p-4">
        {threads.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-lg mb-2">No discussions yet</p>
              <p className="text-sm">Start a discussion to get the conversation going!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <div
                key={thread._id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <button
                      onClick={() => handleVote(thread._id, 'up')}
                      className={`p-1 rounded hover:bg-slate-700 transition ${
                        thread.upvotes?.includes(user?._id) ? 'text-green-400' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-sm">{thread.upvotes?.length - thread.downvotes?.length}</span>
                    <button
                      onClick={() => handleVote(thread._id, 'down')}
                      className={`p-1 rounded hover:bg-slate-700 transition ${
                        thread.downvotes?.includes(user?._id) ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.pinned && <Pin className="w-4 h-4 text-indigo-400" />}
                      {thread.isSolved && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(thread.category)}`}
                      >
                        {thread.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 hover:text-indigo-400 transition">
                      {thread.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={thread.author?.avatar || '/default-avatar.png'}
                          alt={thread.author?.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{thread.author?.name}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(thread.createdAt)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Replies</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{thread.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Discussion</h3>
            <form onSubmit={handleCreateThread}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  placeholder="What's your discussion about?"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newThreadCategory}
                  onChange={(e) => setNewThreadCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="question">Question</option>
                  <option value="discussion">Discussion</option>
                  <option value="announcement">Announcement</option>
                  <option value="resource">Resource</option>
                  <option value="showcase">Showcase</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                  rows="6"
                  placeholder="Share your thoughts, questions, or resources..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Create Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
