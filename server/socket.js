import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://final-gyaanmate-edu.vercel.app',
      ],
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

    socket.on('live_session_join', ({ roomId, user }) => {
      if (!roomId) return;
      const room = io.sockets.adapter.rooms.get(roomId);
      const peers = room
        ? [...room]
            .map((socketId) => {
              const peerSocket = io.sockets.sockets.get(socketId);
              return peerSocket
                ? { socketId, user: peerSocket.data.liveSessionUser }
                : null;
            })
            .filter(Boolean)
        : [];

      socket.join(roomId);
      socket.data.liveSessionRoom = roomId;
      socket.data.liveSessionUser = user;
      socket.emit('live_session_existing_peers', peers);
      socket.to(roomId).emit('live_session_peer_joined', {
        socketId: socket.id,
        user,
      });
    });

    socket.on('live_session_signal', ({ roomId, to, signal }) => {
      if (!roomId || !to || !signal) return;
      io.to(to).emit('live_session_signal', {
        from: socket.id,
        signal,
      });
    });

    socket.on('live_session_message', ({ roomId, message }) => {
      if (!roomId || !message) return;
      io.to(roomId).emit('live_session_message', message);
    });

    socket.on('live_session_leave', ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      socket.to(roomId).emit('live_session_peer_left', { socketId: socket.id });
      socket.data.liveSessionRoom = null;
      socket.data.liveSessionUser = null;
    });

    // Disconnect
    socket.on('disconnect', () => {
      const roomId = socket.data.liveSessionRoom;
      if (roomId) {
        socket.to(roomId).emit('live_session_peer_left', { socketId: socket.id });
      }
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
