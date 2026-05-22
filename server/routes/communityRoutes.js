import { Router } from 'express';
import {
  getChannels,
  createChannel,
  getChannelById,
  joinChannel,
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  addReaction,
  getThreads,
  createThread,
  getThreadById,
  voteThread,
  getReplies,
  createReply,
  acceptReply,
  getConnections,
  sendConnectionRequest,
  respondToConnection,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Channel routes
router.get('/channels', protect, getChannels);
router.post('/channels', protect, createChannel);
router.get('/channels/:id', protect, getChannelById);
router.post('/channels/:id/join', protect, joinChannel);

// Message routes
router.get('/channels/:channelId/messages', protect, getMessages);
router.post('/channels/:channelId/messages', protect, createMessage);
router.put('/messages/:id', protect, updateMessage);
router.delete('/messages/:id', protect, deleteMessage);
router.post('/messages/:id/reactions', protect, addReaction);

// Thread routes
router.get('/threads', protect, getThreads);
router.post('/threads', protect, createThread);
router.get('/threads/:id', protect, getThreadById);
router.post('/threads/:id/vote', protect, voteThread);

// Reply routes
router.get('/threads/:threadId/replies', protect, getReplies);
router.post('/threads/:threadId/replies', protect, createReply);
router.post('/replies/:id/accept', protect, acceptReply);

// Connection routes
router.get('/connections', protect, getConnections);
router.post('/connections', protect, sendConnectionRequest);
router.put('/connections/:id', protect, respondToConnection);

export default router;
