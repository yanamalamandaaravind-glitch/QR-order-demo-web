import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Lock, User, LogIn, AlertCircle } from 'lucide-react';

const KitchenLogin = () => {
  const { staffLogin, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/kitchen';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-redirect if already logged in as kitchen or admin
  React.useEffect(() => {
    if (isAuthenticated && (role === 'KITCHEN' || role === 'ADMIN')) {
      navigate('/kitchen', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await staffLogin(username.trim(), password.trim());
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid kitchen credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('kitchen');
    setPassword('Kitchen@123');
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background ambient lighting for kitchen (emerald/teal tone) */}
      <div className="absolute top-[-10%] right-[20%] w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#131b26] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Kitchen Station
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Spice Route &bull; Order Fulfillment
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-semibold text-emerald-400 block mb-0.5">Demo credentials:</span>
            <span className="text-slate-300">
              User: <strong className="text-emerald-300">kitchen</strong> &bull; Pass: <strong className="text-emerald-300">Kitchen@123</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors whitespace-nowrap"
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
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Staff Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kitchen"
                className="w-full bg-[#0a0f18] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0a0f18] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Kitchen Board'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400">
          <Link to="/login" className="hover:text-emerald-400 transition-colors">
            Customer Login
          </Link>
          <Link to="/admin/login" className="hover:text-emerald-400 transition-colors">
            Admin Login &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default KitchenLogin;

