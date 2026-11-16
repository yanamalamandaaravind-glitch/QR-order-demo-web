import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import PaymentModal from '../../components/PaymentModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Receipt,
  FileText,
  Utensils,
  User,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

const CheckoutPage = () => {
  const { cart, orderNote, setOrderNote, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const { user, isAuthenticated, tableNumber } = useAuth();
  const navigate = useNavigate();

  const [gstPercentage, setGstPercentage] = useState(5.0);
  const [restaurantName, setRestaurantName] = useState('Spice Route');
  const [addMoreItems, setAddMoreItems] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Payment state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSession, setPaymentSession] = useState(null);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Fetch public settings & add-ons
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSettings(true);
        const [settingsRes, menuRes] = await Promise.all([
          axiosClient.get('/admin/settings/public'),
          axiosClient.get('/menu'),
        ]);

        if (settingsRes.data) {
          setGstPercentage(Number(settingsRes.data.gstPercentage) || 5.0);
          setRestaurantName(settingsRes.data.restaurantName || 'Spice Route');
        }

        if (menuRes.data) {
          const quickCategories = ['Drinks', 'Desserts', 'Ice Creams', 'Puffs'];
          const suggestions = menuRes.data
            .filter((item) => quickCategories.includes(item.category))
            .slice(0, 8);
          setAddMoreItems(suggestions);
        }
      } catch (err) {
        console.warn('Could not load settings, using defaults', err);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchData();
  }, []);

  const gstAmount = (subtotal * gstPercentage) / 100;
  const grandTotal = subtotal + gstAmount;

  const handleCheckoutClick = async () => {
    setPaymentError('');

    if (!isAuthenticated) {
      // Redirect to login while preserving cart
      navigate('/login', {
        state: { from: { pathname: '/checkout' } },
      });
      return;
    }

    if (cart.length === 0) return;

    // Create payment session with backend
    setCreatingPayment(true);
    try {
      const paymentRes = await axiosClient.post('/payments/create', {
        amount: grandTotal,
        customerMobile: user?.usernameOrMobile,
        customerName: user?.name,
        tableNumber: parseInt(tableNumber, 10) || 1,
        items: cart.map((i) => ({
          menuItemId: i.id,
          name: i.name,
          price: i.price,
          costPrice: i.costPrice,
          quantity: i.quantity,
          veg: i.veg,
        })),
      });

      setPaymentSession(paymentRes.data);
      setPaymentModalOpen(true);
    } catch (err) {
      setPaymentError(err.message || 'Failed to initiate payment session. Please try again.');
    } finally {
      setCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const orderPayload = {
        tableNumber: parseInt(tableNumber, 10) || 1,
        customerMobile: user?.usernameOrMobile,
        customerName: user?.name,
        note: orderNote,
        paymentMethod: paymentData.paymentMethod || 'Cashfree Sandbox',
        paymentSessionId: paymentData.paymentSessionId,
        cashfreeOrderId: paymentData.cashfreeOrderId,
        items: cart.map((i) => ({
          menuItemId: i.id,
          name: i.name,
          price: i.price,
          costPrice: i.costPrice,
          quantity: i.quantity,
          veg: i.veg,
        })),
      };

      const orderRes = await axiosClient.post('/orders', orderPayload);
      const createdOrder = orderRes.data;

      // Save active order ID in localStorage for quick navigation
      localStorage.setItem('sr_last_order_id', createdOrder.id);

      // Clear cart
      clearCart();
      setPaymentModalOpen(false);

      // Navigate to order tracking page
      navigate(`/order/${createdOrder.id}`);
    } catch (err) {
      setPaymentError(err.message || 'Payment confirmed but failed to record order.');
      setPaymentModalOpen(false);
    }
  };

  const handlePaymentFailure = (errorMsg) => {
    setPaymentError(errorMsg || 'Payment cancelled. Your cart has been preserved.');
    setPaymentModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col pb-16">
      <Navbar />

      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add More Dishes</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#181a24] border border-amber-500/20 text-amber-300 text-xs">
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Table {tableNumber}</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Your Dining Cart
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          Review your selection &bull; Fast table service
        </p>

        {/* Error Alert */}
        <AnimatePresence>
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{paymentError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div className="bg-[#141620] border border-slate-800 rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto mb-6">
              You haven't added any dishes yet. Explore our royal dum handis and tandoori sizzlers!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-orange-500/25 transition-all"
            >
              <span>Explore The Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Customer Status Banner */}
            <div className="bg-[#161822] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Ordering for:</span>
                  <span className="text-sm font-semibold text-white">
                    {isAuthenticated
                      ? `${user?.name || 'Customer'} (${user?.usernameOrMobile})`
                      : 'Guest Customer (Login required before payment)'}
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  state={{ from: { pathname: '/checkout' } }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Cart Items List */}
            <div className="bg-[#141620] border border-slate-800/90 rounded-3xl p-5 shadow-xl divide-y divide-slate-800/80">
              <div className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Items in Order ({itemCount})</span>
                <span>Amount</span>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.veg ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <span className="text-xs text-slate-400">
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-[#1a1c28] border border-slate-700/80 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-amber-400 px-1 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-white min-w-[65px] text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Order Note */}
            <div className="bg-[#141620] border border-slate-800/90 rounded-2xl p-4">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Special Instructions for the Kitchen (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="e.g. Less spicy, extra onions, no coriander, warm water..."
                className="w-full bg-[#0c0d12] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Quick-Commerce Style "Add More" Suggestions Strip */}
            {addMoreItems.length > 0 && (
              <div className="bg-[#141620] border border-slate-800/90 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Frequently Added With Your Meal
                  </h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {addMoreItems.map((addon) => {
                    const inCart = cart.some((c) => c.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        className="min-w-[140px] sm:min-w-[160px] bg-[#1a1c28] border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between shrink-0"
                      >
                        <div className="h-20 w-full rounded-xl overflow-hidden mb-2 bg-slate-900">
                          <img
                            src={addon.imageUrl}
                            alt={addon.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">
                            {addon.name}
                          </span>
                          <span className="text-[11px] text-amber-400 font-semibold block mt-0.5">
                            ₹{addon.price}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(addon)}
                          className="mt-2.5 w-full bg-slate-800 hover:bg-amber-500 hover:text-black text-amber-300 text-[11px] font-bold py-1.5 rounded-lg border border-amber-500/20 flex items-center justify-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{inCart ? 'Add Another' : 'Add +'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bill Details / Price Breakdown */}
            <div className="bg-[#141620] border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Bill Summary</span>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>Item Subtotal:</span>
                <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>Restaurant GST ({gstPercentage}%):</span>
                <span className="text-white font-medium">₹{gstAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-base sm:text-lg font-black text-white">
                <span>To Pay:</span>
                <span className="text-amber-400 text-xl font-black">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order / Continue to Pay CTA */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={creatingPayment}
              onClick={handleCheckoutClick}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all disabled:opacity-60"
            >
              {creatingPayment ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>
                    {isAuthenticated
                      ? `Proceed to Pay ₹${grandTotal.toFixed(2)}`
                      : 'Login with Mobile to Complete Order'}
                  </span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </motion.button>
          </div>
        )}
      </main>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        amount={grandTotal}
        tableNumber={tableNumber}
        customerMobile={user?.usernameOrMobile}
        paymentSession={paymentSession}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
};

export default CheckoutPage;
