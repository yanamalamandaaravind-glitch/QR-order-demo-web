import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, UtensilsCrossed } from 'lucide-react';

const FloatingCartBar = ({ activeOrderId }) => {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0 && !activeOrderId) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <AnimatePresence>
          {itemCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-2xl p-3.5 shadow-2xl shadow-orange-500/40 border border-amber-400/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center relative">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {itemCount}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-amber-100">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in plate
                  </div>
                  <div className="text-base font-black tracking-tight text-white">
                    ₹{subtotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="bg-white hover:bg-amber-50 text-orange-600 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span>View Cart</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : activeOrderId ? (
            /* If cart is empty but an order is placed, show Order Status shortcut */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#161822] border border-amber-500/30 text-amber-300 rounded-2xl p-3 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 text-xs">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Order #{activeOrderId.slice(0, 8)} in progress</span>
              </div>
              <Link
                to={`/order/${activeOrderId}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                Track Live &rarr;
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingCartBar;

