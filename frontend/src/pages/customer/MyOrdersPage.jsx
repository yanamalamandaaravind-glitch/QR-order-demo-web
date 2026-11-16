import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import {
  Clock,
  ArrowLeft,
  UtensilsCrossed,
  Receipt,
  ChevronRight,
  AlertCircle,
  Calendar,
} from 'lucide-react';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/orders/my');
        setOrders(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">Placed</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">Accepted</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">Preparing</span>;
      case 'READY':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold animate-pulse">Ready!</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">Completed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col pb-16">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto px-4 py-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>

          <span className="text-xs text-slate-400">
            Account: <strong className="text-amber-400">{user?.usernameOrMobile}</strong>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Your Order History
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          All dining orders linked to mobile {user?.usernameOrMobile}
        </p>

        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-3" />
            <p className="text-xs text-slate-400">Retrieving past feasts...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-[#141620] border border-slate-800 rounded-3xl p-10 text-center">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No previous orders</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              You haven't placed any orders with this mobile number yet.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
            >
              Order Now &rarr;
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((ord) => {
              const formattedDate = ord.createdAt
                ? new Date(ord.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <div
                  key={ord.id}
                  className="bg-[#141620] border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/30 transition-all shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                        Token #{ord.orderNumber ? ord.orderNumber.replace('SR-', '') : ord.id?.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formattedDate}</span>
                      </div>
                      {getStatusBadge(ord.status)}
                    </div>
                  </div>

                  {/* Items brief */}
                  <div className="py-3 text-xs text-slate-300">
                    <span className="text-slate-400">Dishes: </span>
                    {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>

                  {/* Footer & Track Link */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Total Paid
                      </span>
                      <span className="text-base font-bold text-amber-400">
                        ₹{ord.grandTotal?.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      to={`/order/${ord.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
