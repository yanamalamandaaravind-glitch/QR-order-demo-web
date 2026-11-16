import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Clock } from 'lucide-react';

const ListViewMenu = ({ items }) => {
  const { cart, addToCart, updateQuantity } = useCart();

  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        No dishes match your selection.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
      {items.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141620] border border-slate-800/90 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg"
          >
            {/* Image & Badges */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141620] via-transparent to-black/30" />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.veg ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span>{item.veg ? 'Veg' : 'Non-Veg'}</span>
              </div>

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-medium backdrop-blur-md">
                {item.category}
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{item.preparationTimeMinutes || 15} mins</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base leading-snug">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Price
                  </span>
                  <span className="text-xl font-black text-amber-400 tracking-tight">
                    ₹{item.price}
                  </span>
                </div>

                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-[#1a1c28] border border-amber-500/30 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-amber-400 px-1.5 min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center transition-colors shadow"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ListViewMenu;

