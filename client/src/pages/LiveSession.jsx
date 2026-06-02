import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Copy,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Send,
  Users,
  Video,
  VideoOff,
} from '../lib/icons';
import { useAuthStore } from '../store/authStore';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const makeRoomId = () =>
  `class-${Math.random().toString(36).slice(2, 6)}-${Date.now().toString(36).slice(-4)}`;

const getInitialRoom = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || '';
};

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
    script.src = `${API_ORIGIN}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.socketIoClient = 'true';
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error('Unable to load video session client.'));
    document.body.appendChild(script);
  });
}

export default function LiveSession() {
  const user = useAuthStore((s) => s.user);
  const initialRoom = useMemo(() => getInitialRoom(), []);
  const [roomId, setRoomId] = useState(initialRoom || makeRoomId);
  const [joinCode, setJoinCode] = useState(initialRoom);
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sessionRole, setSessionRole] = useState(user?.role === 'instructor' || user?.role === 'admin' ? 'teacher' : 'student');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const remoteSocketIdRef = useRef(null);

  const meetingUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.pathname = '/live-session';
    url.search = `?room=${encodeURIComponent(roomId)}`;
    return url.toString();
  }, [roomId]);

  const displayUser = useMemo(
    () => ({
      id: user?.id || user?._id,
      name: user?.name || 'Guest',
      role: sessionRole,
      avatar: user?.avatar,
    }),
    [sessionRole, user]
  );

  const attachLocalStream = useCallback((stream) => {
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, []);

  const createPeer = useCallback((targetSocketId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current);
    });

    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && targetSocketId) {
        socketRef.current.emit('live_session_signal', {
          roomId,
          to: targetSocketId,
          signal: { type: 'candidate', candidate: event.candidate },
        });
      }
    };

    peer.onconnectionstatechange = () => {
      if (['failed', 'disconnected', 'closed'].includes(peer.connectionState)) {
        setRemoteUser(null);
      }
    };

    peerRef.current = peer;
    return peer;
  }, [roomId]);

  const cleanupPeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    remoteSocketIdRef.current = null;
    setRemoteUser(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, []);

  const leaveSession = useCallback(() => {
    socketRef.current?.emit('live_session_leave', { roomId });
    socketRef.current?.disconnect();
    socketRef.current = null;
    cleanupPeer();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setJoined(false);
    setScreenSharing(false);
  }, [cleanupPeer, roomId]);

  const joinSession = async (role = sessionRole, code = roomId) => {
    const nextRoomId = String(code || '').trim();
    if (!nextRoomId) return toast.error('Enter a room name first.');

    setConnecting(true);
    setSessionRole(role);
    setRoomId(nextRoomId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      attachLocalStream(stream);
      setCameraOn(true);
      setMicOn(true);

      const participant = { ...displayUser, role };
      const io = await loadSocketClient();
      const socket = io(API_ORIGIN, { transports: ['websocket', 'polling'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('live_session_join', {
          roomId: nextRoomId,
          user: participant,
        });
        setJoined(true);
        toast.success(role === 'teacher' ? 'Live class started' : 'Joined live class');
      });

      socket.on('live_session_peer_joined', async ({ socketId, user: peerUser }) => {
        remoteSocketIdRef.current = socketId;
        setRemoteUser(peerUser);
        const peer = createPeer(socketId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit('live_session_signal', {
          roomId: nextRoomId,
          to: socketId,
          signal: { type: 'offer', sdp: offer },
        });
      });

      socket.on('live_session_existing_peers', (peers = []) => {
        const [peer] = peers;
        if (!peer) return;
        remoteSocketIdRef.current = peer.socketId;
        setRemoteUser(peer.user);
      });

      socket.on('live_session_signal', async ({ from, signal }) => {
        remoteSocketIdRef.current = from;
        const peer = peerRef.current || createPeer(from);

        if (signal.type === 'offer') {
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('live_session_signal', {
            roomId: nextRoomId,
            to: from,
            signal: { type: 'answer', sdp: answer },
          });
          return;
        }

        if (signal.type === 'answer') {
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          return;
        }

        if (signal.type === 'candidate' && signal.candidate) {
          await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      });

      socket.on('live_session_message', (message) => {
        setMessages((prev) => [...prev.slice(-40), message]);
      });

      socket.on('live_session_peer_left', cleanupPeer);
      socket.on('connect_error', () => toast.error('Could not connect to live session server.'));
    } catch (error) {
      toast.error(error.message || 'Unable to start camera or microphone.');
      leaveSession();
    } finally {
      setConnecting(false);
    }
  };

  const toggleCamera = () => {
    const next = !cameraOn;
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    setCameraOn(next);
  };

  const toggleMic = () => {
    const next = !micOn;
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setMicOn(next);
  };

  const shareScreen = async () => {
    if (!peerRef.current) return toast.error('Wait for another participant to join.');

    if (screenSharing) {
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      const sender = peerRef.current.getSenders().find((item) => item.track?.kind === 'video');
      if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenSharing(false);
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current.getSenders().find((item) => item.track?.kind === 'video');
      if (sender && screenTrack) await sender.replaceTrack(screenTrack);
      screenTrack.onended = () => {
        setScreenSharing(false);
      };
      screenStreamRef.current = screenStream;
      setScreenSharing(true);
    } catch {
      toast.error('Screen sharing was cancelled.');
    }
  };

  const createNewRoom = () => {
    const nextRoomId = makeRoomId();
    setRoomId(nextRoomId);
    setJoinCode('');
    setMessages([]);
  };

  const createSession = async () => {
    const nextRoomId = makeRoomId();
    setRoomId(nextRoomId);
    setJoinCode(nextRoomId);
    await joinSession('teacher', nextRoomId);
  };

  const joinWithCode = async () => {
    const nextRoomId = joinCode.trim();
    if (!nextRoomId) return toast.error('Enter the meeting code from your teacher.');
    setRoomId(nextRoomId);
    await joinSession('student', nextRoomId);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(meetingUrl);
    toast.success('Meeting link copied');
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success('Room code copied');
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit('live_session_message', {
      roomId,
      message: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        sender: displayUser.name,
        role: displayUser.role,
        createdAt: new Date().toISOString(),
      },
    });
    setChatInput('');
  };

  useEffect(() => () => leaveSession(), [leaveSession]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="live-session-page max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <p className="text-sm text-violet-300 font-medium">Live classroom</p>
          <h1 className="text-3xl font-bold gradient-text mt-1">Student-teacher video session</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Start a room, share the link, and teach face-to-face with video, voice, screen sharing, and class chat.
          </p>
        </div>
        {joined && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
              {roomId}
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="live-session-copy-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
            >
              <Copy size={17} /> Copy link
            </button>
            <button
              type="button"
              onClick={copyRoomCode}
              className="live-session-copy-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
            >
              <Copy size={17} /> Copy code
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-slate-950">
              <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
              {!remoteUser && (
                <div className="live-session-video-empty absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500">
                  <Users size={34} className="mb-3 text-violet-300" />
                  <p className="font-medium text-slate-300">Waiting for student or teacher</p>
                  <p className="text-sm">Share the room link to begin the class.</p>
                </div>
              )}
              <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs text-white">
                {remoteUser ? `${remoteUser.name} · ${remoteUser.role}` : 'Remote participant'}
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-slate-950">
              <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              {!joined && (
                <div className="live-session-video-empty absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500">
                  <Video size={34} className="mb-3 text-violet-300" />
                  <p className="font-medium text-slate-300">Preview starts after joining</p>
                  <p className="text-sm">Camera and microphone permission are required.</p>
                </div>
              )}
              <div className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs text-white">
                You · {displayUser.role}
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!joined ? (
                <div className="grid w-full gap-4 lg:grid-cols-[minmax(220px,280px)_1fr]">
                  <button
                    type="button"
                    onClick={createSession}
                    disabled={connecting}
                    className="live-session-create-button inline-flex min-h-16 items-center justify-center gap-3 rounded-xl bg-violet-600 px-5 py-4 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
                  >
                    {connecting && sessionRole === 'teacher' ? <Loader2 size={20} className="animate-spin" /> : <Video size={20} />}
                    Create session
                  </button>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') joinWithCode();
                      }}
                      className="live-session-code-input min-h-16 min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-violet-400"
                      placeholder="Enter meeting code"
                    />
                    <button
                      type="button"
                      onClick={joinWithCode}
                      disabled={connecting || !joinCode.trim()}
                      className="live-session-join-button inline-flex min-h-16 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {connecting && sessionRole === 'student' ? <Loader2 size={20} className="animate-spin" /> : <Users size={20} />}
                      Join session
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                      micOn ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-red-600/20 text-red-300'
                    }`}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                    {micOn ? 'Mute' : 'Unmute'}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCamera}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                      cameraOn ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-red-600/20 text-red-300'
                    }`}
                  >
                    {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                    {cameraOn ? 'Camera off' : 'Camera on'}
                  </button>
                  <button
                    type="button"
                    onClick={shareScreen}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15"
                  >
                    <MonitorUp size={18} />
                    {screenSharing ? 'Stop sharing' : 'Share screen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      leaveSession();
                      createNewRoom();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500"
                  >
                    <PhoneOff size={18} /> Leave
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <aside className="glass-card flex min-h-[520px] flex-col overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-violet-300" />
              <h2 className="font-semibold text-white">Class chat</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">Use this for links, questions, and quick notes.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="live-session-chat-message rounded-xl bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{message.sender}</p>
                    <span className="text-[11px] capitalize text-slate-500">{message.role}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{message.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={!joined}
                className="live-session-chat-input min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-400 disabled:opacity-50"
                placeholder={joined ? 'Type a message...' : 'Join to chat'}
              />
              <button
                type="submit"
                disabled={!joined || !chatInput.trim()}
                className="rounded-xl bg-violet-600 px-3 py-2 text-white hover:bg-violet-500 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </aside>
      </div>
    </motion.div>
  );
}
