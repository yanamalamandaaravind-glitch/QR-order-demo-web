import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, QrCode, Building, CheckCircle2, XCircle, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  tableNumber,
  customerMobile,
  paymentSession,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const isMock = paymentSession?.mode === 'MOCK';

  const handleSimulatePayment = (success) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (success) {
        onPaymentSuccess?.({
          paymentMethod: `Cashfree Sandbox (${method})`,
          paymentSessionId: paymentSession?.paymentSessionId,
          cashfreeOrderId: paymentSession?.orderId,
        });
      } else {
        onPaymentFailure?.('Payment cancelled or declined by user in sandbox');
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#161824] border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  Cashfree Payments
                </h3>
                <span className="text-[11px] text-amber-400 font-medium">
                  {isMock ? 'Sandbox Simulation Mode' : 'Cashfree Sandbox Gateway'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={processing}
              className="text-xs text-slate-400 hover:text-white p-1 rounded-lg"
            >
              Cancel
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-[#12141c] border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Payable:</span>
              <span className="text-2xl font-black text-amber-400 tracking-tight">
                ₹{Number(amount).toFixed(2)}
              </span>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span className="block font-medium text-amber-300">Counter Pickup</span>
              <span>{customerMobile}</span>
            </div>
          </div>

          {/* Notice for Demo */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5 text-[11px] text-amber-300/90 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Connected to <strong>Cashfree Sandbox</strong>. You can simulate instant authorization or test decline scenarios below.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Payment Method
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  method === 'UPI'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow'
                    : 'bg-[#12141c] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  method === 'Card'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow'
                    : 'bg-[#12141c] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('NetBanking')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  method === 'NetBanking'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow'
                    : 'bg-[#12141c] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>NetBanking</span>
              </button>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulatePayment(true)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-98 disabled:opacity-50"
            >
              {processing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful Payment</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulatePayment(false)}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Simulate Payment Failure / Cancel</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3 h-3" />
            <span>256-Bit Encrypted Sandbox Demo Gateway</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;

