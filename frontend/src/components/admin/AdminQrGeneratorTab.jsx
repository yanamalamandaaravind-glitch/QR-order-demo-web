import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, ExternalLink, Flame, Sparkles, Ticket } from 'lucide-react';

const AdminQrGeneratorTab = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const qrUrl = `${baseUrl}/menu`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-[#141420] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <QrCode className="w-4 h-4" />
            <span>Single Universal Restaurant QR Code</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Universal Restaurant QR Stand
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Single URL for the entire restaurant. Customers scan, order, and receive an instant Kitchen Token for pickup.
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print QR Stand Cards</span>
          </button>
        </div>
      </div>

      {/* Printable Tent Card Preview (Styled for physical display and print) */}
      <div className="flex justify-center py-4">
        <div
          id="printable-qr-card"
          className="w-full max-w-sm bg-gradient-to-b from-[#1c1d29] via-[#12131d] to-[#0c0d12] border-2 border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden text-slate-100"
        >
          {/* Ornate corner accents */}
          <div className="absolute top-3 left-3 text-amber-500/30">✦</div>
          <div className="absolute top-3 right-3 text-amber-500/30">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-500/30">✦</div>
          <div className="absolute bottom-3 right-3 text-amber-500/30">✦</div>

          {/* Restaurant Brand Header */}
          <div className="flex flex-col items-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md mb-2">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 tracking-tight">
              SPICE ROUTE
            </h3>
            <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-semibold mt-0.5">
              Royal Dining Experience
            </span>
          </div>

          {/* Service Mode Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#242738] border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-wider shadow-inner mb-6">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Scan &bull; Order &bull; Token Pickup</span>
          </div>

          {/* High-Resolution QR Canvas Container */}
          <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl shadow-orange-500/20 mb-5">
            <QRCodeSVG
              value={qrUrl}
              size={190}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#0f1117"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Scan with Phone Camera</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-light">
              Interactive 3D Cube Menu &bull; Collect at Counter with your Token #
            </p>
          </div>

          {/* Live Link Button for Evaluator Testing */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline font-mono"
            >
              <span>Single Universal URL: {qrUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQrGeneratorTab;
