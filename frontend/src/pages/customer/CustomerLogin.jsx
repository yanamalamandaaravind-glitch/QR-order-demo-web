import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Flame, Smartphone, KeyRound, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const CustomerLogin = () => {
  const { sendOtp, verifyOtp, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/menu';

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-redirect if already logged in as customer or admin
  React.useEffect(() => {
    if (isAuthenticated && (role === 'CUSTOMER' || role === 'ADMIN')) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate, redirectPath]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(mobile.trim());
      setSuccessMsg('OTP sent! Use demo OTP: 123456');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(mobile.trim(), otp.trim(), name.trim());
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setMobile('9876543210');
    setOtp('123456');
    setName('Rahul Sharma');
    setStep(2);
    setSuccessMsg('Demo credentials filled! Tap "Verify & Login"');
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#161822] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3">
            <Flame className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Spice Route
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customer Sign In & Ordering
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-semibold text-amber-400 block mb-0.5">Demo credentials:</span>
            <span className="text-slate-300">Any 10-digit mobile &bull; OTP: <strong className="text-amber-300">123456</strong></span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors whitespace-nowrap"
          >
            1-Click Fill
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Mobile Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <span className="text-xs font-semibold mr-1.5 text-slate-400">+91</span>
                  <Smartphone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full bg-[#0c0d12] border border-slate-700 rounded-xl pl-16 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP & Name Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Change mobile ({mobile})
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-[#0c0d12] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white tracking-widest placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Name <span className="text-slate-500">(Optional for first order)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#0c0d12] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <Link to="/menu" className="hover:text-amber-400 transition-colors">
            &larr; Back to Menu
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/kitchen/login" className="hover:text-amber-400 transition-colors">
              Kitchen Login
            </Link>
            <span>&bull;</span>
            <Link to="/admin/login" className="hover:text-amber-400 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin;

