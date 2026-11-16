import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

const DepthScrollTunnel = ({ items, onActiveChange }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flyEffect, setFlyEffect] = useState(null); // { id: string, name: string }

  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const lastScrollTime = useRef(0);

  // Keep index within bounds if items change (e.g., after filter)
  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, currentIndex]);

  useEffect(() => {
    onActiveChange?.(items[currentIndex]);
  }, [currentIndex, items, onActiveChange]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Wheel listener with throttle
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 280) return;

    if (e.deltaY > 20 || e.deltaX > 20) {
      lastScrollTime.current = now;
      goNext();
    } else if (e.deltaY < -20 || e.deltaX < -20) {
      lastScrollTime.current = now;
      goPrev();
    }
  };

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;

    // Detect either vertical swipe up/down or horizontal swipe left/right
    if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
      if (diffX > 40 || diffY > 40) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm">
        No dishes match your selection. Try clearing filters.
      </div>
    );
  }

  // Window of cards to render for performance and smooth 3D staging (-2 to +3)
  const visibleCards = [];
  for (let offset = -2; offset <= 3; offset++) {
    const index = currentIndex + offset;
    if (index >= 0 && index < items.length) {
      visibleCards.push({ item: items[index], offset, index });
    }
  }

  const handleAddWithFly = (item) => {
    addToCart(item);
    setFlyEffect({ id: item.id, name: item.name });
    setTimeout(() => setFlyEffect(null), 900);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[580px] sm:h-[620px] flex flex-col items-center justify-center select-none overflow-hidden py-4"
    >
      {/* 3D Scene Viewport with Perspective */}
      <div
        className="relative w-full max-w-sm sm:max-w-md h-[480px] sm:h-[500px] flex items-center justify-center"
        style={{ perspective: 1100 }}
      >
        <AnimatePresence initial={false}>
          {visibleCards.map(({ item, offset, index }) => {
            const isCenter = offset === 0;
            const cartItem = cart.find((c) => c.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            // 3D Transform calculations based on depth offset
            let z = 0;
            let y = 0;
            let scale = 1;
            let opacity = 1;
            let blur = 0;
            let zIndex = 30;

            if (offset === 0) {
              z = 0;
              y = 0;
              scale = 1;
              opacity = 1;
              blur = 0;
              zIndex = 40;
            } else if (offset > 0) {
              // Cards deeper in the tunnel (future)
              z = -offset * 160;
              y = -offset * 28;
              scale = Math.max(0.7, 1 - offset * 0.12);
              opacity = Math.max(0.1, 0.9 - offset * 0.28);
              blur = offset * 3;
              zIndex = 30 - offset;
            } else {
              // Cards that passed behind camera (past)
              z = offset * 140;
              y = Math.abs(offset) * 45;
              scale = Math.max(0.75, 1 - Math.abs(offset) * 0.15);
              opacity = Math.max(0, 0.5 - Math.abs(offset) * 0.25);
              blur = Math.abs(offset) * 4;
              zIndex = 30 - Math.abs(offset);
            }

            return (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                initial={{ opacity: 0, scale: 0.8, z: -300 }}
                animate={{
                  opacity,
                  scale,
                  z,
                  y,
                  filter: `blur(${blur}px)`,
                }}
                exit={{ opacity: 0, scale: 0.7, z: -400 }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 24,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute w-[310px] sm:w-[360px] rounded-3xl bg-[#141620] border ${
                  isCenter
                    ? 'border-amber-500/50 shadow-2xl shadow-orange-500/20'
                    : 'border-slate-800/80 cursor-pointer opacity-80'
                } overflow-hidden transition-colors flex flex-col`}
              >
                {/* Image Section */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141620] via-transparent to-black/40" />

                  {/* Veg / Non-Veg Dot Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.veg
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                          : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      }`}
                    />
                    <span>{item.veg ? 'Veg' : 'Non-Veg'}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium backdrop-blur-md">
                    {item.category}
                  </div>

                  {/* Prep time badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.preparationTimeMinutes || 15} mins</span>
                  </div>
                </div>

                {/* Card Content Section */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                        Price
                      </span>
                      <span className="text-2xl font-black text-amber-400 tracking-tight">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Add / Quantity Stepper (Only active on center card) */}
                    {isCenter ? (
                      quantity === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddWithFly(item);
                          }}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Plate</span>
                        </motion.button>
                      ) : (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 bg-[#1a1c28] border border-amber-500/40 rounded-xl p-1 shadow-inner"
                        >
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <span className="font-bold text-sm text-amber-400 px-2 min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center transition-colors shadow"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      )
                    ) : (
                      <span className="text-xs text-amber-400/70 font-medium">
                        Tap to view
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Fly-to-Cart Toast Animation */}
      <AnimatePresence>
        {flyEffect && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: 1, y: 80, scale: 1 }}
            exit={{ opacity: 0, y: 150, scale: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Added {flyEffect.name}!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls: Prev / Next Buttons & Depth Index Indicator */}
      <div className="mt-4 flex items-center justify-between w-full max-w-sm px-4 z-20">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          title="Previous Dish (Left/Up arrow)"
          className="p-3 rounded-2xl bg-[#161822] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Index Pill */}
        <div className="px-4 py-1.5 rounded-full bg-[#161822] border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong className="text-amber-400">{currentIndex + 1}</strong> / {items.length}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === items.length - 1}
          title="Next Dish (Right/Down arrow)"
          className="p-3 rounded-2xl bg-[#161822] border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Hint */}
      <p className="text-[11px] text-slate-500 mt-2 font-light">
        Swipe or scroll mouse wheel to move through the flavor tunnel
      </p>
    </div>
  );
};

export default DepthScrollTunnel;

