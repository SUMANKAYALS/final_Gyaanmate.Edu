import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a channel
    socket.on('join_channel', (channelId) => {
      socket.join(channelId);
      console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    // Leave a channel
    socket.on('leave_channel', (channelId) => {
      socket.leave(channelId);
      console.log(`User ${socket.id} left channel ${channelId}`);
    });

    // Send message to channel
    socket.on('send_message', (data) => {
      const { channelId, message } = data;
      io.to(channelId).emit('new_message', message);
      console.log(`Message sent to channel ${channelId}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { channelId, user } = data;
      socket.to(channelId).emit('user_typing', { user });
    });

    // Stop typing indicator
    socket.on('stop_typing', (data) => {
      const { channelId, user } = data;
      socket.to(channelId).emit('user_stopped_typing', { user });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
