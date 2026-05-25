import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from '../../lib/icons';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fadeInUp } from '../../animations/motionVariants';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Message sent successfully!');
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@gyaanmate.com',
      link: 'mailto:support@gyaanmate.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Learning Street, Education City, ED 12345',
      link: null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6">
          <MessageCircle size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300 font-medium">Contact Us</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-white">Get in</span>
          <span className="gradient-text"> Touch</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-1 space-y-4"
        >
          {contactInfo.map((info, index) => (
            <motion.div key={info.title} variants={fadeInUp}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20">
                    <info.icon size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-slate-400 hover:text-indigo-400 transition"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-slate-400">{info.value}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold gradient-text mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <Input
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/60 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                loading={loading}
                size="lg"
                icon={Send}
                iconPosition="right"
                className="w-full md:w-auto"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-bold gradient-text mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: 'How do I get started with GyaanMate?',
              a: 'Simply sign up for a free account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately!',
            },
            {
              q: 'Are the courses free?',
              a: 'We offer both free and paid courses. Free courses give you access to basic content, while paid courses provide comprehensive learning materials and certificates.',
            },
            {
              q: 'Can I get a refund?',
              a: 'Yes, we offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied, contact our support team.',
            },
            {
              q: 'How do I contact support?',
              a: 'You can reach our support team via email at support@gyaanmate.com or use the contact form above. We typically respond within 24 hours.',
            },
          ].map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-slate-400 text-sm">{faq.a}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
