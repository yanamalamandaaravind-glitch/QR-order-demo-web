import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SplashScreen from '../../components/SplashScreen';
import Navbar from '../../components/Navbar';
import CubeMenuSlider from '../../components/CubeMenuSlider';
import ListViewMenu from '../../components/ListViewMenu';
import FloatingCartBar from '../../components/FloatingCartBar';
import axiosClient from '../../api/axiosClient';
import {
  Search,
  Eye,
  Flame,
  UtensilsCrossed,
  X,
  AlertCircle,
  Box,
} from 'lucide-react';

const MenuPage = () => {
  // Splash logic
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('sr_splash_shown');
  });

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('ALL'); // 'ALL' | 'VEG' | 'NON_VEG'
  const [viewMode, setViewMode] = useState('CUBE'); // 'CUBE' | 'LIST'

  // Last placed order ID for tracking shortcut
  const [lastOrderId, setLastOrderId] = useState(() => {
    return localStorage.getItem('sr_last_order_id') || null;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('sr_splash_shown', 'true');
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes] = await Promise.all([
          axiosClient.get('/menu'),
          axiosClient.get('/menu/categories'),
        ]);
        setMenuItems(menuRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Diet filter match
      if (dietFilter === 'VEG' && !item.veg) return false;
      if (dietFilter === 'NON_VEG' && item.veg) return false;

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, dietFilter, searchQuery]);

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col relative pb-20">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
          {/* Top Bar: Restaurant Info & Quick Order Status Link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Counter Pickup &bull; Instant Kitchen Token
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                The Royal Feast Menu
              </h1>
            </div>

            {/* Quick Actions (Order Status + View Toggle) */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {lastOrderId && (
                <Link
                  to={`/order/${lastOrderId}`}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all flex items-center gap-1.5 shadow"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Active Order</span>
                </Link>
              )}

              {/* View Mode Toggle Switch */}
              <div className="bg-[#161822] border border-slate-800 rounded-xl p-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('CUBE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'CUBE'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Cube</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'LIST'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Box & Diet Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Biryani, Tandoori, Kulfi..."
                className="w-full bg-[#141620] border border-slate-800/90 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Quick Selector */}
            <div className="flex items-center gap-1.5 bg-[#141620] border border-slate-800/90 rounded-2xl p-1 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setDietFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  dietFilter === 'ALL'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('VEG')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  dietFilter === 'VEG'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Veg Only
              </button>
              <button
                type="button"
                onClick={() => setDietFilter('NON_VEG')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  dietFilter === 'NON_VEG'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-semibold'
                    : 'text-slate-400 hover:text-red-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25 font-bold'
                  : 'bg-[#141620] border border-slate-800 text-slate-300 hover:border-amber-500/40'
              }`}
            >
              All Dishes ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((m) => m.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25 font-bold'
                      : 'bg-[#141620] border border-slate-800 text-slate-300 hover:border-amber-500/40'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Loading / Error States */}
          {loading && (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-amber-500 mb-3" />
              <p className="text-xs sm:text-sm text-slate-400">
                Summoning the Royal Handis & Tandoor...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3 my-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Menu Display: 3D Cube Slider OR List View */}
          {!loading && !error && (
            <>
              {viewMode === 'CUBE' ? (
                <CubeMenuSlider items={filteredItems} />
              ) : (
                <ListViewMenu items={filteredItems} />
              )}
            </>
          )}
        </main>

        {/* Floating Cart Bar at Bottom */}
        <FloatingCartBar activeOrderId={lastOrderId} />
      </div>
    </>
  );
};

export default MenuPage;
