import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, QrCode, Wallet, CheckCircle2, XCircle, 
  ArrowLeft, ShieldCheck, Ticket, Download, Copy, Check, RefreshCw, 
  AlertCircle, Lock, Gift, Film
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, showToast, addBooking } = useAuth();

  // Extract booking details passed from SeatSelection or use realistic fallback
  const stateData = location.state || {};
  
  const bookingData = {
    movieTitle: stateData.movieTitle || 'Deadpool & Wolverine',
    movieId: stateData.movieId || 533535,
    posterPath: stateData.posterPath || 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    theater: stateData.theater || 'AMB Cinemas: Screen 1 (4K Dolby)',
    showTime: stateData.showTime || '06:30 PM',
    date: stateData.date || 'Today, 30 Sep',
    seats: stateData.seats || ['A1', 'A2'],
    seatsText: stateData.seatsText || 'Recliner (A1, A2)',
    subtotal: stateData.subtotal || 700,
    convenienceFee: stateData.convenienceFee || 30,
    gstTax: stateData.gstTax || 5,
    grandTotal: stateData.grandTotal || 735,
  };

  // Payment UI State
  const [activePaymentMethod, setActivePaymentMethod] = useState('card'); // 'card', 'upi', 'wallet'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'success', 'failure'
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [shouldSimulateFailure, setShouldSimulateFailure] = useState(false);

  // Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Card Form State
  const [cardForm, setCardForm] = useState({
    cardNumber: '4532 7812 9012 3456',
    cardHolder: 'MANIKANTA',
    expiry: '08/28',
    cvv: '888',
    saveCard: true,
  });

  // UPI Form State
  const [upiId, setUpiId] = useState('manikanta@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  const finalPayableAmount = Math.max(0, bookingData.grandTotal - appliedDiscount);

  // Handle Promo Code application
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'FIRST50') {
      setAppliedDiscount(50);
      setCouponSuccess('🎉 "FIRST50" applied! You saved ₹50');
      showToast('🎉 Coupon FIRST50 applied! Saved ₹50', 'success');
    } else if (code === 'CINEMA100') {
      setAppliedDiscount(100);
      setCouponSuccess('🎉 "CINEMA100" applied! You saved ₹100');
      showToast('🎉 Coupon CINEMA100 applied! Saved ₹100', 'success');
    } else {
      setCouponError('Invalid coupon code. Try "FIRST50" or "CINEMA100"');
    }
  };

  // Process Payment Execution
  const handleExecutePayment = () => {
    setIsProcessing(true);
    setPaymentStatus('idle');

    setTimeout(() => {
      setIsProcessing(false);

      if (shouldSimulateFailure) {
        setPaymentStatus('failure');
        showToast('❌ Payment Failed: Transaction declined by bank issuer.', 'error');
      } else {
        // Successful booking execution
        const newBooking = addBooking({
          movieId: bookingData.movieId,
          movie: bookingData.movieTitle,
          theater: bookingData.theater,
          showTime: bookingData.showTime,
          date: bookingData.date,
          seats: bookingData.seatsText,
          seatCodes: bookingData.seats,
          amount: finalPayableAmount,
          subtotal: bookingData.subtotal,
          convenienceFee: bookingData.convenienceFee,
          gst: bookingData.gstTax,
          paymentMethod: activePaymentMethod.toUpperCase(),
        });

        setConfirmedBooking(newBooking);
        setPaymentStatus('success');
        showToast(`🎟️ Payment Successful! Ticket ID: ${newBooking.id}`, 'success');
      }
    }, 2000);
  };

  // Copy Booking ID
  const handleCopyBookingId = () => {
    if (confirmedBooking?.id) {
      navigator.clipboard.writeText(confirmedBooking.id);
      setCopiedId(true);
      showToast(`Copied Ticket ID: ${confirmedBooking.id}`, 'success');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // UI Only Download Ticket Receipt (Generates downloadable file)
  const handleDownloadTicket = () => {
    if (!confirmedBooking) return;

    const ticketContent = `
=====================================================
          CINEMAX MULTIPLEX - DIGITAL MOVIE TICKET
=====================================================
BOOKING ID:      ${confirmedBooking.id}
MOVIE TITLE:     ${confirmedBooking.movie}
THEATRE:         ${confirmedBooking.theater}
SHOWTIME:        ${confirmedBooking.showTime} (${confirmedBooking.date || 'Today'})
SEATS RESERVED:  ${confirmedBooking.seats}
AMOUNT PAID:     ₹${confirmedBooking.amount}
PAYMENT STATUS:  PAID & CONFIRMED 🟢
GATE ENTRANCE:   Gate 2 - Scan Mobile QR Code

Thank you for booking with Cinemax Multiplex!
=====================================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ticket_${confirmedBooking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📥 Digital Ticket downloaded successfully!', 'success');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-zinc-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navbar */}
      <Navbar />

      {/* HEADER TITLE */}
      <div className={`border-b ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-rose-600 text-slate-200 hover:text-white font-extrabold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={15} /> Back to Seats
          </button>
          <div className="flex items-center gap-2 text-rose-500 font-black text-sm tracking-wide">
            <Lock size={16} /> 256-BIT SSL SECURE CHECKOUT
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-8">
        
        {/* PROCESSING LOADER OVERLAY STATE */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn">
            <div className="text-center space-y-4 max-w-sm p-8 rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
              <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto"></div>
              <h3 className="text-lg font-black tracking-wide">Processing Secure Payment...</h3>
              <p className="text-xs text-slate-400 font-medium">Please do not refresh or close this browser window while we connect with your bank server.</p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-bold">
                <ShieldCheck size={14} /> Encrypted Gateway Session
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SUCCESS SCREEN */}
        {paymentStatus === 'success' && confirmedBooking && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white shadow-rose-950/40' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              {/* Confetti Glow Effect */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-400">Payment Successful! 🎉</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">Your ticket seats have been confirmed & booked.</p>
              </div>

              {/* BOOKING ID CARD */}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">BOOKING REFERENCE ID</span>
                  <span className="text-xl font-black font-mono text-white">{confirmedBooking.id}</span>
                </div>
                <button
                  onClick={handleCopyBookingId}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {copiedId ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* TICKET DETAILS SUMMARY */}
              <div className={`p-4 rounded-2xl border space-y-2.5 text-xs text-left font-semibold ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className="text-slate-400">Movie Title:</span>
                  <span className="text-rose-400 font-black">{confirmedBooking.movie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Theatre & Screen:</span>
                  <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{confirmedBooking.theater}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Showtime & Date:</span>
                  <span className="text-emerald-400 font-bold">{confirmedBooking.showTime} ({confirmedBooking.date})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reserved Seats:</span>
                  <span className="text-amber-400 font-black">{confirmedBooking.seats}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-dashed border-zinc-700 font-black text-sm">
                  <span>Amount Paid:</span>
                  <span className="text-rose-500">₹{confirmedBooking.amount}</span>
                </div>
              </div>

              {/* QR CODE SCAN BOX */}
              <div className="border border-dashed border-zinc-800 rounded-2xl p-4 bg-zinc-950/60 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-slate-400 font-mono text-[10px] tracking-widest">
                  <QrCode size={18} className="text-rose-500" />
                  <span>SCAN AT ENTRANCE GATE SCANNER</span>
                </div>
                <div className="w-full h-10 bg-zinc-900 rounded-xl flex items-center justify-center tracking-[0.5em] font-mono text-sm font-black text-slate-400 border border-zinc-800">
                  |||| | ||||| || |||| ||| |||
                </div>
              </div>

              {/* ACTION BUTTONS: DOWNLOAD TICKET */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownloadTicket}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <Download size={16} /> Download Digital Ticket Receipt
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Ticket size={14} /> My Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/movies')}
                    className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Film size={14} /> Book Another
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PAYMENT FAILURE SCREEN */}
        {paymentStatus === 'failure' && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <XCircle size={36} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-rose-500">Payment Failed</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">Your transaction could not be completed by the bank gateway.</p>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-left space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs">
                  <AlertCircle size={16} /> Error Code: ERR_PAYMENT_DECLINED
                </div>
                <p className="text-xs font-medium text-slate-300">
                  Reason: The card issuer or UPI bank server rejected the charge request. No money was deducted from your account.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setShouldSimulateFailure(false);
                    setPaymentStatus('idle');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <RefreshCw size={16} /> Try Again / Change Payment Method
                </button>

                <button
                  onClick={() => navigate('/seat-selection/' + bookingData.movieId)}
                  className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Seat Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN PAYMENT CHECKOUT INTERFACE (IDLE STATE) */}
        {paymentStatus === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: PAYMENT METHOD TABS & FORM */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* PAYMENT METHOD SELECTION TABS */}
              <div className={`p-4 rounded-3xl border space-y-4 ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-rose-500">
                  <CreditCard size={18} /> Select Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Card Tab */}
                  <button
                    onClick={() => setActivePaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      activePaymentMethod === 'card'
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-102 font-black'
                        : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <CreditCard size={20} />
                    <span className="text-xs">Card Payment</span>
                  </button>

                  {/* UPI Tab */}
                  <button
                    onClick={() => setActivePaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      activePaymentMethod === 'upi'
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-102 font-black'
                        : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <QrCode size={20} />
                    <span className="text-xs">UPI / QR Code</span>
                  </button>

                  {/* Wallet Tab */}
                  <button
                    onClick={() => setActivePaymentMethod('wallet')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      activePaymentMethod === 'wallet'
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-102 font-black'
                        : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Wallet size={20} />
                    <span className="text-xs">Wallets / NetBank</span>
                  </button>

                </div>
              </div>

              {/* CARD PAYMENT FORM */}
              {activePaymentMethod === 'card' && (
                <div className={`p-6 rounded-3xl border space-y-5 animate-fadeIn ${
                  theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-zinc-800">
                    <h4 className="text-sm font-black uppercase tracking-wider text-rose-500">
                      Credit / Debit Card Form
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span>VISA</span> • <span>Mastercard</span> • <span>RuPay</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardForm.cardNumber}
                          onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                          placeholder="4532 7812 9012 3456"
                          className={`w-full p-3.5 rounded-2xl border text-sm font-mono font-black focus:outline-none focus:border-rose-500 ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                        <CreditCard size={18} className="absolute right-4 top-4 text-slate-500" />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardForm.cardHolder}
                        onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                        placeholder="NAME ON CARD"
                        className={`w-full p-3.5 rounded-2xl border text-sm font-black uppercase focus:outline-none focus:border-rose-500 ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className={`w-full p-3.5 rounded-2xl border text-sm font-mono font-black focus:outline-none focus:border-rose-500 ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          placeholder="***"
                          className={`w-full p-3.5 rounded-2xl border text-sm font-mono font-black focus:outline-none focus:border-rose-500 ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Save Card Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={cardForm.saveCard}
                        onChange={(e) => setCardForm({ ...cardForm, saveCard: e.target.checked })}
                        className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                      />
                      <label htmlFor="saveCard" className="text-xs font-bold text-slate-400 cursor-pointer">
                        Save card securely for faster 1-click checkout
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI PAYMENT UI */}
              {activePaymentMethod === 'upi' && (
                <div className={`p-6 rounded-3xl border space-y-6 animate-fadeIn ${
                  theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-zinc-800">
                    <h4 className="text-sm font-black uppercase tracking-wider text-rose-500">
                      UPI & QR Code Instant Payment
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-400">Zero Convenience Charge</span>
                  </div>

                  {/* UPI Apps selector */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm UPI' },
                      { id: 'bhim', name: 'BHIM UPI' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-3 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                          selectedUpiApp === app.id
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                            : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>

                  {/* VPA UPI ID Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Virtual Payment Address (UPI ID)</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className={`flex-1 p-3.5 rounded-2xl border text-sm font-black focus:outline-none focus:border-rose-500 ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => showToast('✓ Validated UPI Address!', 'success')}
                        className="px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  {/* Dynamic QR Code Box */}
                  <div className="p-5 rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-rose-400">
                      <QrCode size={18} /> Or Scan QR Code to Pay ₹{finalPayableAmount}
                    </div>
                    
                    <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-xl flex items-center justify-center border-2 border-rose-500">
                      {/* Stylized Simulated QR Matrix */}
                      <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col justify-between p-1.5">
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white bg-rose-500 rounded"></div>
                          <div className="w-6 h-6 border-2 border-white bg-rose-500 rounded"></div>
                        </div>
                        <div className="text-[8px] font-mono text-white text-center font-black">PAY ₹{finalPayableAmount}</div>
                        <div className="flex justify-between">
                          <div className="w-6 h-6 border-2 border-white bg-rose-500 rounded"></div>
                          <div className="w-4 h-4 bg-white rounded-full mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400">
                      Scan using Google Pay, PhonePe, Paytm, or BHIM app on your phone.
                    </p>
                  </div>
                </div>
              )}

              {/* WALLETS & NETBANKING PAYMENT UI */}
              {activePaymentMethod === 'wallet' && (
                <div className={`p-6 rounded-3xl border space-y-5 animate-fadeIn ${
                  theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
                }`}>
                  <h4 className="text-sm font-black uppercase tracking-wider text-rose-500 border-b pb-3 border-zinc-800">
                    Select Digital Wallet / Net Banking
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'paytm', name: 'Paytm Wallet' },
                      { id: 'amazon', name: 'Amazon Pay' },
                      { id: 'mobikwik', name: 'MobiKwik' },
                      { id: 'sbi', name: 'SBI NetBank' },
                      { id: 'hdfc', name: 'HDFC Bank' },
                      { id: 'icici', name: 'ICICI Bank' },
                      { id: 'axis', name: 'Axis Bank' },
                      { id: 'kotak', name: 'Kotak Bank' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id)}
                        className={`p-3 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                          selectedWallet === w.id
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                            : theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-slate-400 p-3 rounded-2xl border border-zinc-800 bg-zinc-950/60">
                    ℹ️ You will be redirected to the secure partner portal of <span className="font-extrabold text-rose-400">{selectedWallet.toUpperCase()}</span> to authorize your payment of ₹{finalPayableAmount}.
                  </p>
                </div>
              )}

              {/* SIMULATION CONTROLS FOR TESTING */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <span className="text-slate-400">Simulate Test Mode Outcome:</span>
                <button
                  type="button"
                  onClick={() => setShouldSimulateFailure(!shouldSimulateFailure)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-black cursor-pointer transition-all ${
                    shouldSimulateFailure
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-zinc-800 text-emerald-400 border-zinc-700'
                  }`}
                >
                  {shouldSimulateFailure ? '🔴 Simulate Failure' : '🟢 Simulate Success'}
                </button>
              </div>

              {/* PAY BUTTON */}
              <button
                onClick={handleExecutePayment}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/50 hover:scale-101 transition-all cursor-pointer"
              >
                <Lock size={18} />
                <span>PAY NOW ₹{finalPayableAmount}</span>
              </button>

            </div>

            {/* RIGHT COLUMN: BOOKING SUMMARY BREAKDOWN & PROMO CODE */}
            <div className="space-y-6">
              
              {/* BOOKING SUMMARY CARD */}
              <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-xl ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/60'
              }`}>
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-rose-500 border-b pb-3 border-zinc-800">
                  <Film size={18} /> Booking Summary
                </h3>

                {/* Movie Header Card */}
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                    <img src={bookingData.posterPath} alt={bookingData.movieTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="bg-rose-500/20 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      UA 13+
                    </span>
                    <h4 className={`text-base font-black truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {bookingData.movieTitle}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 truncate">
                      {bookingData.theater}
                    </p>
                    <p className="text-xs font-bold text-emerald-400">
                      {bookingData.showTime} ({bookingData.date})
                    </p>
                  </div>
                </div>

                {/* Seats list */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <span className="text-slate-400 font-bold">Selected Seats:</span>
                  <span className="font-black text-amber-400">{bookingData.seatsText}</span>
                </div>

                {/* PROMO / COUPON FORM */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-zinc-800">
                  <span className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <Gift size={14} className="text-rose-500" /> Have a Promo Code?
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. FIRST50"
                      className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-black uppercase focus:outline-none focus:border-rose-500 ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {couponSuccess && <p className="text-[11px] font-bold text-emerald-400">{couponSuccess}</p>}
                  {couponError && <p className="text-[11px] font-bold text-rose-400">{couponError}</p>}
                </form>

                {/* PRICE BREAKDOWN ITEMIZATION */}
                <div className="space-y-2 pt-3 border-t border-dashed border-zinc-800 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seats Subtotal:</span>
                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Convenience & Booking Fee:</span>
                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{bookingData.convenienceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GST & Taxes (18%):</span>
                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{bookingData.gstTax}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-black">
                      <span>Promo Discount:</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-zinc-800 text-base font-black">
                    <span className="text-rose-500">Amount Payable:</span>
                    <span className="text-xl font-black text-rose-500">₹{finalPayableAmount}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default Payment;
