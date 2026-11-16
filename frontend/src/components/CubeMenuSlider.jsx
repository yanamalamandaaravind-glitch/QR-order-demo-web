import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Check,
  RotateCw,
} from 'lucide-react';

const CARD_WIDTH = 340; // width of each cube face in px
const TRANSLATE_Z = CARD_WIDTH / 2; // 170px

const CubeMenuSlider = ({ items, onActiveChange }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedItemAnim, setAddedItemAnim] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const currentDragXRef = useRef(0);
  const lastScrollTime = useRef(0);

  // Keep index within bounds
  useEffect(() => {
    if (items.length > 0 && currentIndex >= items.length) {
      setCurrentIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, currentIndex]);

  useEffect(() => {
    if (items[currentIndex]) {
      onActiveChange?.(items[currentIndex]);
    }
  }, [currentIndex, items, onActiveChange]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0)); // loop or stop
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

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

  // Smooth mouse wheel listener with debounce
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 320) return;

    if (e.deltaY > 25 || e.deltaX > 25) {
      lastScrollTime.current = now;
      goNext();
    } else if (e.deltaY < -25 || e.deltaX < -25) {
      lastScrollTime.current = now;
      goPrev();
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    currentDragXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentDragXRef.current = e.touches[0].clientX;
    const diff = currentDragXRef.current - startXRef.current;
    // Limit drag resistance
    setDragOffset(Math.max(-80, Math.min(80, diff)));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = currentDragXRef.current - startXRef.current;
    if (diff < -40) {
      goNext();
    } else if (diff > 40) {
      goPrev();
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    // Only drag on left mouse button and not on interactive buttons
    if (e.button !== 0 || e.target.closest('button')) return;
    startXRef.current = e.clientX;
    currentDragXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    currentDragXRef.current = e.clientX;
    const diff = currentDragXRef.current - startXRef.current;
    setDragOffset(Math.max(-80, Math.min(80, diff)));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = currentDragXRef.current - startXRef.current;
    if (diff < -50) {
      goNext();
    } else if (diff > 50) {
      goPrev();
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemAnim(item.id);
    setTimeout(() => setAddedItemAnim(null), 800);
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm">
        No dishes match your selection. Try clearing filters.
      </div>
    );
  }

  // Calculate rotation angle
  // Each index corresponds to 90 degrees around Y-axis
  const baseRotation = -currentIndex * 90;
  // Convert drag offset into rotation degrees (approx 0.35 deg per pixel)
  const dragRotation = isDragging ? (dragOffset / CARD_WIDTH) * 90 : 0;
  const currentRotation = baseRotation + dragRotation;

  // Window of faces to render (only currentIndex - 1, currentIndex, currentIndex + 1)
  // This guarantees 60fps buttery performance!
  const renderedIndices = [];
  for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
    if (i >= 0 && i < items.length) {
      renderedIndices.push(i);
    }
  }

  const activeItem = items[currentIndex];
  const activeCartItem = activeItem ? cart.find((c) => c.id === activeItem.id) : null;
  const activeQuantity = activeCartItem ? activeCartItem.quantity : 0;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full flex flex-col items-center justify-center select-none py-6 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Top 3D Cube Status & Controls */}
      <div className="w-full max-w-md px-4 flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 text-amber-400 animate-spin-slow" />
            3D Cube View
          </span>
          <span className="text-slate-400 font-medium">
            Dish {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Next / Prev Quick Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous Dish"
            className="w-8 h-8 rounded-full bg-[#181a24] hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-800 flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next Dish"
            className="w-8 h-8 rounded-full bg-[#181a24] hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-800 flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Cube Stage Viewport */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${CARD_WIDTH}px`,
          height: '510px',
          perspective: '1200px',
        }}
      >
        {/* The Rotating 3D Cube Box */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${TRANSLATE_Z}px) rotateY(${currentRotation}deg)`,
            transition: isDragging
              ? 'none'
              : 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {renderedIndices.map((idx) => {
            const item = items[idx];
            const isCenter = idx === currentIndex;
            const cartItem = cart.find((c) => c.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const isJustAdded = addedItemAnim === item.id;

            // Face angle in degrees
            const faceAngle = idx * 90;

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${CARD_WIDTH}px`,
                  height: '500px',
                  transform: `rotateY(${faceAngle}deg) translateZ(${TRANSLATE_Z}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`rounded-3xl bg-[#141622] border ${
                  isCenter
                    ? 'border-amber-500/60 shadow-2xl shadow-orange-500/25 ring-1 ring-amber-500/30'
                    : 'border-slate-800/80 shadow-lg'
                } overflow-hidden flex flex-col justify-between transition-colors`}
              >
                {/* Dish Image with Overlays */}
                <div className="relative w-full h-56 bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141622] via-transparent to-black/30 pointer-events-none" />

                  {/* Veg / Non-Veg Indicator & Category Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg bg-black/70 backdrop-blur-md flex items-center justify-center border ${
                        item.veg ? 'border-emerald-500/60' : 'border-red-500/60'
                      }`}
                      title={item.veg ? 'Vegetarian' : 'Non-Vegetarian'}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.veg ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/40">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Dish Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-black text-white tracking-tight leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-lg font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent shrink-0">
                        ₹{Number(item.price).toFixed(0)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {item.description || 'Prepared fresh with aromatic spices and royal recipes.'}
                    </p>
                  </div>

                  {/* Action Bar / Quantity Controls */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    {quantity > 0 ? (
                      <div className="flex items-center gap-3 bg-[#1e2230] p-1.5 rounded-2xl border border-amber-500/30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, quantity - 1);
                          }}
                          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-extrabold text-amber-400 w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, quantity + 1);
                          }}
                          className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center transition-all shadow-md shadow-orange-500/20 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.available) handleAddToCart(item);
                        }}
                        disabled={!item.available}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                          item.available
                            ? isJustAdded
                              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-orange-500/25 active:scale-98'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Feast!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to Order</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cube Rotation Indicators & Navigation Dots */}
      <div className="flex items-center gap-1.5 mt-5 max-w-xs overflow-x-auto py-1 px-3">
        {items.slice(0, 15).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm shadow-orange-500/50'
                : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
        {items.length > 15 && (
          <span className="text-[10px] text-slate-500 ml-1">+{items.length - 15}</span>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-2 font-light">
        Swipe or drag horizontally to rotate the 3D cube
      </p>
    </div>
  );
};

export default CubeMenuSlider;
