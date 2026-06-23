'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface VideoIntroProps {
  onScrollNext: () => void;
}

export function VideoIntro({ onScrollNext }: VideoIntroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  
  // Audio Web API references
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide sound hint after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSoundHint(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Web Audio Synth engine: generates a lush warm cinematic ambient soundscape
  const startAudioEngine = () => {
    try {
      if (audioContextRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Master Gain for mute/volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Primary warm low drone (C2 - 65.41 Hz)
      const osc1 = ctx.createOscillator();
      const filter1 = ctx.createBiquadFilter();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2
      
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(220, ctx.currentTime); // very warm low pass filter
      filter1.Q.setValueAtTime(1.0, ctx.currentTime);

      osc1.connect(filter1);
      filter1.connect(masterGain);
      osc1.start();
      oscillatorsRef.current.push(osc1);
      filtersRef.current.push(filter1);

      // Harmonizing pad (G2 - 98.00 Hz)
      const osc2 = ctx.createOscillator();
      const filter2 = ctx.createBiquadFilter();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(98.00, ctx.currentTime); // G2

      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(180, ctx.currentTime);

      osc2.connect(filter2);
      filter2.connect(masterGain);
      osc2.start();
      oscillatorsRef.current.push(osc2);
      filtersRef.current.push(filter2);

      // Low-frequency filter sweep to simulate practical lighting atmospheric changes (organic feel)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // ultra slow sweep 12.5s cycle
      lfoGain.gain.setValueAtTime(60, ctx.currentTime); // frequency dev

      lfo.connect(lfoGain);
      lfoGain.connect(filter1.frequency); // sweeps filter1
      lfoGain.connect(filter2.frequency); // sweeps filter2
      lfo.start();
      oscillatorsRef.current.push(lfo);

      // Play soft bell/echo chimes overlay iteratively
      const playChime = () => {
        if (!audioContextRef.current || isMuted || !isPlaying) return;
        const now = audioContextRef.current.currentTime;
        
        // Pentatonic C major notes (E4, G4, A4, C5, D5, E5)
        const notes = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];

        const oscPrivate = audioContextRef.current.createOscillator();
        const gainPrivate = audioContextRef.current.createGain();
        const delayPrivate = audioContextRef.current.createDelay();
        const feedbackPrivate = audioContextRef.current.createGain();

        oscPrivate.type = 'sine';
        oscPrivate.frequency.setValueAtTime(randomNote, now);

        // Slow soft volume envelope
        gainPrivate.gain.setValueAtTime(0, now);
        gainPrivate.gain.linearRampToValueAtTime(0.05, now + 0.5); // soft strike
        gainPrivate.gain.exponentialRampToValueAtTime(0.0001, now + 5.0); // long decay

        // Echo/delay setup (warm space effects)
        delayPrivate.delayTime.setValueAtTime(0.4, now);
        feedbackPrivate.gain.setValueAtTime(0.4, now);

        oscPrivate.connect(gainPrivate);
        gainPrivate.connect(masterGain);
        
        // Delay loop
        gainPrivate.connect(delayPrivate);
        delayPrivate.connect(feedbackPrivate);
        feedbackPrivate.connect(delayPrivate); // feedback
        delayPrivate.connect(masterGain); // output echo

        oscPrivate.start(now);
        oscPrivate.stop(now + 6.0);
      };

      intervalRef.current = setInterval(playChime, 3200);
    } catch (e) {
      console.error('Failed to initialize ambient audio synth', e);
    }
  };

  const handleMuteToggle = () => {
    // Resume audio context if suspended (browser security)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Start engine if not already running
    if (!audioContextRef.current) {
      startAudioEngine();
    }

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setShowSoundHint(false);

    if (masterGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.linearRampToValueAtTime(nextMuted ? 0 : 0.25, now + 0.8);
    }
  };

  const handlePlayToggle = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (masterGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      // Fade volume
      masterGainRef.current.gain.linearRampToValueAtTime(
        nextPlaying && !isMuted ? 0.25 : 0, 
        now + 0.5
      );
    }
  };

  // Cleanup synth resources on unmount to prevent leaks
  useEffect(() => {
    const currentOscillators = oscillatorsRef.current;
    const currentInterval = intervalRef.current;
    const currentAudioContext = audioContextRef.current;
    return () => {
      if (currentInterval) clearInterval(currentInterval);
      currentOscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      if (currentAudioContext) {
        currentAudioContext.close();
      }
    };
  }, []);

  return (
    <div id="video-intro-container" className="relative w-full h-screen flex flex-col items-center justify-between overflow-hidden bg-black text-white px-6 md:px-12 py-8 select-none">
      
      {/* Cinematic Workspace Portrait background, with slow Ken Burns movement, vignette overlay & lighting gradients */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ 
            scale: isPlaying ? 1.05 : 1.15, 
            opacity: 0.45 
          }}
          transition={{ duration: 15, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/grace_hopper_2025.jpg"
            alt="Shree Varaa"
            fill
            className="object-cover object-center"
            priority
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Deep vignette, cinematic warm orange lighting maps and cool blue monitor glow overlay */}
        <div id="grad-overlay" className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(0,0,0,0.95)_100%] bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />
        <div id="orange-spotlight" className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl mix-blend-screen pointer-events-none" />
        <div id="blue-glow" className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl mix-blend-screen pointer-events-none" />
      </div>

      {/* Header Bar */}
      <div className="relative w-full flex items-center justify-between z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex items-center gap-2"
        >
          <div className="p-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Sparkles size={16} />
          </div>
          <span className="font-mono text-xs tracking-[0.25em] text-gray-400 uppercase">
            SVM
          </span>
        </motion.div>

        {/* Ambient Controls with Glassmorphism styling */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          {/* Play/Pause control */}
          <button
            id="play-pause-btn"
            onClick={handlePlayToggle}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 active:scale-95 transition-all text-white backdrop-blur-md cursor-pointer"
            title={isPlaying ? "Pause cinematic background" : "Play cinematic background"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          {/* Mute/Unmute control with dynamic floating tip indicator */}
          <div className="relative">
            <button
              id="mute-unmute-btn"
              onClick={handleMuteToggle}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-orange-500/30 bg-orange-950/20 hover:bg-orange-950/40 text-orange-400 active:scale-95 transition-all backdrop-blur-md cursor-pointer"
              title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
            </button>

            {/* Ambient Soundscape Prompt */}
            <AnimatePresence>
              {showSoundHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-12 top-0 mt-[4px] whitespace-nowrap bg-orange-950/80 border border-orange-500/20 text-orange-200 text-xs px-3 py-1.5 rounded-lg backdrop-blur-md font-mono pointer-events-none"
                >
                  🎧 Experience ambient workspace audio!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Main Landing Content Frame */}
      <div className="relative z-20 flex flex-col items-center text-center justify-center flex-grow max-w-4xl pt-12 md:pt-0">
        


        {/* Large Bold Stacked First and Last Name */}
        <h1 className="flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-sans font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            SHREE VARAA
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-sans font-black tracking-tighter text-orange-400 uppercase leading-none mt-2 select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            MANGAI V
          </motion.span>
        </h1>
                {/* uppercase tags */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="text-xs md:text-sm text-orange-400/90 font-mono uppercase font-semibold mb-4 tracking-[0.35em]"
        >
          AI/ML RESEARCHER • MACHINE LEARNING ENGINEER
        </motion.div>

        {/* Short Premium description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          className="text-sm md:text-lg text-gray-300 font-sans mt-8 max-w-xl font-light tracking-wide leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
        >
          MS AI Systems @ University of Florida (GPA 3.90). I build full-stack AI systems, RAG pipelines, video hallucination benchmarks, 3D reconstruction, and multimodal models. Previously at Ford Motor Company and AGIS Inc. Open to full-stack AI engineering, data science and Software Engineering roles.
        </motion.p>

        {/* High GPA & Affiliation badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 1.0, ease: 'easeOut' }}
          className="flex items-center gap-4 mt-6 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 text-xs text-orange-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            UF MS AI Systems
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="text-xs text-gray-300 font-mono">
            GPA: <span className="text-white font-semibold">3.90 / 4.0</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll indicator with pulsing vertical line */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.button
          id="scroll-indicator-button"
          onClick={onScrollNext}
          whileHover={{ y: 3 }}
          className="flex flex-col items-center text-gray-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            EXPLORE WORK
          </span>
          {/* Vertical pulse line */}
          <div className="w-px h-12 bg-white/20 relative overflow-hidden rounded">
            <motion.div
              animate={{ 
                y: [-48, 48] 
              }}
              transition={{ 
                duration: 2.0, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-orange-400 to-transparent"
            />
          </div>
          <ChevronDown size={14} className="mt-1 animate-bounce text-orange-400" />
        </motion.button>
      </div>
    </div>
  );
}
