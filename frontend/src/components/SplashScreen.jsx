import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Utensils, Sparkles, Volume2 } from 'lucide-react';

const SplashScreen = ({ tableNumber = 1, onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Audio unlock helper
  const unlockAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      }
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 300);
          return 100;
        }
        return prev + 4; // ~2.5 seconds total
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    unlockAudio();
    onComplete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#0c0d12] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
      onClick={handleSkip}
    >
      {/* Background Animated Halos */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-red-600 blur-[120px] pointer-events-none"
      />

      {/* Decorative Golden Ring */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="w-36 h-36 rounded-full border border-dashed border-amber-500/40 absolute -inset-3"
        />

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className="w-30 h-30 w-[120px] h-[120px] rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 p-0.5 shadow-2xl shadow-orange-500/30 flex items-center justify-center relative z-10"
        >
          <div className="w-full h-full bg-[#12131c] rounded-[22px] flex items-center justify-center">
            <Flame className="w-16 h-16 text-amber-500 fill-amber-500 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
          </div>
        </motion.div>

        {/* Little floating sparkles */}
        <motion.div
          animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-amber-400"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-amber-400/80 mb-1 block">
          Welcome to
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent filter drop-shadow">
          SPICE ROUTE
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto font-light">
          Authentic Royal Flavors &bull; Dum Handi Specialties
        </p>
      </motion.div>

      {/* Service Mode Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1c27] border border-amber-500/30 text-amber-300 text-xs font-medium shadow-inner"
      >
        <Utensils className="w-3.5 h-3.5 text-amber-400" />
        <span>Digital Menu &bull; Fast Counter Pickup</span>
      </motion.div>

      {/* Progress Bar & Tap to Enter prompt */}
      <div className="mt-10 w-48 flex flex-col items-center">
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-3 font-normal flex items-center gap-1.5 cursor-pointer hover:text-amber-400 transition-colors">
          <Volume2 className="w-3 h-3 text-amber-500/70" />
          Tap anywhere to explore menu
        </p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;

