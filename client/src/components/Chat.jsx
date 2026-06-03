import { useCallback, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Send, Edit2, Trash2, Paperclip, FileText, Image, Search, X } from '../lib/icons';
import { communityAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const SOCKET_ORIGIN = (import.meta.env.VITE_SOCKET_URL || API_ORIGIN).replace(/\/$/, '');
const SOCKET_PATH = '/socket.io';
const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🙏'];
const ATTACHMENT_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp,.pdf,.txt,.csv,.json,.zip,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

function loadSocketClient() {
  if (window.io) return Promise.resolve(window.io);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-socket-io-client="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.io));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = `${SOCKET_ORIGIN}${SOCKET_PATH}/socket.io.js`;
    script.async = true;
    script.dataset.socketIoClient = 'true';
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error('Unable to load realtime chat client.'));
    document.body.appendChild(script);
  });
}

export default function Chat({ channel }) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [gifPickerOpen, setGifPickerOpen] = useState(false);
  const [gifQuery, setGifQuery] = useState('');
  const [gifResults, setGifResults] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  const appendMessage = useCallback((message) => {
    setMessages((prev) => {
      if (prev.some((item) => item._id === message._id)) return prev;
      return [...prev, message];
    });
  }, []);

  const replaceMessage = useCallback((updatedMessage) => {
    setMessages((prev) =>
      prev.map((message) => (message._id === updatedMessage._id ? updatedMessage : message))
    );
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const res = await communityAPI.getMessages(channel._id, { limit: 100 });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    if (channel) {
      setLoading(true);
      loadMessages();
    }
  }, [channel, loadMessages]);

  useEffect(() => {
    if (!channel?._id) return undefined;
    let cancelled = false;

    const connectSocket = async () => {
      try {
        const io = await loadSocketClient();
        if (cancelled) return;

        const socket = io(SOCKET_ORIGIN, {
          path: SOCKET_PATH,
          transports: ['polling', 'websocket'],
          upgrade: true,
          withCredentials: true,
          autoConnect: false,
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 8,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        socketRef.current = socket;
        socket.on('connect', () => {
          socket.emit('join_channel', channel._id);
        });
        socket.on('new_message', appendMessage);
        socket.on('message_reaction', replaceMessage);
        socket.on('connect_error', (error) => {
          console.error('Community chat realtime connection error:', error.message);
        });
        socket.connect();
      } catch (error) {
        console.error('Unable to start realtime community chat:', error);
      }
    };

    connectSocket();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.emit('leave_channel', channel._id);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [appendMessage, channel, replaceMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await communityAPI.createMessage(channel._id, {
        content: newMessage,
        type: 'text',
      });
      if (!socketRef.current?.connected) {
        appendMessage(res.data.message);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleFileShare = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await communityAPI.uploadAttachment(channel._id, formData);
      const attachment = uploadRes.data.attachment;
      const messageRes = await communityAPI.createMessage(channel._id, {
        content: newMessage.trim(),
        type: attachment.kind,
        attachments: [attachment],
      });
      if (!socketRef.current?.connected) {
        appendMessage(messageRes.data.message);
      }
      setNewMessage('');
      toast.success(attachment.kind === 'gif' ? 'GIF shared' : 'File shared');
    } catch (error) {
      console.error('Error sharing file:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to share file');
    } finally {
      setUploading(false);
    }
  };

  const loadStickers = useCallback(async (query = gifQuery) => {
    setGifLoading(true);
    try {
      const res = await communityAPI.getStickers({ q: query, limit: 18 });
      setGifResults(res.data.stickers || []);
    } catch (error) {
      console.error('Error loading GIF stickers:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Unable to load GIF stickers');
    } finally {
      setGifLoading(false);
    }
  }, [gifQuery]);

  useEffect(() => {
    if (gifPickerOpen && gifResults.length === 0) {
      loadStickers('');
    }
  }, [gifPickerOpen, gifResults.length, loadStickers]);

  const handleGifSearch = (event) => {
    event.preventDefault();
    loadStickers(gifQuery.trim());
  };

  const handleSendSticker = async (sticker) => {
    try {
      const messageRes = await communityAPI.createMessage(channel._id, {
        content: newMessage.trim(),
        type: 'gif',
        attachments: [{
          url: sticker.url,
          name: sticker.title || 'GIF sticker',
          size: 0,
          mimeType: 'image/gif',
          kind: 'gif',
        }],
      });
      if (!socketRef.current?.connected) {
        appendMessage(messageRes.data.message);
      }
      setNewMessage('');
      setGifPickerOpen(false);
    } catch (error) {
      console.error('Error sending GIF sticker:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send GIF sticker');
    }
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const res = await communityAPI.updateMessage(editingMessage._id, {
        content: editContent,
      });
      setMessages(
        messages.map((msg) =>
          msg._id === editingMessage._id ? res.data.message : msg
        )
      );
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await communityAPI.deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      const res = await communityAPI.addReaction(messageId, { emoji });
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? res.data.message : msg
        )
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const getReactionCounts = (reactions = []) => {
    return reactions.reduce((counts, reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
      return counts;
    }, {});
  };

  const formatFileSize = (bytes = 0) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const renderAttachments = (message) => {
    const attachments = message.attachments || [];
    if (attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => {
          const isImage = attachment.kind === 'image' || attachment.kind === 'gif' || attachment.mimeType?.startsWith('image/');
          if (isImage) {
            return (
              <a
                key={`${attachment.url}-${index}`}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border border-white/10 bg-black/10"
              >
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="max-h-72 w-full max-w-sm object-contain"
                />
              </a>
            );
          }

          return (
            <a
              key={`${attachment.url}-${index}`}
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3 text-left transition hover:bg-black/20"
            >
              <FileText className="h-5 w-5 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{attachment.name}</span>
                <span className="block text-xs opacity-70">{formatFileSize(attachment.size)}</span>
              </span>
            </a>
          );
        })}
      </div>
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (today.toDateString() === messageDate.toDateString()) {
      return 'Today';
    }
    return messageDate.toLocaleDateString();
  };

  const getUserId = (person) => {
    if (!person) return '';
    return String(person._id || person.id || person.userId || '');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="community-chat flex-1 min-h-0 flex flex-col">
      {/* Messages Area */}
      <div className="community-chat-scroll flex-1 min-h-0 overflow-y-scroll p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Be the first to start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 ||
              formatDate(messages[index - 1].createdAt) !==
                formatDate(message.createdAt);
            const isOwnMessage = getUserId(message.sender) === getUserId(user);

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center text-slate-500 text-sm my-4">
                    {formatDate(message.createdAt)}
                  </div>
                )}
                <div
                  className={`group/message flex gap-3 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isOwnMessage && (
                    <img
                      src={message.sender.avatar || '/default-avatar.png'}
                      alt={message.sender.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className={`max-w-[min(78%,42rem)] ${isOwnMessage ? 'items-end text-right' : 'items-start'} flex flex-col`}>
                    <div className={`flex flex-wrap items-baseline gap-2 mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-semibold text-sm">
                        {isOwnMessage ? 'You' : message.sender.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-slate-500">(edited)</span>
                      )}
                    </div>
                    <div
                      className={`inline-block max-w-full px-4 py-2 rounded-2xl text-left shadow-sm ${
                        isOwnMessage
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'bg-slate-800 text-slate-100 rounded-bl-md'
                      }`}
                    >
                      {editingMessage?._id === message._id ? (
                        <form onSubmit={handleEditMessage} className="flex gap-2">
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1 bg-slate-700 rounded px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 bg-green-600 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessage(null);
                              setEditContent('');
                            }}
                            className="px-3 py-1 bg-slate-600 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          {message.content && <p className="break-words">{message.content}</p>}
                          {renderAttachments(message)}
                        </>
                      )}
                    </div>
                    <div className={`mt-1 flex flex-wrap gap-1 opacity-0 transition group-hover/message:opacity-100 group-focus-within/message:opacity-100 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      {QUICK_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddReaction(message._id, emoji)}
                          className="rounded-full bg-slate-800/80 px-2 py-1 text-xs transition hover:bg-slate-700"
                          aria-label={`React ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(getReactionCounts(message.reactions)).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(message._id, emoji)}
                            className="px-2 py-1 bg-slate-700 rounded-full text-sm hover:bg-slate-600"
                          >
                            {emoji} {count}
                          </button>
                        ))}
                      </div>
                    )}
                    {isOwnMessage && editingMessage?._id !== message._id && (
                      <div className="flex gap-2 mt-1 justify-end">
                        <button
                          onClick={() => {
                            setEditingMessage(message);
                            setEditContent(message.content);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="shrink-0 p-4 border-t border-slate-800">
        {gifPickerOpen && (
          <div className="mb-3 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <form onSubmit={handleGifSearch} className="flex min-w-0 flex-1 gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={gifQuery}
                    onChange={(event) => setGifQuery(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="Search GIF stickers..."
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Search
                </button>
              </form>
              <button
                type="button"
                onClick={() => setGifPickerOpen(false)}
                className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
                aria-label="Close GIF picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {gifLoading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading GIF stickers...</div>
            ) : gifResults.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No GIF stickers found.</div>
            ) : (
              <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
                {gifResults.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => handleSendSticker(sticker)}
                    className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-slate-800 p-1 transition hover:bg-slate-700"
                    title={sticker.title}
                  >
                    <img
                      src={sticker.previewUrl || sticker.url}
                      alt={sticker.title}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] text-slate-500">Powered by GIPHY stickers</p>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ATTACHMENT_ACCEPT}
            onChange={handleFileShare}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:text-slate-400 rounded-lg transition"
            aria-label="Attach file or GIF"
            title="Attach file or GIF"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setGifPickerOpen((open) => !open)}
            disabled={uploading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:text-slate-400 rounded-lg transition"
            aria-label="Open GIF stickers"
            title="Open GIF stickers"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={uploading ? 'Uploading file...' : 'Type a message...'}
            disabled={uploading}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || uploading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 rounded-lg transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
