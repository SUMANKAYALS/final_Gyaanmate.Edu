import { useEffect, useState, useRef } from 'react';
import { Send, MoreVertical, Edit2, Trash2 } from '../lib/icons';
import { communityAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Chat({ channel }) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (channel) {
      loadMessages();
    }
  }, [channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const res = await communityAPI.getMessages(channel._id, { limit: 100 });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message to channel:', channel._id, 'content:', newMessage);

    try {
      const res = await communityAPI.createMessage(channel._id, {
        content: newMessage,
        type: 'text',
      });
      console.log('Message sent successfully:', res.data.message);
      setMessages([...messages, res.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      alert('Failed to send message. Please check console for details.');
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            const isOwnMessage = message.sender._id === user?._id;

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center text-slate-500 text-sm my-4">
                    {formatDate(message.createdAt)}
                  </div>
                )}
                <div
                  className={`flex gap-3 ${
                    isOwnMessage ? 'flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={message.sender.avatar || '/default-avatar.png'}
                    alt={message.sender.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {message.sender.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-slate-500">(edited)</span>
                      )}
                    </div>
                    <div
                      className={`inline-block max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-100'
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
                        <p className="break-words">{message.content}</p>
                      )}
                    </div>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddReaction(message._id, reaction.emoji)}
                            className="px-2 py-1 bg-slate-700 rounded-full text-sm hover:bg-slate-600"
                          >
                            {reaction.emoji} {1}
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
      <div className="p-4 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 rounded-lg transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
