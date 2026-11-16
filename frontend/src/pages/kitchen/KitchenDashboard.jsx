import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import axiosClient from '../../api/axiosClient';
import { playKitchenNewOrderBeep } from '../../utils/audioAlert';
import {
  ChefHat,
  Clock,
  Utensils,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  FileText,
  Flame,
  ArrowRight,
  Check,
  RefreshCw,
  Ticket,
} from 'lucide-react';

const COLUMNS = [
  {
    id: 'PLACED',
    title: 'New Orders',
    subtitle: 'Waiting for acceptance',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    nextAction: 'Accept Order',
    nextStatus: 'ACCEPTED',
    nextBtnBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
  },
  {
    id: 'ACCEPTED',
    title: 'Accepted',
    subtitle: 'Queued for preparation',
    color: 'from-indigo-600 to-amber-600',
    borderColor: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/20 text-indigo-300',
    nextAction: 'Start Preparing',
    nextStatus: 'PREPARING',
    nextBtnBg: 'bg-gradient-to-r from-indigo-500 to-amber-600 hover:from-indigo-600 hover:to-amber-700',
  },
  {
    id: 'PREPARING',
    title: 'Preparing',
    subtitle: 'Active in tandoor & handis',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    nextAction: 'Mark Ready! 🔔',
    nextStatus: 'READY',
    nextBtnBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20',
  },
  {
    id: 'READY',
    title: 'Ready for Service',
    subtitle: 'Hot & awaiting pickup / waiter',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    nextAction: 'Complete Order ✓',
    nextStatus: 'COMPLETED',
    nextBtnBg: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
  },
];

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Track known order IDs to detect newly arrived orders
  const knownOrderIdsRef = useRef(new Set());
  const initialLoadDone = useRef(false);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await axiosClient.get('/kitchen/orders');
      const activeOrders = res.data || [];

      // Check for newly placed orders
      if (initialLoadDone.current && soundEnabled) {
        const newlyArrived = activeOrders.filter(
          (o) => o.status === 'PLACED' && !knownOrderIdsRef.current.has(o.id)
        );
        if (newlyArrived.length > 0) {
          playKitchenNewOrderBeep();
        }
      }

      // Update known order IDs
      activeOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
      initialLoadDone.current = true;

      setOrders(activeOrders);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to sync kitchen tickets');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => fetchOrders(true), 3000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axiosClient.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      // Refresh state
      await fetchOrders(true);
    } catch (err) {
      alert('Could not update order status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getElapsedTime = (isoDate) => {
    if (!isoDate) return 'Just now';
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins === 1) return '1 min ago';
    return `${mins} mins ago`;
  };

  // Filter orders by column status
  const getOrdersForColumn = (status) => {
    return orders.filter((o) => o.status === status);
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col pb-12 select-none">
      <Navbar />

      <main className="w-full max-w-[1550px] mx-auto px-4 py-5 flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Kitchen Orders Board
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync (3s)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tickets &bull; Food prep, order tokens, customer names, and notes
              </p>
            </div>
          </div>

          {/* Controls: Audio Alert & Quick Stats */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Ticket Beep: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Ticket Beep: Muted</span>
                </>
              )}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchOrders(false)}
              title="Refresh tickets"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-2.5 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Kanban Board 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 items-start">
          {COLUMNS.map((col) => {
            const colOrders = getOrdersForColumn(col.id);

            return (
              <div
                key={col.id}
                className="bg-[#10151f] border border-slate-800/90 rounded-3xl p-4 flex flex-col min-h-[550px] shadow-xl"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base tracking-tight">
                        {col.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${col.badgeBg}`}>
                        {colOrders.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {col.subtitle}
                    </span>
                  </div>
                </div>

                {/* Column Orders List */}
                <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[72vh] pr-1">
                  {colOrders.length === 0 ? (
                    <div className="h-44 border border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs">
                      <span>No orders in {col.title.toLowerCase()}</span>
                    </div>
                  ) : (
                    colOrders.map((order) => {
                      const isUpdating = updatingId === order.id;
                      const isNew = col.id === 'PLACED';

                      return (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`bg-[#151c28] border ${
                            isNew
                              ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                              : 'border-slate-800/90'
                          } rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-slate-700`}
                        >
                          {/* Card Header: Table & Reference & Time */}
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              {/* Big Token Badge */}
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 font-black text-sm border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                                  TOKEN #{order.orderNumber ? order.orderNumber.replace('SR-', '') : order.id?.slice(-4)}
                                </span>
                                {isNew && (
                                  <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white font-extrabold text-[10px] animate-pulse tracking-wide uppercase">
                                    NEW
                                  </span>
                                )}
                              </div>

                              {/* Elapsed Time */}
                              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {getElapsedTime(order.createdAt)}
                              </span>
                            </div>

                            {/* Order Number & Customer Name */}
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/80">
                              <span className="font-mono font-semibold text-slate-300">
                                {order.orderNumber}
                              </span>
                              <span className="truncate max-w-[130px] font-medium text-slate-300">
                                {order.customerName || 'Guest'}
                              </span>
                            </div>

                            {/* Dishes List (Quantities Prominent, No Prices) */}
                            <div className="space-y-2 mb-3">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={`w-2 h-2 rounded-full shrink-0 ${
                                        item.veg ? 'bg-emerald-500' : 'bg-red-500'
                                      }`}
                                    />
                                    <span className="text-white font-bold tracking-tight truncate">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-extrabold text-xs shrink-0 border border-amber-500/20">
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Kitchen Special Note */}
                            {order.note && (
                              <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2">
                                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-amber-400 block text-[10px] uppercase font-bold tracking-wider">
                                    Customer Note:
                                  </strong>
                                  <span className="leading-snug">{order.note}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button: One-way progression */}
                          <div className="pt-2">
                            <button
                              onClick={() => handleUpdateStatus(order.id, col.nextStatus)}
                              disabled={isUpdating}
                              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50 active:scale-98 ${col.nextBtnBg}`}
                            >
                              {isUpdating ? (
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  <span>{col.nextAction}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default KitchenDashboard;
