import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Navbar from '../../components/Navbar';
import axiosClient from '../../api/axiosClient';
import { playReadyChime } from '../../utils/audioAlert';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  UtensilsCrossed,
  ArrowLeft,
  Sparkles,
  Receipt,
  AlertCircle,
  FastForward,
} from 'lucide-react';

const STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Sent to the royal kitchen' },
  { key: 'ACCEPTED', label: 'Accepted', desc: 'Chef acknowledged order' },
  { key: 'PREPARING', label: 'Preparing', desc: 'Slow-cooking in handi & tandoor' },
  { key: 'READY', label: 'Ready to Serve', desc: 'Fresh & piping hot' },
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAlertedReady, setHasAlertedReady] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const prevStatusRef = useRef(null);

  // Poll backend every 3 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const res = await axiosClient.get(`/orders/${id}`);
        if (!isMounted) return;

        const currentOrder = res.data;
        setOrder(currentOrder);

        // Check if status transitioned to READY
        if (
          currentOrder.status === 'READY' &&
          prevStatusRef.current !== 'READY' &&
          !hasAlertedReady
        ) {
          triggerReadyCelebration();
          setHasAlertedReady(true);
        }

        prevStatusRef.current = currentOrder.status;
        setError('');
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to fetch order status');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, hasAlertedReady]);

  const triggerReadyCelebration = () => {
    // Play bell audio chime & phone vibration
    playReadyChime();

    // Trigger colorful confetti shower
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ea580c', '#10b981', '#3b82f6', '#ec4899'],
    });
  };

  // Helper for demo simulation button: advance order state forward
  const handleSimulateNextStep = async () => {
    if (!order) return;
    setSimulating(true);

    let nextStatus = null;
    if (order.status === 'PLACED') nextStatus = 'ACCEPTED';
    else if (order.status === 'ACCEPTED') nextStatus = 'PREPARING';
    else if (order.status === 'PREPARING') nextStatus = 'READY';
    else if (order.status === 'READY') nextStatus = 'COMPLETED';

    if (!nextStatus) {
      setSimulating(false);
      return;
    }

    try {
      const res = await axiosClient.patch(`/orders/${order.id}/status`, {
        status: nextStatus,
      });
      setOrder(res.data);
      if (nextStatus === 'READY') {
        triggerReadyCelebration();
        setHasAlertedReady(true);
      }
    } catch (err) {
      alert('Could not update status: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'READY':
      case 'COMPLETED': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;
  const isReady = order?.status === 'READY' || order?.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col pb-16">
      <Navbar />

      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>

          {order && (
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              TOKEN #{order.orderNumber ? order.orderNumber.replace('SR-', '') : order.id?.slice(-4)}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-amber-500 mb-3" />
            <p className="text-xs sm:text-sm text-slate-400">Loading order tracking...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* BIG READY BANNER (When order status is READY) */}
            <AnimatePresence>
              {isReady && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 animate-bounce">
                      <BellRing className="w-7 h-7 text-white fill-white/40" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-black uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" />
                        Order Is Ready!
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                        Your royal feast is ready!
                      </h2>
                      <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
                        Please collect your feast at the pickup counter by showing <strong>TOKEN #{order.orderNumber ? order.orderNumber.replace('SR-', '') : order.id?.slice(-4)}</strong> ({order.customerName || 'Guest'}).
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Progress Stepper Card */}
            <div className="bg-[#141620] border border-slate-800/90 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <h3 className="text-lg font-black text-amber-400 tracking-tight">
                    {order.orderNumber}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Status Polling</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live (every 3s)
                  </span>
                </div>
              </div>

              {/* Stepper Graphic */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Step Circle Marker */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
                            : isCurrent
                            ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/40 animate-pulse'
                            : 'bg-[#1a1c28] border-slate-700 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Info */}
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-amber-400 text-base'
                              : isCompleted
                              ? 'text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulation Helper Panel for Demo Testing */}
              <div className="mt-8 pt-5 border-t border-slate-800/80 bg-[#10121a] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 text-center sm:text-left">
                  <span className="font-semibold text-amber-300 block">
                    Interactive Demo Controls:
                  </span>
                  <span>Simulate kitchen status transition without switching tabs.</span>
                </div>
                <button
                  onClick={handleSimulateNextStep}
                  disabled={simulating || order.status === 'COMPLETED'}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  <FastForward className="w-4 h-4" />
                  <span>
                    {order.status === 'PLACED'
                      ? 'Simulate -> Accept'
                      : order.status === 'ACCEPTED'
                      ? 'Simulate -> Preparing'
                      : order.status === 'PREPARING'
                      ? 'Simulate -> Ready!'
                      : 'Order Completed'}
                  </span>
                </button>
              </div>
            </div>

            {/* Order Items & Summary */}
            <div className="bg-[#141620] border border-slate-800/90 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Dishes in This Order</span>
              </div>

              <div className="divide-y divide-slate-800/80 my-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.veg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-slate-400 font-semibold">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-200">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {order.note && (
                <div className="p-3 bg-[#10121a] rounded-xl text-xs text-slate-400 mb-4 border border-slate-800">
                  <strong className="text-amber-400">Kitchen Note:</strong> {order.note}
                </div>
              )}

              {/* Totals */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({order.gstPercentage}%):</span>
                  <span className="text-white font-medium">₹{order.gstAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total Paid:</span>
                  <span className="text-amber-400 font-black">₹{order.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTrackingPage;
