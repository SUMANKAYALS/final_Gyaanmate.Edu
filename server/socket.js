import { Server } from 'socket.io';

let io;

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseList(process.env.CLIENT_URL),
  ...parseList(process.env.CLIENT_ORIGINS),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://final-gyaanmate-edu.vercel.app',
];

export const initializeSocket = (server) => {
  io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: [...new Set(allowedOrigins)],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling', 'websocket'],
    allowUpgrades: true,
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6,
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id, socket.conn.transport.name);

    socket.conn.on('upgrade', (transport) => {
      console.log('Socket transport upgraded:', socket.id, transport.name);
    });

    // Join a channel
    socket.on('join_channel', (channelId) => {
      if (!channelId) return;
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
      const { channelId, message } = data || {};
      if (!channelId || !message) return;
      io.to(channelId).emit('new_message', message);
      console.log(`Message sent to channel ${channelId}`);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { channelId, user } = data || {};
      if (!channelId || !user) return;
      socket.to(channelId).emit('user_typing', { user });
    });

    // Stop typing indicator
    socket.on('stop_typing', (data) => {
      const { channelId, user } = data || {};
      if (!channelId || !user) return;
      socket.to(channelId).emit('user_stopped_typing', { user });
    });

    socket.on('live_session_join', ({ roomId, user } = {}) => {
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

    socket.on('live_session_signal', ({ roomId, to, signal } = {}) => {
      if (!roomId || !to || !signal) return;
      if (socket.data.liveSessionRoom !== roomId) return;
      io.to(to).emit('live_session_signal', {
        from: socket.id,
        signal,
      });
    });

    socket.on('live_session_message', ({ roomId, message } = {}) => {
      if (!roomId || !message) return;
      if (socket.data.liveSessionRoom !== roomId) return;
      io.to(roomId).emit('live_session_message', message);
    });

    socket.on('live_session_leave', ({ roomId } = {}) => {
      if (!roomId) return;
      if (socket.data.liveSessionRoom !== roomId) return;
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
