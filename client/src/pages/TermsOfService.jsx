import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, ChevronDown, Mail } from '../lib/icons';
import GlassCard from '../components/ui/GlassCard';

const sections = [
  {
    title: 'Agreement to Terms',
    content:
      'By accessing or using GyaanMate, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all learners, instructors, and visitors.',
  },
  {
    title: 'Platform Use',
    content:
      'GyaanMate grants you a limited, non-exclusive license to access course content and tools for personal learning. You may not copy, resell, scrape, or redistribute course materials without permission.',
  },
  {
    title: 'Accounts & Enrollment',
    content:
      'You are responsible for keeping your login credentials secure. Course access, subscriptions, and certificates are tied to your account. Misuse, sharing accounts, or fraudulent enrollment may result in suspension.',
  },
  {
    title: 'Payments & Subscriptions',
    content:
      'Paid courses and Pro subscriptions are billed as described at checkout. Refunds follow our published refund policy. We may change pricing with notice; existing enrollments remain valid unless stated otherwise.',
  },
  {
    title: 'User Content',
    content:
      'Notes, uploads, and community posts you share remain yours, but you grant GyaanMate a license to host and display them on the platform. Do not upload content that infringes copyrights or violates applicable laws.',
  },
  {
    title: 'AI Features',
    content:
      'AI search, chat, and study tools provide suggestions for learning support only. They are not professional advice. Verify important information and use your judgment when making academic or career decisions.',
  },
  {
    title: 'Disclaimer',
    content:
      'GyaanMate is provided "as is" without warranties of uninterrupted service or specific learning outcomes. We are not liable for indirect damages arising from use of the platform, within limits permitted by law.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We may update these terms periodically. Material changes will be reflected by an updated date below. Continued use after changes constitutes acceptance of the revised terms.',
  },
];

export default function TermsOfService() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4">
          <ScrollText className="text-violet-400" size={28} />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Terms of Service</h1>
        <p className="text-slate-400">Rules and guidelines for using GyaanMate</p>
        <p className="text-xs text-slate-500 mt-3">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const isOpen = openIndex === index;
          return (
            <GlassCard key={section.title} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-white/5 transition"
              >
                <span className="font-semibold text-white">{section.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-violet-400 shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-400 leading-relaxed border-t border-white/10 pt-4">
                      {section.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-6 sm:p-8 mt-6">
        <h2 className="text-lg font-semibold text-white mb-2">Questions?</h2>
        <p className="text-slate-400 flex items-center gap-2">
          <Mail className="text-violet-400 shrink-0" size={18} />
          legal@gyaanmate.edu · gyaanmate.edu@gmail.com
        </p>
      </GlassCard>
    </motion.div>
  );
}
