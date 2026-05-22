import CommunityChannel from '../models/CommunityChannel.js';
import Message from '../models/Message.js';
import DiscussionThread from '../models/DiscussionThread.js';
import Reply from '../models/Reply.js';
import UserConnection from '../models/UserConnection.js';

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
    
    if (channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    channel.members.push(req.user._id);
    await channel.save();
    
    res.json({ channel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Message Controllers
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
    
    const message = await Message.create({
      channel: channelId,
      sender: req.user._id,
      content,
      type: type || 'text',
      attachments: attachments || [],
      replyTo
    });
    
    await message.populate('sender', 'name avatar');
    
    // Update channel's last message and message count
    await CommunityChannel.findByIdAndUpdate(channelId, {
      lastMessage: message._id,
      $inc: { messageCount: 1 }
    });
    
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
