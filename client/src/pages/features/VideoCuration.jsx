import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserTie } from 'react-icons/fa';
import FeaturePageShell from '../../components/features/FeaturePageShell';
import { aiAPI } from '../../services/api';
import { Camera, Loader2, MessageSquare, Mic, Phone, Sparkles, User, Video, Volume2, X } from '../../lib/icons';

const DEFAULT_ROLE = 'Frontend Developer';
const FALLBACK_QUESTIONS = {
  beginner: [
    'Tell me about yourself and why you are interested in this role.',
    'Walk me through one project you worked on and what you learned from it.',
    'How do you approach learning a new tool or concept?',
  ],
  intermediate: [
    'Describe a challenging problem you solved recently. What tradeoffs did you consider?',
    'Tell me about a time you received feedback and changed your approach.',
    'How would you explain a technical decision to a non-technical teammate?',
  ],
  advanced: [
    'Describe a high-impact decision you made under uncertainty. How did you evaluate the risk?',
    'Tell me about a time you improved a system, process, or team outcome.',
    'How do you mentor others while still delivering your own work?',
  ],
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

function getFallbackQuestion(role, level) {
  const pool = FALLBACK_QUESTIONS[level] || FALLBACK_QUESTIONS.beginner;
  const base = pool[Math.floor(Math.random() * pool.length)];
  return `${base} Please answer as a candidate for a ${role || DEFAULT_ROLE} position.`;
}

export default function VideoCuration() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [level, setLevel] = useState('beginner');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [dictationSupported, setDictationSupported] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const interviewActive = Boolean(question);

  useEffect(() => {
    if (!interviewActive) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [interviewActive]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setDictationSupported(Boolean(SpeechRecognition));

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!cameraOn || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => {
      toast.error('Could not start camera preview');
    });
  }, [cameraOn]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      stopCamera();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Camera is not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      toast.error('Camera permission was not granted');
    }
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicOn(false);
  };

  const toggleDictation = () => {
    if (micOn) {
      stopDictation();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDictationSupported(false);
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let committedTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          committedTranscript += `${transcript.trim()} `;
        } else {
          interimTranscript += transcript;
        }
      }

      const spokenText = `${committedTranscript}${interimTranscript}`.trim();
      if (spokenText) {
        setAnswer((current) => {
          const base = current.replace(/\n\nListening:.*$/s, '').trim();
          const prefix = base ? `${base}\n\n` : '';
          return `${prefix}Listening: ${spokenText}`;
        });
      }
    };

    recognition.onerror = (event) => {
      setMicOn(false);
      toast.error(event.error === 'not-allowed' ? 'Microphone permission was not granted' : 'Speech recognition stopped');
    };

    recognition.onend = () => {
      setAnswer((current) => current.replace(/\n\nListening:\s*/g, '\n\n').replace(/^Listening:\s*/, '').trim());
      setMicOn(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setMicOn(true);
  };

  const speakQuestion = (text) => {
    if (!speakerOn || !text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const generateQuestion = async () => {
    const targetRole = role.trim();
    if (!targetRole) {
      toast.error('Enter an interview role first');
      return;
    }

    setLoadingQuestion(true);
    setFeedback('');
    setAnswer('');
    setElapsed(0);
    try {
      const { data } = await aiAPI.bot([
        {
          role: 'user',
          content: `Act as a live video interviewer. Ask one ${level} level mock interview question for a ${targetRole}. Return only the question.`,
        },
      ]);
      const nextQuestion = data.content || 'Tell me about a project you are proud of and the decisions you made.';
      setQuestion(nextQuestion);
      speakQuestion(nextQuestion);
    } catch {
      const fallbackQuestion = getFallbackQuestion(targetRole, level);
      setQuestion(fallbackQuestion);
      speakQuestion(fallbackQuestion);
      toast.error('AI question service unavailable, using a practice question');
    } finally {
      setLoadingQuestion(false);
    }
  };

  const reviewAnswer = async () => {
    if (!question || !answer.trim()) {
      toast.error('Answer the interview question first');
      return;
    }

    setLoadingFeedback(true);
    try {
      const { data } = await aiAPI.bot([
        {
          role: 'user',
          content: `Review this mock video interview answer for a ${role || DEFAULT_ROLE} role.
Question: ${question}
Answer: ${answer}

Give concise feedback with strengths, improvements, confidence tips, and a stronger sample answer.`,
        },
      ]);
      setFeedback(data.content || 'No feedback returned.');
    } catch {
      toast.error('Could not review your answer');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const endInterview = () => {
    setQuestion('');
    setAnswer('');
    setFeedback('');
    setElapsed(0);
    stopDictation();
    window.speechSynthesis?.cancel();
    stopCamera();
  };

  return (
    <FeaturePageShell
      title="AI Mock Interview"
      subtitle="Practice in a video call-style interview room with role-based questions and AI feedback."
      icon={FaUserTie}
      badge="Career practice"
      wide
    >
      <div className="ai-interview-room grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
            <div className="min-w-0 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-200">
                <FaUserTie size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{role || DEFAULT_ROLE} Interview</p>
                <p className="text-xs capitalize text-slate-500">{level} level mock session</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cameraOn ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {cameraOn ? 'Video on' : 'Video off'}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${micOn ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {micOn ? 'Listening' : 'Mic idle'}
              </span>
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300">
                {interviewActive ? formatTime(elapsed) : 'Ready'}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6">
              <div className="absolute inset-x-0 top-0 h-24 bg-violet-500/10 blur-2xl" aria-hidden />
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                AI interviewer
              </div>
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-violet-600/20 text-violet-200 ring-1 ring-violet-400/30">
                <FaUserTie size={48} />
              </div>
              <div className="rounded-xl border border-white/10 bg-black/35 p-5 shadow-xl">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                  <MessageSquare size={14} />
                  Current question
                </p>
                <p className="text-base leading-7 text-slate-100">
                  {question || 'Set your role, then start the interview to receive your first question.'}
                </p>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              {cameraOn ? (
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 text-slate-500">
                  <User size={42} />
                  <p className="text-sm font-medium text-slate-300">Camera off</p>
                  <p className="max-w-40 text-center text-xs leading-5 text-slate-500">
                    Start video to see your live camera preview.
                  </p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-2.5 py-1 text-xs text-white">
                You
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-800 bg-slate-950/80 px-4 py-4">
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                cameraOn ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-red-500 text-white hover:bg-red-400'
              }`}
              title={cameraOn ? 'Stop video' : 'Start video'}
            >
              {cameraOn ? <Video size={19} /> : <Camera size={19} />}
            </button>
            <button
              type="button"
              onClick={toggleDictation}
              disabled={!dictationSupported}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                micOn ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-red-500 text-white hover:bg-red-400'
              }`}
              title={micOn ? 'Stop voice answer' : 'Speak your answer'}
            >
              {micOn ? <Mic size={19} /> : <X size={19} />}
            </button>
            <button
              type="button"
              onClick={generateQuestion}
              disabled={loadingQuestion}
              className="flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 disabled:opacity-50"
            >
              {loadingQuestion ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {question ? 'Next Question' : 'Start Interview'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (speakerOn) {
                  window.speechSynthesis?.cancel();
                  setSpeakerOn(false);
                } else {
                  setSpeakerOn(true);
                  speakQuestion(question);
                }
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                speakerOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-400'
              }`}
              title={speakerOn ? 'Mute interviewer voice' : 'Unmute interviewer voice'}
            >
              {speakerOn ? <Volume2 size={19} /> : <X size={19} />}
            </button>
            <button
              type="button"
              onClick={endInterview}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500"
              title="End interview"
            >
              <Phone size={19} />
            </button>
          </div>
        </section>

        <aside className="ai-interview-settings rounded-xl border border-slate-700/70 bg-slate-900/50 p-5">
          <label className="block text-sm font-medium text-slate-300 mb-2">Interview role</label>
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Frontend Developer, Data Analyst..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />

          <label className="mt-4 block text-sm font-medium text-slate-300 mb-2">Level</label>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white focus:border-violet-500 focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="mt-5 rounded-xl bg-slate-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Session cues</p>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>Start video to preview your live camera.</p>
              <p>Answer naturally using your microphone.</p>
              <p>The interviewer can speak each question aloud.</p>
              <p>Tap the mic button and speak to fill answer notes.</p>
              <p>Use examples with context, action, and result.</p>
              <p>Keep answers under two minutes.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-medium text-slate-300">Answer notes</label>
            {micOn && (
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Listening through your microphone
              </p>
            )}
          </div>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Speak with the mic or type your answer notes here..."
            rows={7}
            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={reviewAnswer}
            disabled={loadingFeedback}
            className="btn-primary mt-4 disabled:opacity-50"
          >
            {loadingFeedback ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Review Answer
          </button>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/50 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">AI Feedback</p>
          {feedback ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{feedback}</p>
          ) : (
            <p className="text-sm leading-6 text-slate-400">
              Finish an answer and request feedback to see strengths, improvements, confidence tips, and a stronger sample response.
            </p>
          )}
        </div>
      </div>
    </FeaturePageShell>
  );
}
