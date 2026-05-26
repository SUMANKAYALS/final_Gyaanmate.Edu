import { motion } from 'framer-motion';
import { Shield, Mail } from '../lib/icons';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../animations/motionVariants';

const sections = [
  {
    title: 'Introduction',
    body: 'At GyaanMate, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our learning platform.',
  },
  {
    title: 'Information We Collect',
    list: [
      'Account details (name, email, profile information)',
      'Course enrollment and learning progress',
      'Notes, bookmarks, and study materials you upload',
      'Payment and subscription records (processed securely)',
      'Device, browser, and usage analytics to improve the product',
    ],
  },
  {
    title: 'How We Use Your Information',
    list: [
      'Deliver courses, certificates, and personalized recommendations',
      'Power AI search, chat, and study tools',
      'Communicate about your account and platform updates',
      'Improve security, performance, and user experience',
      'Comply with legal obligations',
    ],
  },
  {
    title: 'Information Sharing',
    body: 'We do not sell your personal data. We may share limited information with trusted service providers (hosting, payments, email) who help operate GyaanMate under strict confidentiality agreements.',
  },
  {
    title: 'Data Security',
    body: 'We use industry-standard safeguards including encryption in transit, access controls, and secure authentication. No online service can guarantee absolute security, but we continuously work to protect your data.',
  },
  {
    title: 'Your Rights',
    list: [
      'Access and update your profile information',
      'Request deletion of your account data',
      'Opt out of non-essential marketing emails',
      'Export your learning data where applicable',
    ],
  },
  {
    title: 'Updates to This Policy',
    body: `We may update this policy from time to time. The "Last updated" date below reflects the latest version. Continued use of GyaanMate after changes means you accept the updated policy.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4">
          <Shield className="text-violet-400" size={28} />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Privacy Policy</h1>
        <p className="text-slate-400">How GyaanMate handles and protects your data</p>
        <p className="text-xs text-slate-500 mt-3">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {sections.map((section) => (
          <motion.div key={section.title} variants={fadeInUp}>
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
              {section.body && <p className="text-slate-400 leading-relaxed">{section.body}</p>}
              {section.list && (
                <ul className="list-disc pl-5 text-slate-400 space-y-2 mt-1">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </GlassCard>
          </motion.div>
        ))}

        <motion.div variants={fadeInUp}>
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
            <p className="text-slate-400 flex items-center gap-2">
              <Mail className="text-violet-400 shrink-0" size={18} />
              privacy@gyaanmate.edu · gyaanmate.edu@gmail.com
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
