import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Copy, Hash, Plus, MessageSquare, Users, Search, BookOpen, UserPlus, Sparkles, LogOut } from '../lib/icons';
import { communityAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Chat from '../components/Chat';
import Discussions from '../components/Discussions';

export default function Community() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const res = await communityAPI.getChannels();
      const nextChannels = res.data.channels || [];
      const sharedChannelId = new URLSearchParams(window.location.search).get('channel');
      setChannels(nextChannels);

      if (sharedChannelId) {
        const sharedChannel = nextChannels.find((channel) => channel._id === sharedChannelId);
        if (sharedChannel) {
          setSelectedChannel(sharedChannel);
          return;
        }
        await loadChannel(sharedChannelId);
        return;
      }

      if (nextChannels.length > 0 && !selectedChannel) {
        setSelectedChannel(nextChannels[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChannel = async (id) => {
    try {
      const res = await communityAPI.getChannel(id);
      setSelectedChannel(res.data.channel);
    } catch (error) {
      console.error('Error loading channel:', error);
    }
  };

  const getMemberId = (member) => (typeof member === 'string' ? member : member?._id);

  const isSelectedChannelMember = useMemo(() => {
    if (!selectedChannel || !user) return false;
    const userId = user._id || user.id;
    return selectedChannel.members?.some((member) => getMemberId(member) === userId);
  }, [selectedChannel, user]);

  const selectedMemberCount = selectedChannel?.members?.length || 0;

  const getChannelInviteUrl = (channel) => {
    const url = new URL(window.location.origin);
    url.pathname = '/community';
    url.searchParams.set('channel', channel._id);
    return url.toString();
  };

  const handleJoinChannel = async () => {
    if (!selectedChannel || isSelectedChannelMember) return;
    setJoining(true);
    try {
      const res = await communityAPI.joinChannel(selectedChannel._id);
      const joinedChannel = res.data.channel;
      setSelectedChannel(joinedChannel);
      setChannels((prev) =>
        prev.map((channel) => (channel._id === joinedChannel._id ? joinedChannel : channel))
      );
      toast.success(`Joined #${joinedChannel.name}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to join this channel.';
      if (message === 'Already a member') {
        toast.success('You are already in this channel.');
        loadChannel(selectedChannel._id);
      } else {
        toast.error(message);
      }
    } finally {
      setJoining(false);
    }
  };

  const handleShareChannel = async () => {
    if (!selectedChannel) return;
    await navigator.clipboard.writeText(getChannelInviteUrl(selectedChannel));
    toast.success('Community join link copied');
  };

  const handleLeaveChannel = async () => {
    if (!selectedChannel || !isSelectedChannelMember) return;
    setLeaving(true);
    try {
      const res = await communityAPI.leaveChannel(selectedChannel._id);
      const leftChannel = res.data.channel;
      setSelectedChannel(leftChannel);
      setChannels((prev) =>
        prev.map((channel) => (channel._id === leftChannel._id ? leftChannel : channel))
      );
      setActiveTab('chat');
      toast.success(`Left #${leftChannel.name}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to leave this channel.';
      toast.error(message);
    } finally {
      setLeaving(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await communityAPI.createChannel({
        name: newChannelName,
        description: newChannelDesc,
        type: 'public',
      });
      setShowCreateModal(false);
      setNewChannelName('');
      setNewChannelDesc('');
      setChannels((prev) => [res.data.channel, ...prev]);
      setSelectedChannel(res.data.channel);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="community-page h-screen min-h-0 overflow-hidden bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="community-page h-screen min-h-0 overflow-hidden bg-slate-950 text-white flex">
      {/* Sidebar - Channel List */}
      <div className="w-80 min-h-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="mb-4 rounded-xl border border-indigo-500/20 bg-indigo-600/10 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Study circles
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">Community</h1>
            <p className="mt-1 text-sm text-slate-400">Join channels, share notes, and learn with your classmates.</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <Users className="h-4 w-4 text-indigo-300" />
              {channels.reduce((total, channel) => total + (channel.members?.length || 0), 0)} total joins
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Create Channel
            </button>
          </div>

          <div className="space-y-1">
            {filteredChannels.map((channel) => (
              <button
                key={channel._id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
                  selectedChannel?._id === channel._id
                    ? 'bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Hash className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{channel.name}</div>
                  <div className="text-xs text-slate-400 truncate">{channel.description}</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-slate-950 px-2 py-1 text-xs text-slate-400">
                  <Users className="w-3 h-3" />
                  {channel.members?.length || 0}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/my-courses"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            ← Back to My Courses
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-300">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">{selectedChannel.name}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300">
                        <Users className="h-3.5 w-3.5 text-indigo-300" />
                        {selectedMemberCount} {selectedMemberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      {selectedChannel.description || 'A focused space for questions, resources, and quick class updates.'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!isSelectedChannelMember && (
                    <button
                      onClick={handleJoinChannel}
                      disabled={joining}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                    >
                      <UserPlus className="h-4 w-4" />
                      {joining ? 'Joining...' : 'Join'}
                    </button>
                  )}
                  {isSelectedChannelMember && (
                    <button
                      onClick={handleLeaveChannel}
                      disabled={leaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {leaving ? 'Leaving...' : 'Leave'}
                    </button>
                  )}
                  <button
                    onClick={handleShareChannel}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4" />
                    Share link
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-xl transition ${
                      activeTab === 'chat'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('threads')}
                    className={`px-4 py-2 rounded-xl transition ${
                      activeTab === 'threads'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Discussions
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
              isSelectedChannelMember ? (
                <Chat channel={selectedChannel} />
              ) : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-300">
                      <UserPlus className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Join to chat</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      You need to join #{selectedChannel.name} before sending or reading channel messages.
                    </p>
                    <button
                      onClick={handleJoinChannel}
                      disabled={joining}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                    >
                      <UserPlus className="h-4 w-4" />
                      {joining ? 'Joining...' : 'Join channel'}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <Discussions channel={selectedChannel} />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Hash className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-lg mb-2">Select a channel</p>
              <p className="text-sm">Choose a channel from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Create New Channel</h3>
            <form onSubmit={handleCreateChannel}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., General, Study Group"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 resize-none"
                  rows="3"
                  placeholder="What's this channel about?"
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
