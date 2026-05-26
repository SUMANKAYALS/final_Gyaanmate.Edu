import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Phone, Facebook, Twitter, Linkedin, Send } from '../lib/icons';
import GlassCard from '../components/ui/GlassCard';

const faqs = [
  { q: 'How do I enroll in a course?', a: 'Browse courses, add to cart, and complete checkout. You can start learning immediately after purchase.' },
  { q: 'Is there a free trial?', a: 'Many courses offer preview lessons. Check our Subscription page for Pro benefits.' },
  { q: 'How does AI Search work?', a: 'AI Search uses Gemini to understand your goals and recommend relevant courses — no backend changes needed on your end.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold gradient-text text-center mb-2">Contact Us</h1>
      <p className="text-slate-400 text-center mb-10">We&apos;d love to hear from you</p>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <GlassCard className="p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Send a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-violet-500 focus:outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-violet-500 focus:outline-none"
            />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:border-violet-500 focus:outline-none resize-none"
            />
            <button type="submit" className="btn-primary w-full">
              <Send size={18} /> Send Message
            </button>
          </form>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <p className="flex items-center gap-3 text-slate-300 mb-3">
              <Mail className="text-violet-400" size={18} /> gyaanmate.edu@gmail.com
            </p>
            <p className="flex items-center gap-3 text-slate-300">
              <Phone className="text-violet-400" size={18} /> +91 (support line)
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Follow us</h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-3 rounded-xl bg-slate-800 hover:bg-violet-600/30 text-slate-300 hover:text-white transition">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <GlassCard key={f.q} className="p-5">
            <h3 className="font-medium text-violet-300">{f.q}</h3>
            <p className="text-sm text-slate-400 mt-2">{f.a}</p>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
