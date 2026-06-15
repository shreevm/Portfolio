'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Mail, User, BookOpen, MessageSquare } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please populate all required fields (Name, Email, Message).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate network submission delay
    setTimeout(() => {
      try {
        // Retrieve and append to local inbox
        const existingMessages = JSON.parse(localStorage.getItem('sv_inbox') || '[]');
        const newMessage = {
          id: Date.now().toString(),
          ...formData,
          dateMs: Date.now(),
          read: false,
        };
        localStorage.setItem('sv_inbox', JSON.stringify([...existingMessages, newMessage]));

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success banner after 5s
        setTimeout(() => setIsSuccess(false), 5000);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('Something went wrong. Please try again.');
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-2xl mx-auto rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 md:p-12 shadow-[0_20px_50px_rgba(249,115,22,0.05)] overflow-hidden"
    >
      {/* Decorative linear orange lighting path */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <h3 className="text-2xl font-sans font-bold text-white tracking-tight text-center md:text-left mb-2">
        Let&apos;s Construct Something Exceptional
      </h3>
      <p className="text-sm text-gray-400 font-sans tracking-wide text-center md:text-left mb-8">
        Have questions about 3D neural rendering pipelines, AI diagnostics, or looking to collaborate? Drop a message directly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-wider text-gray-400 uppercase flex items-center gap-1">
              <User size={12} className="text-orange-400/80" /> Name <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Shree Varaa"
                className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 hover:bg-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-wider text-gray-400 uppercase flex items-center gap-1">
              <Mail size={12} className="text-orange-400/80" /> Email <span className="text-orange-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 hover:bg-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono tracking-wider text-gray-400 uppercase flex items-center gap-1">
            <BookOpen size={12} className="text-orange-400/80" /> Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Collaboration Opportunities"
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 hover:bg-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono tracking-wider text-gray-400 uppercase flex items-center gap-1">
            <MessageSquare size={12} className="text-orange-400/80" /> Message <span className="text-orange-500">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, timeline, or research focus..."
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 hover:bg-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Action button & Feedback */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs font-mono border border-red-500/20 bg-red-950/20 px-4 py-2 rounded-lg w-full text-center"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-green-400 text-xs font-mono border border-green-500/20 bg-green-950/20 px-4 py-3 rounded-lg w-full text-center"
              >
                <CheckCircle size={14} className="text-green-400" />
                Message deployed successfully! I&apos;ll be in touch soon.
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.99] font-sans font-medium text-white px-8 py-3.5 transition-all text-sm cursor-pointer shadow-lg shadow-orange-950/30 ${
              isSubmitting || isSuccess ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Transmit Message</span>
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
