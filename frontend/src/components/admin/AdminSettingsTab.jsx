import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../api/axiosClient';
import { Sliders, Save, CheckCircle2, AlertCircle, Percent, Utensils, Store } from 'lucide-react';

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Spice Route',
    gstPercentage: 5.0,
    tableCount: 20,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/admin/settings');
        if (res.data) {
          setSettings({
            restaurantName: res.data.restaurantName || 'Spice Route',
            gstPercentage: parseFloat(res.data.gstPercentage) || 5.0,
            tableCount: parseInt(res.data.tableCount, 10) || 20,
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load restaurant settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        restaurantName: settings.restaurantName.trim(),
        gstPercentage: parseFloat(settings.gstPercentage),
        tableCount: parseInt(settings.tableCount, 10),
      };

      await axiosClient.put('/admin/settings', payload);
      setSuccessMsg('Settings saved successfully! New orders will immediately reflect these tax and table settings.');
    } catch (err) {
      setError(err.message || 'Failed to update restaurant settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Loading restaurant configuration...
      </div>
    );
  }

  return (
    <div className="max-w-2xl bg-[#141420] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Restaurant Global Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure restaurant identity, billing tax rate, and dining tables
          </p>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Restaurant Name */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-purple-400" />
            <span>Restaurant Brand Name</span>
          </label>
          <input
            type="text"
            required
            value={settings.restaurantName}
            onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
            className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Displayed on header, invoices, PDF audits, and QR table stands.
          </span>
        </div>

        {/* GST Percentage */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-purple-400" />
            <span>Restaurant GST Tax Rate (%)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              required
              min={0}
              max={28}
              value={settings.gstPercentage}
              onChange={(e) => setSettings({ ...settings, gstPercentage: e.target.value })}
              className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-bold"
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 font-bold pointer-events-none">
              %
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Applicable to all future customer checkout totals and reports (Default: 5%).
          </span>
        </div>

        {/* Table Count */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-purple-400" />
            <span>Total Dining Tables</span>
          </label>
          <input
            type="number"
            required
            min={1}
            max={100}
            value={settings.tableCount}
            onChange={(e) => setSettings({ ...settings, tableCount: e.target.value })}
            className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-bold"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Number of QR physical table stands supported (Default: 20).
          </span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Apply Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsTab;

