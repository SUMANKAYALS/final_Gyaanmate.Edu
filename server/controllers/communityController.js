import CommunityChannel from '../models/CommunityChannel.js';
import Message from '../models/Message.js';
import DiscussionThread from '../models/DiscussionThread.js';
import Reply from '../models/Reply.js';
import UserConnection from '../models/UserConnection.js';
import { getIO } from '../socket.js';
import { uploadRaw } from '../services/cloudinaryService.js';

const GIPHY_PUBLIC_DEMO_KEY = 'dc6zaTOxFJmzC';

const isChannelMember = (channel, userId) =>
  channel.members.some((memberId) => memberId.toString() === userId.toString());

const mapGiphySticker = (item) => {
  const image = item.images?.fixed_height || item.images?.downsized || item.images?.original || {};
  return {
    id: item.id,
    title: item.title || 'GIF sticker',
    url: image.webp || image.url,
    previewUrl: item.images?.fixed_width_small?.webp || item.images?.fixed_width_small?.url || image.webp || image.url,
    width: Number(image.width) || 0,
    height: Number(image.height) || 0,
    source: 'giphy',
  };
};

// Channel Controllers
export const getChannels = async (req, res) => {
  try {
    const channels = await CommunityChannel.find({
      $or: [
        { type: 'public' },
        { members: req.user._id },
        { createdBy: req.user._id }
      ]
    })
    .populate('createdBy', 'name avatar')
    .populate('lastMessage', 'content createdAt')
    .populate('members', 'name avatar')
    .sort({ updatedAt: -1 });
    
    res.json({ channels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description, type, course } = req.body;
    
    const channel = await CommunityChannel.create({
      name,
      description,
      type: type || 'public',
      course,
      createdBy: req.user._id,
      members: [req.user._id]
    });
    
    await channel.populate('createdBy', 'name avatar');
    res.status(201).json({ channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChannelById = async (req, res) => {
  try {
    const channel = await CommunityChannel.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('members', 'name avatar');
      
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    res.json({ channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinChannel = async (req, res) => {
  try {
    const channel = await CommunityChannel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    const isMember = isChannelMember(channel, req.user._id);
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    channel.members.push(req.user._id);
    await channel.save();
    await channel.populate('createdBy', 'name avatar');
    await channel.populate('members', 'name avatar');
    await channel.populate('lastMessage', 'content createdAt');
    
    res.json({ channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveChannel = async (req, res) => {
  try {
    const channel = await CommunityChannel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (!isChannelMember(channel, req.user._id)) {
      return res.status(400).json({ message: 'You are not a member of this channel' });
    }

    channel.members = channel.members.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );
    await channel.save();
    await channel.populate('createdBy', 'name avatar');
    await channel.populate('members', 'name avatar');
    await channel.populate('lastMessage', 'content createdAt');

    res.json({ channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Message Controllers
export const searchStickers = async (req, res) => {
  try {
    const apiKey = process.env.GIPHY_API_KEY || GIPHY_PUBLIC_DEMO_KEY;

    const query = String(req.query.q || '').trim();
    const limit = Math.min(Number(req.query.limit) || 16, 24);
    const endpoint = query
      ? 'https://api.giphy.com/v1/stickers/search'
      : 'https://api.giphy.com/v1/stickers/trending';
    const url = new URL(endpoint);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('rating', 'pg');
    if (query) url.searchParams.set('q', query);

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.meta?.msg || 'Unable to load GIF stickers',
      });
    }

    res.json({ stickers: (data.data || []).map(mapGiphySticker).filter((item) => item.url) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadMessageAttachment = async (req, res) => {
  try {
    const { channelId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Choose a file to upload' });
    }

    const channel = await CommunityChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (!isChannelMember(channel, req.user._id)) {
      return res.status(403).json({ message: 'Join this channel before sharing files' });
    }

    const uploaded = await uploadRaw(
      file.buffer,
      file.originalname,
      file.mimetype,
      'learnhub/community'
    );
    const kind = file.mimetype === 'image/gif'
      ? 'gif'
      : file.mimetype.startsWith('image/')
        ? 'image'
        : 'file';

    res.status(201).json({
      attachment: {
        ...uploaded,
        size: file.size || uploaded.size,
        kind,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name avatar')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content, type, attachments, replyTo } = req.body;

    const channel = await CommunityChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (!isChannelMember(channel, req.user._id)) {
      return res.status(403).json({ message: 'Join this channel before chatting' });
    }

    const nextAttachments = Array.isArray(attachments) ? attachments : [];
    if (!String(content || '').trim() && nextAttachments.length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }
    
    const message = await Message.create({
      channel: channelId,
      sender: req.user._id,
      content: content || '',
      type: type || (nextAttachments[0]?.kind || 'text'),
      attachments: nextAttachments,
      replyTo
    });
    
    await message.populate('sender', 'name avatar');
    
    // Update channel's last message and message count
    await CommunityChannel.findByIdAndUpdate(channelId, {
      lastMessage: message._id,
      $inc: { messageCount: 1 }
    });

    getIO().to(channelId).emit('new_message', message);
    
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    message.content = req.body.content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();
    
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const channel = await CommunityChannel.findById(message.channel);
    if (!channel || !isChannelMember(channel, req.user._id)) {
      return res.status(403).json({ message: 'Join this channel before reacting' });
    }
    
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );
    
    if (existingReaction) {
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === req.user._id.toString() && r.emoji === emoji)
      );
    } else {
      message.reactions.push({ user: req.user._id, emoji });
    }
    
    await message.save();
    await message.populate('sender', 'name avatar');
    getIO().to(message.channel.toString()).emit('message_reaction', message);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Discussion Thread Controllers
export const getThreads = async (req, res) => {
  try {
    const { category, tag, course } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (course) filter.course = course;
    
    const threads = await DiscussionThread.find(filter)
      .populate('author', 'name avatar')
      .populate('course', 'title')
      .populate('acceptedAnswer', 'author content')
      .sort({ pinned: -1, createdAt: -1 });
    
    res.json({ threads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createThread = async (req, res) => {
  try {
    const { title, content, category, tags, channel, course } = req.body;
    
    const thread = await DiscussionThread.create({
      title,
      content,
      author: req.user._id,
      category: category || 'discussion',
      tags: tags || [],
      channel,
      course
    });
    
    await thread.populate('author', 'name avatar');
    res.status(201).json({ thread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getThreadById = async (req, res) => {
  try {
    const thread = await DiscussionThread.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('course', 'title')
      .populate('acceptedAnswer', 'author content');
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Increment view count
    thread.views += 1;
    await thread.save();
    
    res.json({ thread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteThread = async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const thread = await DiscussionThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    if (vote === 'up') {
      if (!thread.upvotes.includes(req.user._id)) {
        thread.upvotes.push(req.user._id);
        thread.downvotes = thread.downvotes.filter(id => id.toString() !== req.user._id.toString());
      }
    } else if (vote === 'down') {
      if (!thread.downvotes.includes(req.user._id)) {
        thread.downvotes.push(req.user._id);
        thread.upvotes = thread.upvotes.filter(id => id.toString() !== req.user._id.toString());
      }
    }
    
    await thread.save();
    res.json({ thread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply Controllers
export const getReplies = async (req, res) => {
  try {
    const { threadId } = req.params;
    
    const replies = await Reply.find({ thread: threadId })
      .populate('author', 'name avatar')
      .populate('parentReply', 'author content')
      .sort({ isAccepted: -1, upvotes: -1, createdAt: -1 });
    
    res.json({ replies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content, parentReply } = req.body;
    
    const reply = await Reply.create({
      thread: threadId,
      author: req.user._id,
      content,
      parentReply
    });
    
    await reply.populate('author', 'name avatar');
    res.status(201).json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    const thread = await DiscussionThread.findById(reply.thread);
    
    if (!reply || !thread) {
      return res.status(404).json({ message: 'Reply or thread not found' });
    }
    
    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only thread author can accept answers' });
    }
    
    // Remove previous accepted answer
    if (thread.acceptedAnswer) {
      await Reply.findByIdAndUpdate(thread.acceptedAnswer, { isAccepted: false });
    }
    
    reply.isAccepted = true;
    await reply.save();
    
    thread.acceptedAnswer = reply._id;
    thread.isSolved = true;
    await thread.save();
    
    res.json({ reply, thread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connection Controllers
export const getConnections = async (req, res) => {
  try {
    const connections = await UserConnection.find({
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('requester', 'name avatar')
    .populate('recipient', 'name avatar')
    .sort({ updatedAt: -1 });
    
    res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    const existingConnection = await UserConnection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });
    
    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }
    
    const connection = await UserConnection.create({
      requester: req.user._id,
      recipient: recipientId,
      status: 'pending'
    });
    
    await connection.populate('requester', 'name avatar');
    await connection.populate('recipient', 'name avatar');
    
    res.status(201).json({ connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToConnection = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'blocked'
    const connection = await UserConnection.findById(req.params.id);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    
    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    connection.status = status;
    await connection.save();
    
    res.json({ connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
