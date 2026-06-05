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
  const [selectedThread, setSelectedThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [threadLoading, setThreadLoading] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    loadThreads();
  }, [channel, filterCategory]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      if (channel) params.channel = channel._id;

      const res = await communityAPI.getThreads(params);
      setThreads(res.data.threads || []);
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

  const handleOpenThread = async (threadId) => {
    setThreadLoading(true);
    try {
      const [threadRes, repliesRes] = await Promise.all([
        communityAPI.getThread(threadId),
        communityAPI.getReplies(threadId),
      ]);
      const nextReplies = repliesRes.data.replies || [];
      const nextThread = {
        ...threadRes.data.thread,
        replyCount: threadRes.data.thread.replyCount ?? nextReplies.length,
      };

      setSelectedThread(nextThread);
      setReplies(nextReplies);
      setThreads((prev) =>
        prev.map((thread) =>
          thread._id === threadId
            ? { ...thread, views: nextThread.views, replyCount: nextThread.replyCount }
            : thread
        )
      );
    } catch (error) {
      console.error('Error opening thread:', error);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleCreateReply = async (e) => {
    e.preventDefault();
    if (!selectedThread || !replyContent.trim()) return;

    setReplySubmitting(true);
    try {
      const res = await communityAPI.createReply(selectedThread._id, {
        content: replyContent.trim(),
      });
      const nextReplies = [res.data.reply, ...replies];
      setReplies(nextReplies);
      setReplyContent('');
      setSelectedThread((thread) =>
        thread ? { ...thread, replyCount: nextReplies.length } : thread
      );
      setThreads((prev) =>
        prev.map((thread) =>
          thread._id === selectedThread._id
            ? { ...thread, replyCount: nextReplies.length }
            : thread
        )
      );
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setReplySubmitting(false);
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
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 p-4 border-b border-slate-800 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          New Discussion
        </button>
      </div>

      <div className="community-discussions-scroll flex-1 min-h-0 overflow-y-scroll p-4">
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
                onClick={() => handleOpenThread(thread._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenThread(thread._id);
                  }
                }}
                className="bg-slate-900/80 border border-slate-700/60 rounded-md px-7 py-5 transition cursor-pointer hover:border-slate-600 hover:bg-slate-900"
              >
                <div className="flex gap-6">
                  <div className="flex min-w-8 flex-col items-center gap-2 pt-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(thread._id, 'up');
                      }}
                      className={`rounded transition hover:text-indigo-200 ${
                        thread.upvotes?.includes(user?._id) ? 'text-green-400' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" strokeWidth={1.8} />
                    </button>
                    <span className="text-sm font-semibold text-rose-300 leading-none">
                      {(thread.upvotes?.length || 0) - (thread.downvotes?.length || 0)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(thread._id, 'down');
                      }}
                      className={`rounded transition hover:text-indigo-200 ${
                        thread.downvotes?.includes(user?._id) ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      {thread.pinned && <Pin className="w-4 h-4 text-indigo-400" />}
                      {thread.isSolved && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium border ${getCategoryColor(thread.category)}`}
                      >
                        {thread.category}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-snug text-white transition hover:text-indigo-300">
                      {thread.title}
                    </h3>
                    <p className="mb-4 text-sm text-slate-300 line-clamp-2">{thread.content}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <img
                          src={thread.author?.avatar || '/default-avatar.png'}
                          alt={thread.author?.name || 'Author'}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-blue-300">{thread.author?.name || 'Community member'}</span>
                      </div>
                      <span className="text-slate-400" aria-hidden="true">•</span>
                      <span>{formatDate(thread.createdAt)}</span>
                      <span className="text-slate-400" aria-hidden="true">•</span>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" strokeWidth={1.8} />
                        <span>{thread.replyCount || 0} Replies</span>
                      </div>
                      <span className="text-slate-400" aria-hidden="true">•</span>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" strokeWidth={1.8} />
                        <span>{thread.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {threadLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-300">
            Loading discussion...
          </div>
        </div>
      )}

      {selectedThread && !threadLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="shrink-0 border-b border-slate-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(selectedThread.category)}`}>
                      {selectedThread.category}
                    </span>
                    {selectedThread.isSolved && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Solved
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedThread.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedThread(null)}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                <span>{selectedThread.author?.name || 'Community member'}</span>
                <span aria-hidden="true">/</span>
                <span>{formatDate(selectedThread.createdAt)}</span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {selectedThread.replyCount || replies.length} replies
                </span>
                <span aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedThread.views || 0} views
                </span>
              </div>
            </div>

            <div className="community-discussions-scroll min-h-0 flex-1 overflow-y-scroll p-5">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{selectedThread.content}</p>

              <form onSubmit={handleCreateReply} className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-4">
                <label className="mb-2 block text-sm font-medium text-slate-200">Add a reply</label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="h-24 w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                  placeholder="Share an answer, resource, or follow-up..."
                  required
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={replySubmitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {replySubmitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {replies.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                    No replies yet.
                  </div>
                ) : (
                  replies.map((reply) => (
                    <div key={reply._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                        <span className="font-medium text-slate-200">{reply.author?.name || 'Community member'}</span>
                        <span aria-hidden="true">/</span>
                        <span>{formatDate(reply.createdAt)}</span>
                        {reply.isAccepted && (
                          <span className="inline-flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Accepted
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{reply.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
