import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import axiosClient from '../../api/axiosClient';
import AdminMenuTab from '../../components/admin/AdminMenuTab';
import AdminSettingsTab from '../../components/admin/AdminSettingsTab';
import AdminReportsTab from '../../components/admin/AdminReportsTab';
import AdminQrGeneratorTab from '../../components/admin/AdminQrGeneratorTab';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  Award,
  Users,
  Search,
  ChefHat,
  RefreshCw,
  AlertCircle,
  UtensilsCrossed,
  Sliders,
  FileText,
  QrCode,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'menu' | 'customers' | 'reports' | 'qr' | 'settings'
  const [timeRange, setTimeRange] = useState('month'); // 'today' | 'week' | 'month'

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Customer search
  const [customerSearch, setCustomerSearch] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, customersRes] = await Promise.all([
        axiosClient.get(`/admin/stats?range=${timeRange}`),
        axiosClient.get('/admin/orders'),
        axiosClient.get('/admin/customers'),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load executive metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const numMatch = o.orderNumber?.toLowerCase().includes(q);
      const nameMatch = o.customerName?.toLowerCase().includes(q);
      const mobMatch = o.customerMobile?.includes(q);
      if (!numMatch && !nameMatch && !mobMatch) return false;
    }
    return true;
  });

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase().trim();
    return (
      c.customerName?.toLowerCase().includes(q) ||
      c.customerMobile?.includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">Placed</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">Accepted</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">Preparing</span>;
      case 'READY':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold animate-pulse">Ready</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">Completed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-100 flex flex-col pb-16">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Executive Operations Suite
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                  HQ Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Financial Analytics &bull; Orders &bull; Menu &bull; Reports &bull; QR Signage
              </p>
            </div>
          </div>

          {/* Quick Actions (Kitchen Board Link & Refresh) */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              to="/kitchen"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span>Open Kitchen Board</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              title="Refresh Analytics"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (All Admin Capabilities) */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'menu'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu Management</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF & CSV Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Restaurant QR Stand</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-2.5 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Range Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Key Performance Indicators
              </h2>
              <div className="bg-[#141420] border border-slate-800 rounded-xl p-1 flex items-center gap-1">
                {['today', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      timeRange === range
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {range === 'today' ? "Today" : range === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 KPI Metric Cards */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {/* Total Sales */}
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    ₹{stats.totalSales?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
                    Gross restaurant revenue
                  </span>
                </div>

                {/* Total Orders */}
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[11px] text-blue-400 mt-1 block font-medium">
                    Completed & dining orders
                  </span>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    ₹{stats.averageOrderValue?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-amber-400 mt-1 block font-medium">
                    Per patron order spend
                  </span>
                </div>

                {/* GST Collected */}
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">GST Collected</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    ₹{stats.totalGstCollected?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-indigo-400 mt-1 block font-medium">
                    Tax liability reserve
                  </span>
                </div>

                {/* Total Profit */}
                <div className="bg-[#141420] border border-purple-500/30 rounded-3xl p-4 sm:p-5 shadow-lg col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-950/20 to-transparent">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                      Total Profit
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-400 tracking-tight">
                    ₹{stats.totalProfit?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-purple-300/80 mt-1 block font-medium">
                    Selling minus ingredient cost
                  </span>
                </div>
              </div>
            )}

            {/* Sales & Profit Velocity Chart */}
            {stats?.salesTrend && stats.salesTrend.length > 0 && (
              <div className="bg-[#141420] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Sales & Profit Velocity
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Daily gross sales revenue vs net profit margins (₹)
                    </p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#232638" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161824', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="sales" name="Gross Sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                      <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Selling Dishes & Peak Dining Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats?.topSellingItems && (
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    Top Selling Dishes
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Dishes by total portions ordered
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.topSellingItems} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232638" />
                        <XAxis type="number" stroke="#64748b" fontSize={11} />
                        <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={11} width={110} tickFormatter={(name) => name.length > 14 ? name.substring(0, 14) + '...' : name} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#161824', borderColor: '#334155', borderRadius: '12px' }}
                          formatter={(val, name) => [val, name === 'quantity' ? 'Portions Sold' : name]}
                        />
                        <Bar dataKey="quantity" name="Portions Sold" fill="#ea580c" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {stats?.peakHours && (
                <div className="bg-[#141420] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    Peak Dining Hours
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Rush breakdown showing lunch & dinner rushes
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.peakHours} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232638" />
                        <XAxis dataKey="hourLabel" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#161824', borderColor: '#334155', borderRadius: '12px' }}
                          formatter={(val, name) => [val, name === 'orderCount' ? 'Orders Placed' : name]}
                        />
                        <Bar dataKey="orderCount" name="Orders Placed" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-[#141420] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID (SR-...), customer name, or mobile..."
                  className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      orderStatusFilter === st
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#0d0d16] border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'ALL' ? 'All Status' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#141420] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#10101a] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Token #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date / Time</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No orders found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const dateStr = ord.createdAt
                          ? new Date(ord.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A';

                        return (
                          <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
                                Token #{ord.orderNumber ? ord.orderNumber.replace('SR-', '') : ord.id?.slice(-4)}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-white block">
                                {ord.customerName}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {ord.customerMobile}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-[200px] truncate">
                              {ord.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              ₹{ord.grandTotal?.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(ord.status)}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {dateStr}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-medium border border-purple-500/30 transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <AdminMenuTab />
        )}

        {/* TAB 4: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-[#141420] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer by name or 10-digit mobile..."
                  className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {filteredCustomers.length} registered diners
              </span>
            </div>

            <div className="bg-[#141420] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#10101a] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Mobile Number</th>
                      <th className="py-3.5 px-4">Total Orders</th>
                      <th className="py-3.5 px-4">Lifetime Spend</th>
                      <th className="py-3.5 px-4">Last Dining Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          No customer records found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust, idx) => {
                        const dateStr = cust.lastOrderDate
                          ? new Date(cust.lastOrderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A';

                        return (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center text-[11px]">
                                {cust.customerName?.charAt(0) || 'G'}
                              </div>
                              <span>{cust.customerName}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {cust.customerMobile}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                                {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-black text-amber-400 text-sm">
                              ₹{cust.totalSpent?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {dateStr}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PDF & CSV REPORTS */}
        {activeTab === 'reports' && (
          <AdminReportsTab />
        )}

        {/* TAB 6: TABLE QR GENERATOR */}
        {activeTab === 'qr' && (
          <AdminQrGeneratorTab />
        )}

        {/* TAB 7: RESTAURANT SETTINGS */}
        {activeTab === 'settings' && (
          <AdminSettingsTab />
        )}
      </main>

      {/* Order Inspection Modal */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#161824] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Order Details
                  </span>
                  <h3 className="font-mono font-bold text-lg text-amber-400">
                    {selectedOrderDetails.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 bg-[#11131c] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Token #:</span>
                  <span className="font-bold text-amber-400 text-sm">Token #{selectedOrderDetails.orderNumber ? selectedOrderDetails.orderNumber.replace('SR-', '') : selectedOrderDetails.id?.slice(-4)}</span>
                </div>
                <div className="p-3 bg-[#11131c] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Customer:</span>
                  <span className="font-bold text-white">{selectedOrderDetails.customerName} ({selectedOrderDetails.customerMobile})</span>
                </div>
                <div className="p-3 bg-[#11131c] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Status:</span>
                  <span className="font-bold">{getStatusBadge(selectedOrderDetails.status)}</span>
                </div>
                <div className="p-3 bg-[#11131c] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Payment:</span>
                  <span className="font-bold text-emerald-400">{selectedOrderDetails.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Dishes Ordered:
                </span>
                <div className="divide-y divide-slate-800/80 bg-[#11131c] border border-slate-800 rounded-xl px-3 py-1 text-xs">
                  {selectedOrderDetails.items?.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span className="text-white">{it.name} <strong className="text-amber-400">x{it.quantity}</strong></span>
                      <span className="text-slate-300">₹{(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrderDetails.note && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-300">
                  <strong>Special Note:</strong> {selectedOrderDetails.note}
                </div>
              )}

              {/* Totals & Profit */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">₹{selectedOrderDetails.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({selectedOrderDetails.gstPercentage}%):</span>
                  <span className="text-white">₹{selectedOrderDetails.gstAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-amber-400">₹{selectedOrderDetails.grandTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-purple-400 text-xs">
                  <span>Calculated Order Profit:</span>
                  <span>₹{selectedOrderDetails.profit?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  to={`/order/${selectedOrderDetails.id}`}
                  className="flex-1 py-2 text-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Open Live Tracking Page &rarr;
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
