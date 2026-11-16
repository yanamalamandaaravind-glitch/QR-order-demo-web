import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Flame, Utensils, ShoppingBag, Clock, LogOut, User, ChefHat, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, role, isAuthenticated, logout, tableNumber } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (role === 'KITCHEN') {
      navigate('/kitchen/login');
    } else if (role === 'ADMIN') {
      navigate('/admin/login');
    } else {
      navigate('/menu');
    }
  };

  // Minimal navbar for staff views if needed, or dynamic
  const isKitchenPath = location.pathname.startsWith('/kitchen');
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/menu" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-none">
              Spice Route
            </span>
            <span className="text-[10px] text-amber-500 font-medium tracking-wider uppercase">
              {isAdminPath ? 'Back Office' : isKitchenPath ? 'Kitchen Station' : 'Royal Kitchen'}
            </span>
          </div>
        </Link>

        {/* Center Service Mode Indicator (Customer view) */}
        {!isAdminPath && !isKitchenPath && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a24] border border-amber-500/20 text-amber-300 text-xs">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Counter Pickup</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Admin link shortcuts */}
          {role === 'ADMIN' && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/admin"
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isAdminPath
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-800/40 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </Link>
              <Link
                to="/kitchen"
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isKitchenPath
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/40 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                Kitchen
              </Link>
              <Link
                to="/menu"
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-300 border border-slate-700 hover:text-white transition-colors"
              >
                Menu
              </Link>
            </div>
          )}

          {/* Customer Links */}
          {(!role || role === 'CUSTOMER') && (
            <>
              {isAuthenticated && (
                <Link
                  to="/orders/my"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">My Orders</span>
                </Link>
              )}

              {/* Cart Button */}
              <Link
                to="/checkout"
                className="relative flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-semibold">Cart</span>
                {itemCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] font-bold rounded-full min-w-[18px] text-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Status / Login / Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="hidden sm:inline-block text-xs font-medium text-slate-300">
                {user?.name || user?.usernameOrMobile}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

