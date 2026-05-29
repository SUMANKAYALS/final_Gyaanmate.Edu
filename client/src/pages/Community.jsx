import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Hash, Plus, MessageSquare, Users, Search, BookOpen } from '../lib/icons';
import { communityAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Chat from '../components/Chat';
import Discussions from '../components/Discussions';

export default function Community() {
  const { channelId } = useParams();
  const user = useAuthStore((s) => s.user);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (channelId) {
      loadChannel(channelId);
    }
  }, [channelId]);

  const loadChannels = async () => {
    try {
      const res = await communityAPI.getChannels();
      setChannels(res.data.channels);
      if (res.data.channels.length > 0 && !selectedChannel) {
        setSelectedChannel(res.data.channels[0]);
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

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      await communityAPI.createChannel({
        name: newChannelName,
        description: newChannelDesc,
        type: 'public',
      });
      setShowCreateModal(false);
      setNewChannelName('');
      setNewChannelDesc('');
      loadChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-400" />
            Community
          </h1>
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
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                  selectedChannel?._id === channel._id
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Hash className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{channel.name}</div>
                  <div className="text-xs text-slate-400 truncate">{channel.description}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
                    <p className="text-sm text-slate-400">{selectedChannel.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-lg transition ${
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
                    className={`px-4 py-2 rounded-lg transition ${
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
              <Chat channel={selectedChannel} />
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
