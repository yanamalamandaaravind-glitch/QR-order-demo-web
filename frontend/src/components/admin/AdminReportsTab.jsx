import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosClient from '../../api/axiosClient';
import {
  FileText,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingBag,
  Award,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminReportsTab = () => {
  const [selectedMonth, setSelectedMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedYear, setSelectedYear] = useState(2026);
  const [allOrders, setAllOrders] = useState([]);
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurantName: 'Spice Route',
    gstPercentage: 5.0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, settingsRes] = await Promise.all([
          axiosClient.get('/admin/orders'),
          axiosClient.get('/admin/settings'),
        ]);
        setAllOrders(ordersRes.data || []);
        if (settingsRes.data) {
          setRestaurantSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Failed to load orders for reporting', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter orders for selected Month & Year
  const periodOrders = useMemo(() => {
    return allOrders.filter((ord) => {
      if (!ord.createdAt) return false;
      const d = new Date(ord.createdAt);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [allOrders, selectedMonth, selectedYear]);

  // Aggregate metrics
  const reportMetrics = useMemo(() => {
    let sales = 0;
    let gst = 0;
    let profit = 0;
    const itemMap = {};
    const dailyMap = {};

    periodOrders.forEach((o) => {
      const total = Number(o.grandTotal) || 0;
      const g = Number(o.gstAmount) || 0;
      const p = Number(o.profit) || 0;

      sales += total;
      gst += g;
      profit += p;

      // Daily breakdown
      const dateKey = new Date(o.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { date: dateKey, orders: 0, sales: 0, gst: 0, profit: 0 };
      }
      dailyMap[dateKey].orders += 1;
      dailyMap[dateKey].sales += total;
      dailyMap[dateKey].gst += g;
      dailyMap[dateKey].profit += p;

      // Item breakdown
      if (o.items) {
        o.items.forEach((it) => {
          if (!itemMap[it.name]) {
            itemMap[it.name] = { name: it.name, quantity: 0, revenue: 0 };
          }
          itemMap[it.name].quantity += it.quantity;
          itemMap[it.name].revenue += Number(it.price) * it.quantity;
        });
      }
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const dailyBreakdown = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    const aov = periodOrders.length > 0 ? sales / periodOrders.length : 0;

    return {
      sales,
      gst,
      profit,
      ordersCount: periodOrders.length,
      aov,
      topItems,
      dailyBreakdown,
    };
  }, [periodOrders]);

  // Export PDF Report using jsPDF + autoTable
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const periodStr = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
    const generatedOn = new Date().toLocaleString('en-IN');

    // Header Banner
    doc.setFillColor(30, 27, 75); // Dark Indigo
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(245, 158, 11); // Amber
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(restaurantSettings.restaurantName?.toUpperCase() || 'SPICE ROUTE', 14, 16);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Monthly Financial & Operations Audit Report - ${periodStr}`, 14, 25);

    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Generated on: ${generatedOn} | Currency: INR (Rs)`, 14, 32);

    let currentY = 44;

    // Section 1: Executive KPI Summary Table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Executive Financial Summary', 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Gross Sales (Rs)', 'Total Orders', 'Average Order Value (Rs)', 'GST Collected (Rs)', 'Net Profit (Rs)']],
      body: [
        [
          `Rs ${reportMetrics.sales.toFixed(2)}`,
          reportMetrics.ordersCount.toString(),
          `Rs ${reportMetrics.aov.toFixed(2)}`,
          `Rs ${reportMetrics.gst.toFixed(2)}`,
          `Rs ${reportMetrics.profit.toFixed(2)}`,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, halign: 'center' },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // Section 2: Top 10 Bestselling Items Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Top 10 Bestselling Dishes', 14, currentY);

    const topItemsRows = reportMetrics.topItems.map((it, idx) => [
      `#${idx + 1}`,
      it.name,
      it.quantity.toString(),
      `Rs ${it.revenue.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Rank', 'Dish Name', 'Portions Ordered', 'Sales Revenue (Rs)']],
      body: topItemsRows.length > 0 ? topItemsRows : [['-', 'No items ordered in this period', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8.5 },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // Section 3: Daily Breakdown Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Daily Sales & Tax Breakdown', 14, currentY);

    const dailyRows = reportMetrics.dailyBreakdown.map((d) => [
      d.date,
      d.orders.toString(),
      `Rs ${d.sales.toFixed(2)}`,
      `Rs ${d.gst.toFixed(2)}`,
      `Rs ${d.profit.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Date', 'Orders', 'Gross Sales (Rs)', 'GST (Rs)', 'Net Profit (Rs)']],
      body: dailyRows.length > 0 ? dailyRows : [['-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, halign: 'center' },
    });

    // Save PDF
    doc.save(`SpiceRoute_Report_${MONTH_NAMES[selectedMonth]}_${selectedYear}.pdf`);
  };

  // Export CSV Report
  const handleDownloadCsv = () => {
    const periodStr = `${MONTH_NAMES[selectedMonth]}_${selectedYear}`;
    const headers = [
      'Order Number',
      'Date Time',
      'Token Number',
      'Customer Name',
      'Customer Mobile',
      'Dishes',
      'Subtotal',
      'GST Percentage',
      'GST Amount',
      'Grand Total',
      'Total Cost Price',
      'Net Profit',
      'Status',
      'Payment Method',
    ];

    const rows = periodOrders.map((ord) => [
      ord.orderNumber,
      ord.createdAt ? `"${ord.createdAt}"` : '""',
      ord.orderNumber ? `"${ord.orderNumber.replace('SR-', 'T-')}"` : `"${ord.id}"`,
      `"${ord.customerName || 'Guest'}"`,
      ord.customerMobile || '',
      `"${ord.items ? ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ') : ''}"`,
      ord.subtotal || 0,
      ord.gstPercentage || 5,
      ord.gstAmount || 0,
      ord.grandTotal || 0,
      ord.totalCostPrice || 0,
      ord.profit || 0,
      ord.status,
      `"${ord.paymentMethod || 'Cashfree Sandbox'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpiceRoute_Orders_${periodStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Month & Year Selection Header */}
      <div className="bg-[#141420] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Audit & Report Generator</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Monthly Financial Statements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and export official P&L audits, tax collections, and item breakdowns
          </p>
        </div>

        {/* Month / Year Pickers & Download Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="bg-[#0d0d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-[#0d0d16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
          >
            {[2026, 2025, 2024].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards Preview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Period Gross Sales
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            ₹{reportMetrics.sales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Orders Count
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {reportMetrics.ordersCount}
          </span>
        </div>

        <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            Avg Order Value
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            ₹{reportMetrics.aov.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#141420] border border-slate-800 rounded-3xl p-4 shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
            GST Collected
          </span>
          <span className="text-xl sm:text-2xl font-black text-white">
            ₹{reportMetrics.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-[#141420] border border-purple-500/30 rounded-3xl p-4 shadow-lg col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-950/20 to-transparent">
          <span className="text-[11px] text-purple-300 uppercase tracking-wider block mb-1">
            Period Net Profit
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-400">
            ₹{reportMetrics.profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Top 10 Bestselling Preview Table */}
      <div className="bg-[#141420] border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Top 10 Bestselling Dishes for {MONTH_NAMES[selectedMonth]} {selectedYear}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Dish</th>
                <th className="py-2.5 px-3">Portions Ordered</th>
                <th className="py-2.5 px-3 text-right">Revenue Contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {reportMetrics.topItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    No orders recorded for this month.
                  </td>
                </tr>
              ) : (
                reportMetrics.topItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2 px-3 font-mono text-purple-400 font-bold">#{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-white">{item.name}</td>
                    <td className="py-2 px-3 font-semibold text-slate-200">{item.quantity} portions</td>
                    <td className="py-2 px-3 text-right font-black text-amber-400">₹{item.revenue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsTab;

