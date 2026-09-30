import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Film, Building2, Ticket, CheckCircle2, 
  Sparkles, Info, Crown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchMovieDetails } from '../services/tmdbService';

export const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, showToast, addBooking, currentUser } = useAuth();

  const MAX_SEAT_LIMIT = 10;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected Showtime & Theatre State
  const [selectedTheater, setSelectedTheater] = useState('AMB Cinemas: Screen 1 (4K Dolby)');
  const [selectedTime, setSelectedTime] = useState('06:30 PM');

  // Selected Seats State
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fixed Occupied/Booked Seats for realism
  const occupiedSeatCodes = ['A3', 'A4', 'B7', 'C2', 'C3', 'D8', 'D9', 'F5', 'F6', 'G1', 'G2'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id || 533535);
      setMovie(data);
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Seat Rows & Categories Configuration (Recliner VIP at Top = Back of Theatre, Screen at Bottom)
  const seatCategories = [
    {
      name: 'Recliner VIP (Back Row Luxury)',
      price: 350,
      rows: ['A', 'B'],
      isVip: true,
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      sectionLabel: '👑 BACK SIDE OF THEATRE • LUXURY RECLINER LOUNGE'
    },
    {
      name: 'Premium Screen (Executive)',
      price: 250,
      rows: ['C', 'D', 'E'],
      isVip: false,
      badgeColor: 'text-rose-500 border-rose-500/40 bg-rose-500/10',
      sectionLabel: '🎥 MIDDLE HALL SECTION • PREMIUM VIEWING'
    },
    {
      name: 'Standard Gold (Front Screen)',
      price: 180,
      rows: ['F', 'G'],
      isVip: false,
      badgeColor: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10',
      sectionLabel: '🍿 FRONT SECTION • NEAR SCREEN VIEWING'
    }
  ];

  // Toggle seat selection
  const handleSeatClick = (seatCode, categoryName, seatPrice) => {
    if (occupiedSeatCodes.includes(seatCode)) {
      showToast(`Seat ${seatCode} is already booked by another customer.`, 'error');
      return;
    }

    const exists = selectedSeats.some((s) => s.code === seatCode);

    if (exists) {
      // Remove seat
      setSelectedSeats((prev) => prev.filter((s) => s.code !== seatCode));
    } else {
      // Check max limit
      if (selectedSeats.length >= MAX_SEAT_LIMIT) {
        showToast(`⚠️ Maximum ${MAX_SEAT_LIMIT} seats allowed per booking transaction.`, 'error');
        return;
      }

      setSelectedSeats((prev) => [
        ...prev,
        { code: seatCode, category: categoryName, price: seatPrice }
      ]);
    }
  };

  // Calculations
  const totalSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const grandTotal = totalSubtotal + convenienceFee;

  // Confirm Booking Handler
  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least 1 seat to proceed with booking.', 'error');
      return;
    }

    const seatCodesString = selectedSeats.map((s) => s.code).join(', ');
    const categorySummary = Array.from(new Set(selectedSeats.map(s => s.category.split(' ')[0]))).join(' / ');

    const newBooking = addBooking({
      customer: currentUser?.name || 'Manikanta',
      movie: movie?.title || 'Deadpool & Wolverine',
      theater: `${selectedTheater} [${selectedTime}]`,
      seats: `${categorySummary} (${seatCodesString})`,
      amount: grandTotal,
    });

    showToast(`🎟️ Reserved ${selectedSeats.length} seats for ${movie?.title}! Booking ID: ${newBooking.id}`, 'success');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
            <p className="text-xs font-bold text-slate-400">Loading Interactive Cinema Seat Layout...</p>
          </div>
        </div>
      </div>
    );
  }

  const cardClass = theme === 'dark'
    ? 'bg-zinc-900/90 border-zinc-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900 shadow-xl';

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* NAVBAR */}
      <Navbar />

      {/* TOP SELECTION HEADER */}
      <div className={`border-b py-4 px-6 transition-colors ${
        theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:bg-rose-600 hover:text-white text-slate-300' : 'bg-slate-100 border-slate-300 hover:bg-rose-500 hover:text-white text-slate-700'
              }`}
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-500/20 text-rose-500 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} /> Real BookMyShow Cinema Layout
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  Max Limit: {MAX_SEAT_LIMIT} Seats
                </span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {movie?.title}
              </h1>
            </div>
          </div>

          {/* Theatre & Showtime Quick Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`border rounded-xl px-3 py-1.5 flex items-center gap-2 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <Building2 size={14} className="text-rose-500" />
              <select
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                className={`bg-transparent text-xs font-bold outline-none cursor-pointer ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                <option value="AMB Cinemas: Screen 1 (4K Dolby)">AMB Cinemas - Screen 1 (4K)</option>
                <option value="Prasad’s Multiplex (IMAX 3D)">Prasad’s Multiplex - IMAX 3D</option>
                <option value="PVR Inorbit Mall (Screen 4)">PVR Inorbit Mall - Screen 4</option>
                <option value="Asian Radhika Multiplex (Screen 2)">Asian Radhika - Screen 2</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              {['11:00 AM', '02:15 PM', '06:30 PM', '09:45 PM'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    selectedTime === t
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                      : theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEAT SELECTION MAIN CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE SEAT GRID LAYOUT */}
        <div className={`lg:col-span-2 border rounded-3xl p-6 shadow-xl flex flex-col items-center justify-between ${cardClass}`}>
          
          {/* TOP BANNER: BACK SIDE OF HALL ORIENTATION INDICATOR */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-rose-500/20 mb-6 text-xs font-black">
            <span className="text-amber-400 flex items-center gap-1.5">
              <Crown size={15} /> TOP ROWS A & B = RECLINER VIP (BACK SIDE OF THEATRE)
            </span>
            <span className="text-slate-400 text-[11px] font-semibold">
              SCREEN LOCATION: BOTTOM 🎬
            </span>
          </div>

          {/* SEAT MAP LEGEND */}
          <div className={`flex flex-wrap items-center justify-center gap-6 p-3 rounded-2xl border mb-8 w-full max-w-xl text-xs font-bold ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-md border ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-300'
              }`}></div>
              <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>Available</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-amber-500 border border-amber-400 text-black flex items-center justify-center text-[10px] font-black">👑</div>
              <span className="text-amber-400">Recliner VIP</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-rose-600 border border-rose-500 text-white flex items-center justify-center text-[10px] font-black">✓</div>
              <span className="text-rose-500">Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-black ${
                theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-600' : 'bg-slate-300 border-slate-400 text-slate-500'
              }`}>✕</div>
              <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>Booked</span>
            </div>
          </div>

          {/* SEAT GRID LAYOUT BY CATEGORIES (RECLINER VIP AT TOP -> STANDARD AT BOTTOM) */}
          <div className="w-full space-y-8 flex flex-col items-center">
            {seatCategories.map((cat) => (
              <div key={cat.name} className="w-full max-w-2xl space-y-3">
                
                {/* Category Header & Price */}
                <div className="flex items-center justify-between border-b pb-1.5 border-rose-500/20">
                  <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${cat.badgeColor}`}>
                    {cat.isVip && <Crown size={13} className="text-amber-400" />}
                    {cat.name}
                  </span>
                  <span className={`text-xs font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    ₹{cat.price} <span className="text-[10px] font-semibold text-slate-400">/ seat</span>
                  </span>
                </div>

                {/* Rows in Category */}
                <div className="space-y-2">
                  {cat.rows.map((rowLetter) => (
                    <div key={rowLetter} className="flex items-center justify-center gap-2">
                      <span className={`w-6 text-xs font-black text-center ${cat.isVip ? 'text-amber-400' : 'text-rose-500'}`}>
                        {rowLetter}
                      </span>

                      {/* Left Block (Seats 1-6) */}
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5, 6].map((num) => {
                          const seatCode = `${rowLetter}${num}`;
                          const isOccupied = occupiedSeatCodes.includes(seatCode);
                          const isSelected = selectedSeats.some((s) => s.code === seatCode);

                          return (
                            <button
                              key={seatCode}
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seatCode, cat.name, cat.price)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${
                                isOccupied
                                  ? theme === 'dark'
                                    ? 'bg-zinc-800/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40 scale-105'
                                  : cat.isVip
                                  ? theme === 'dark'
                                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20'
                                    : 'bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-500 hover:bg-amber-100'
                                  : theme === 'dark'
                                  ? 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-rose-500 hover:text-white'
                                  : 'bg-white border-slate-300 text-slate-800 hover:border-rose-500 hover:bg-rose-50'
                              }`}
                              title={isOccupied ? `Seat ${seatCode} Booked` : `Seat ${seatCode} (${cat.name}) - ₹${cat.price}`}
                            >
                              {isOccupied ? '✕' : isSelected ? '✓' : num}
                            </button>
                          );
                        })}
                      </div>

                      {/* Aisle Spacer */}
                      <div className="w-6 sm:w-10 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">AISLE</div>

                      {/* Right Block (Seats 7-12) */}
                      <div className="flex items-center gap-1.5">
                        {[7, 8, 9, 10, 11, 12].map((num) => {
                          const seatCode = `${rowLetter}${num}`;
                          const isOccupied = occupiedSeatCodes.includes(seatCode);
                          const isSelected = selectedSeats.some((s) => s.code === seatCode);

                          return (
                            <button
                              key={seatCode}
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seatCode, cat.name, cat.price)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${
                                isOccupied
                                  ? theme === 'dark'
                                    ? 'bg-zinc-800/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40 scale-105'
                                  : cat.isVip
                                  ? theme === 'dark'
                                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20'
                                    : 'bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-500 hover:bg-amber-100'
                                  : theme === 'dark'
                                  ? 'bg-zinc-900 border-zinc-800 text-slate-300 hover:border-rose-500 hover:text-white'
                                  : 'bg-white border-slate-300 text-slate-800 hover:border-rose-500 hover:bg-rose-50'
                              }`}
                              title={isOccupied ? `Seat ${seatCode} Booked` : `Seat ${seatCode} (${cat.name}) - ₹${cat.price}`}
                            >
                              {isOccupied ? '✕' : isSelected ? '✓' : num}
                            </button>
                          );
                        })}
                      </div>

                      <span className={`w-6 text-xs font-black text-center ${cat.isVip ? 'text-amber-400' : 'text-rose-500'}`}>
                        {rowLetter}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* BOTTOM SCREEN THIS WAY DISPLAY (BOOKMYSHOW REAL-TIME CINEMA HALL ARCHITECTURE) */}
          <div className="w-full flex flex-col items-center mt-10">
            <div className="w-full max-w-xl h-8 border-b-4 border-rose-500 rounded-[100%] shadow-[0_10px_25px_rgba(244,63,94,0.4)] flex items-center justify-center">
              <span className="bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[10px] font-black px-5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Film size={12} /> ALL EYES THIS WAY • CINEMA SCREEN 🎬
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 mt-2.5 tracking-widest uppercase flex items-center gap-1">
              ▲ RECLINER VIP BACK SIDE (ROWS A,B) &nbsp;|&nbsp; FRONT SCREEN SIDE ▼
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: SEAT SELECTION SUMMARY & BOOKING CHECKOUT DRAWER */}
        <div className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 ${cardClass}`}>
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-4">
              <h3 className={`text-lg font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Ticket size={20} className="text-rose-500" /> Booking Summary
              </h3>
              <span className="bg-rose-500/20 text-rose-500 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {selectedSeats.length} / {MAX_SEAT_LIMIT} SEATS
              </span>
            </div>

            {/* Selected Seats Badges */}
            <div className="space-y-3">
              <span className={`text-xs font-extrabold uppercase tracking-wider block ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>Selected Seats</span>

              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {selectedSeats.map((s) => (
                    <div
                      key={s.code}
                      className="bg-gradient-to-r from-rose-600 to-orange-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 group"
                    >
                      <span>{s.code}</span>
                      <span className="text-[10px] opacity-80">({s.category.split(' ')[0]})</span>
                      <button
                        onClick={() => handleSeatClick(s.code, s.category, s.price)}
                        className="hover:text-black ml-1 cursor-pointer font-bold"
                        title="Remove Seat"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 rounded-2xl border text-center text-xs font-bold flex flex-col items-center justify-center gap-1.5 ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <Info size={18} className="text-rose-500 opacity-60" />
                  <span>No seats selected yet.</span>
                  <p className="text-[11px] font-normal">Click any available seat on the grid to add to your selection.</p>
                </div>
              )}
            </div>

            {/* Movie & Venue Confirmation Metadata */}
            <div className={`mt-5 p-4 rounded-2xl border space-y-2 text-xs font-bold ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Movie:</span>
                <span className="text-rose-500 font-extrabold">{movie?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Venue:</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{selectedTheater}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Showtime:</span>
                <span className="text-emerald-500 font-extrabold">{selectedTime}</span>
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="mt-5 space-y-2 border-t pt-4 border-rose-500/20 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Tickets Subtotal ({selectedSeats.length} seats):</span>
                <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{totalSubtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Convenience & Digital Fee:</span>
                <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{convenienceFee}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-zinc-700 text-sm font-black">
                <span className="text-rose-500">Total Ticket Price:</span>
                <span className="text-xl font-black text-rose-500">₹{grandTotal}</span>
              </div>
            </div>

          </div>

          {/* Confirm Seats Action Button */}
          <button
            disabled={selectedSeats.length === 0}
            onClick={handleConfirmBooking}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white shadow-rose-500/30 transform hover:scale-102'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 size={18} />
            <span>Confirm & Reserve {selectedSeats.length} Seats (₹{grandTotal})</span>
          </button>

        </div>

      </main>

    </div>
  );
};

export default SeatSelection;
