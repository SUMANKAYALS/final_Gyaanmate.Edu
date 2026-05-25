import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck } from '../../lib/icons';
import Card from '../../components/ui/Card';
import { fadeInUp } from '../../animations/motionVariants';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, enroll in courses, or communicate with us. This may include your name, email address, payment information, and learning progress data.',
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: 'We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and personalize your learning experience with AI-powered recommendations.',
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who perform services on our behalf, with your consent, or as required by law. We never share your data with third parties for marketing purposes.',
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can also opt-out of marketing communications and manage your privacy settings through your account dashboard.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
          <Shield size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300 font-medium">Privacy Policy</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">Your Privacy</span>
          <span className="gradient-text"> Matters</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      {/* Introduction */}
      <Card className="p-8 mb-8">
        <p className="text-slate-300 leading-relaxed">
          At GyaanMate, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform. By using GyaanMate, you agree to the practices described in this policy.
        </p>
      </Card>

      {/* Privacy Sections */}
      <div className="space-y-6 mb-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 flex-shrink-0">
                  <section.icon size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                  <p className="text-slate-400 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Data Security</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
        </p>
        <p className="text-slate-300 leading-relaxed">
          However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Cookies</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          We use cookies and similar tracking technologies to collect information about your browsing activities on our platform. Cookies help us remember your preferences, improve your experience, and analyze usage patterns.
        </p>
        <p className="text-slate-300 leading-relaxed">
          You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our platform.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Children's Privacy</h2>
        <p className="text-slate-300 leading-relaxed">
          GyaanMate is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
        </p>
      </Card>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Changes to This Policy</h2>
        <p className="text-slate-300 leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </Card>

      {/* Contact */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold gradient-text mb-4">Contact Us</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <div className="space-y-2 text-slate-400">
          <p>Email: privacy@gyaanmate.com</p>
          <p>Address: 123 Learning Street, Education City, ED 12345</p>
        </div>
      </Card>
    </div>
  );
}
