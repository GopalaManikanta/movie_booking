import React, { useState } from 'react';
import { 
  Ticket, Search, Clock, QrCode, Download, Printer, Copy, 
  Check, Film, Building2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const BookingHistory = () => {
  const { theme, showToast, userBookings, cancelBooking } = useAuth();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieFilter, setSelectedMovieFilter] = useState('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modals State
  const [activeETicket, setActiveETicket] = useState(null);
  const [cancelTargetBooking, setCancelTargetBooking] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Extract unique movie titles for filter dropdown
  const uniqueMovies = Array.from(
    new Set((userBookings || []).map((b) => b.movie).filter(Boolean))
  );

  // Filter Bookings logic
  const filteredBookings = (userBookings || []).filter((b) => {
    // Search query check
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (b.id || '').toLowerCase().includes(q) ||
      (b.movie || '').toLowerCase().includes(q) ||
      (b.theater || '').toLowerCase().includes(q) ||
      (b.customer || '').toLowerCase().includes(q) ||
      (b.seats || '').toLowerCase().includes(q);

    // Movie filter check
    const matchesMovie =
      selectedMovieFilter === 'ALL' || b.movie === selectedMovieFilter;

    // Status filter check
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'CONFIRMED' && (b.status === 'Confirmed 🟢' || !b.status?.includes('Cancelled'))) ||
      (selectedStatusFilter === 'CANCELLED' && b.status === 'Cancelled 🔴');

    // Date filter check
    let matchesDate = true;
    if (selectedDateFilter === 'TODAY') {
      const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      matchesDate = b.date === todayStr || b.date?.includes('Today');
    }

    return matchesSearch && matchesMovie && matchesStatus && matchesDate;
  });

  // Summary Statistics
  const totalBookingsCount = (userBookings || []).length;
  const confirmedCount = (userBookings || []).filter(b => b.status !== 'Cancelled 🔴').length;
  const cancelledCount = (userBookings || []).filter(b => b.status === 'Cancelled 🔴').length;
  const totalSpent = (userBookings || []).reduce(
    (sum, b) => sum + (b.status !== 'Cancelled 🔴' ? (b.amount || 0) : 0),
    0
  );

  // Copy Ticket ID
  const handleCopyId = (id) => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      showToast(`Copied Booking ID: ${id}`, 'success');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Download E-Ticket
  const handleDownloadETicket = (ticket) => {
    if (!ticket) return;

    const ticketText = `
=====================================================
          CINEMAX MULTIPLEX - DIGITAL E-TICKET
=====================================================
BOOKING ID:      ${ticket.id}
CUSTOMER:        ${ticket.customer || 'Customer'}
MOVIE TITLE:     ${ticket.movie}
THEATRE:         ${ticket.theater}
SHOWTIME:        ${ticket.showTime} (${ticket.date || 'Today'})
RESERVED SEATS:  ${ticket.seats}
AMOUNT PAID:     ₹${ticket.amount}
BOOKING STATUS:  ${ticket.status || 'Confirmed 🟢'}
GATE ENTRANCE:   Gate 2 - Scan Mobile QR Code

Thank you for choosing Cinemax Multiplex Cinemas!
=====================================================
    `;

    const blob = new Blob([ticketText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `E-Ticket_${ticket.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📥 Digital E-Ticket downloaded to your device!', 'success');
  };

  // Confirm Cancellation
  const handleConfirmCancel = () => {
    if (cancelTargetBooking) {
      cancelBooking(cancelTargetBooking.id);
      setCancelTargetBooking(null);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-zinc-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navbar */}
      <Navbar />

      {/* HEADER SECTION */}
      <div className={`border-b ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="text-rose-500" size={24} />
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  My Booking History & E-Tickets
                </h1>
              </div>
              <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Manage your reserved movie tickets, view E-Tickets, and track refund statuses in real time
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/movies"
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Film size={14} /> Book New Ticket
              </Link>
            </div>
          </div>

          {/* METRICS SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            <div className={`p-3.5 rounded-2xl border ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-black uppercase text-slate-400">Total Bookings</span>
              <div className={`text-xl font-black mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {totalBookingsCount}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-black uppercase text-emerald-400">Confirmed 🟢</span>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {confirmedCount}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-black uppercase text-rose-400">Cancelled 🔴</span>
              <div className="text-xl font-black text-rose-400 mt-0.5">
                {cancelledCount}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-black uppercase text-amber-400">Total Spent</span>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                ₹{totalSpent.toLocaleString()}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* SEARCH & FILTERS BAR */}
        <div className={`p-4 rounded-3xl border space-y-3 ${
          theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Booking ID, Movie, Theatre, or Seats..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-medium focus:outline-none focus:border-rose-500 ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Movie Filter */}
            <select
              value={selectedMovieFilter}
              onChange={(e) => setSelectedMovieFilter(e.target.value)}
              className={`p-2.5 rounded-2xl border text-xs font-bold focus:outline-none focus:border-rose-500 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="ALL">🎬 All Movies ({uniqueMovies.length})</option>
              {uniqueMovies.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className={`p-2.5 rounded-2xl border text-xs font-bold focus:outline-none focus:border-rose-500 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="ALL">📅 All Dates</option>
              <option value="TODAY">Today's Bookings</option>
            </select>

          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-black uppercase text-slate-400 mr-1">Status:</span>
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'CONFIRMED', label: 'Confirmed 🟢' },
              { id: 'CANCELLED', label: 'Cancelled 🔴' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedStatusFilter === st.id
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                    : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

        </div>

        {/* BOOKING HISTORY LIST */}
        {filteredBookings.length === 0 ? (
          <div className={`p-10 rounded-3xl border text-center space-y-3 ${
            theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <Ticket size={48} className="mx-auto text-slate-500" />
            <h3 className="text-xl font-black">No Booking Records Found</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
              {userBookings.length === 0 
                ? 'You have not booked any tickets yet. Explore current movies and reserve your seats!'
                : 'No bookings match your current search or filter criteria.'}
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
            >
              <Film size={15} /> Explore Movie Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isCancelled = b.status === 'Cancelled 🔴';
              
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border transition-all hover:border-rose-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                    theme === 'dark' 
                      ? isCancelled ? 'bg-zinc-900/40 border-zinc-800/80 opacity-75' : 'bg-zinc-900/90 border-zinc-800'
                      : isCancelled ? 'bg-slate-100 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-slate-200/60'
                  }`}
                >
                  
                  {/* Left Column: Booking Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    
                    <div className="w-14 h-20 rounded-2xl bg-zinc-800 overflow-hidden border border-zinc-700/50 shrink-0">
                      <img
                        src={b.moviePoster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80'}
                        alt={b.movie}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                          {b.id}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isCancelled 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {b.status || 'Confirmed 🟢'}
                        </span>
                      </div>

                      <h3 className={`text-base sm:text-lg font-black tracking-tight truncate ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {b.movie}
                      </h3>

                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 truncate">
                        <Building2 size={14} className="text-rose-500 shrink-0" /> {b.theater}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Clock size={13} /> {b.showTime} ({b.date || 'Today'})
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-extrabold">
                          <Ticket size={13} /> Seats: {b.seats} {isCancelled ? <span className="text-emerald-400 font-black ml-1 text-[10px] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">(Released & Available 🟢)</span> : ''}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Right Column: Amount & Action Buttons */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800/60 gap-3 shrink-0">
                    
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid</span>
                      <span className={`text-xl font-black ${isCancelled ? 'line-through text-slate-500' : 'text-rose-500'}`}>
                        ₹{b.amount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View E-Ticket */}
                      <button
                        onClick={() => setActiveETicket(b)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <QrCode size={14} /> View E-Ticket
                      </button>

                      {/* Cancel Booking Button */}
                      {!isCancelled && (
                        <button
                          onClick={() => setCancelTargetBooking(b)}
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-rose-600/80 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer border border-zinc-700 hover:border-rose-500"
                          title="Cancel ticket booking"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 1. DIGITAL E-TICKET FULL VIEW MODAL */}
      {activeETicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-5 transition-all ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white shadow-rose-950/50' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            
            {/* Modal Exit */}
            <button
              onClick={() => setActiveETicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-zinc-900 hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header Badge */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto mb-1">
                <Ticket size={24} />
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">Digital Cinema E-Ticket</h2>
              <p className="text-xs font-semibold text-slate-400">Scan barcode at gate entrance for fast admission</p>
            </div>

            {/* Booking Reference ID */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">BOOKING REFERENCE ID</span>
                <span className="text-lg font-black font-mono text-white">{activeETicket.id}</span>
              </div>
              <button
                onClick={() => handleCopyId(activeETicket.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
              >
                {copiedId ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Ticket Information Breakdown */}
            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs text-left font-semibold ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="text-white font-black">{activeETicket.customer || 'Manikanta'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movie Title:</span>
                <span className="text-rose-400 font-black">{activeETicket.movie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Theatre & Screen:</span>
                <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{activeETicket.theater}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Showtime & Date:</span>
                <span className="text-emerald-400 font-bold">{activeETicket.showTime} ({activeETicket.date || 'Today'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reserved Seats:</span>
                <span className="text-amber-400 font-black">{activeETicket.seats}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-zinc-700 pt-2 font-black text-sm">
                <span>Total Paid:</span>
                <span className="text-rose-500">₹{activeETicket.amount}</span>
              </div>
            </div>

            {/* Entrance Scanner Box */}
            <div className="border border-dashed border-zinc-800 rounded-2xl p-3 bg-zinc-950/70 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 font-mono text-[10px] tracking-widest">
                <QrCode size={16} className="text-rose-500" />
                <span>SCAN AT GATE 2 ENTRANCE SCANNER</span>
              </div>
              <div className="w-full h-9 bg-zinc-900 rounded-xl flex items-center justify-center tracking-[0.5em] font-mono text-xs font-black text-slate-400 border border-zinc-800">
                |||| | ||||| || |||| ||| |||
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDownloadETicket(activeETicket)}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Download size={15} /> Download Receipt
              </button>
              <button
                onClick={() => window.print()}
                className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={15} /> Print Ticket
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. CANCEL BOOKING CONFIRMATION MODAL */}
      {cancelTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-5 text-center ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white shadow-rose-950/50' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle size={32} />
            </div>

            <div>
              <h3 className="text-xl font-black text-rose-500">Cancel Booking Reservation?</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Are you sure you want to cancel booking <span className="font-mono text-white font-bold">{cancelTargetBooking.id}</span> for <span className="text-rose-400 font-bold">"{cancelTargetBooking.movie}"</span>?
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/80 text-left text-xs space-y-1 font-medium">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Refund Amount:</span>
                <span className="text-emerald-400">100% Full Refund (₹{cancelTargetBooking.amount})</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Refund will be credited back to your original payment method within 2-4 hours. Reserved seats ({cancelTargetBooking.seats}) will be released for other buyers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleConfirmCancel}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setCancelTargetBooking(null)}
                className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 font-extrabold text-xs cursor-pointer"
              >
                Keep Booking
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingHistory;
