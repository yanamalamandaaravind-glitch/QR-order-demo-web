import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../api/axiosClient';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';

const AdminMenuTab = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Biryani',
    price: '',
    costPrice: '',
    veg: true,
    imageUrl: '',
    available: true,
    popular: false,
    preparationTimeMinutes: 15,
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        axiosClient.get('/menu'),
        axiosClient.get('/menu/categories'),
      ]);
      setItems(menuRes.data || []);
      setCategories(catRes.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: categories[0] || 'Biryani',
      price: '',
      costPrice: '',
      veg: true,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      available: true,
      popular: false,
      preparationTimeMinutes: 15,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      price: item.price,
      costPrice: item.costPrice,
      veg: item.veg,
      imageUrl: item.imageUrl || '',
      available: item.available,
      popular: item.popular || false,
      preparationTimeMinutes: item.preparationTimeMinutes || 15,
    });
    setModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice || 0),
        preparationTimeMinutes: parseInt(formData.preparationTimeMinutes, 10) || 15,
      };

      if (editingItem) {
        await axiosClient.put(`/menu/${editingItem.id}`, payload);
        setSuccessMsg(`"${formData.name}" updated successfully!`);
      } else {
        await axiosClient.post('/menu', payload);
        setSuccessMsg(`"${formData.name}" added to menu!`);
      }

      setModalOpen(false);
      fetchMenu();
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }

    try {
      await axiosClient.delete(`/menu/${id}`);
      setSuccessMsg(`"${name}" deleted from menu.`);
      fetchMenu();
    } catch (err) {
      setError(err.message || 'Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (id, currentAvail, name) => {
    try {
      await axiosClient.patch(`/menu/${id}/toggle`);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, available: !currentAvail } : i))
      );
      setSuccessMsg(`"${name}" is now ${!currentAvail ? 'In Stock' : 'Out of Stock'}.`);
    } catch (err) {
      setError(err.message || 'Failed to toggle availability');
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const nameMatch = item.name?.toLowerCase().includes(q);
      const catMatch = item.category?.toLowerCase().includes(q);
      if (!nameMatch && !catMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-[#141420] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes by name or category..."
            className="w-full bg-[#0d0d16] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#0d0d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
        >
          <option value="ALL">All Categories ({items.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
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
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Table */}
      <div className="bg-[#141420] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#10101a] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Profit Margin</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading menu items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No dishes found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const profit = item.price - (item.costPrice || 0);
                  const marginPct = item.price > 0 ? ((profit / item.price) * 100).toFixed(0) : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Image & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-900"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.veg ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                              />
                              <span className="font-bold text-white text-sm">
                                {item.name}
                              </span>
                              {item.popular && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-black text-amber-400 text-sm">
                        ₹{item.price}
                      </td>

                      {/* Cost Price */}
                      <td className="py-3 px-4 font-medium text-slate-400">
                        ₹{item.costPrice || 0}
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-bold block">
                          ₹{profit.toFixed(0)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {marginPct}% margin
                        </span>
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item.id, item.available, item.name)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            item.available
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.available ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          <span>{item.available ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit dish"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            title="Delete dish"
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#161824] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-bold text-white text-base">
                  {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hyderabadi Dum Biryani"
                    className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Rich aromatic basmati rice cooked with dum spices..."
                    className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Prep Time (mins)</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.preparationTimeMinutes}
                      onChange={(e) => setFormData({ ...formData, preparationTimeMinutes: e.target.value })}
                      className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min={1}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="349"
                      className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Cost Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min={0}
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="135"
                      className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0d0d16] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.veg}
                      onChange={(e) => setFormData({ ...formData, veg: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Vegetarian Dish</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Bestseller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">In Stock</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-600/30"
                  >
                    {editingItem ? 'Save Changes' : 'Create Dish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenuTab;

