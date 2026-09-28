import React, { useState, useEffect } from 'react';
import { 
  Film, Building2, Ticket, Clock, Calendar, DollarSign, 
  Clock3, Sparkles, LogOut, Rocket, Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Real-Time Clock State
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Revenue Analytics Period State
  const [revenuePeriod, setRevenuePeriod] = useState('daily');
  const [searchTerm, setSearchTerm] = useState('');

  // All KPI Statistics & Data Counts
  const totalMovies = 0;
  const totalTheatres = 0;
  const totalBookings = 0;
  const availableShows = 0;
  const todaysBookingsCount = 0;
  const upcomingMoviesCount = 0;
  const totalRevenue = 0;
  const filteredRevenueByPeriod = 0;

  // Recent Bookings Stream (Empty Array)
  const recentBookings = [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-black text-slate-100 flex flex-col font-sans overflow-y-auto no-scrollbar">
      
      {/* TOP HEADER - SLEEK BLACK THEME */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-[3px] border-rose-500 bg-rose-950/50 flex items-center justify-center text-rose-500 shadow-md shadow-rose-500/20">
            <Film size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              MovieMax <span className="text-rose-500">Operations Hub</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Real-Time Ticket Management & Cinema Operations System</p>
          </div>
        </div>

        {/* User Session & Real-Time Clock */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-rose-400 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Clock size={14} className="text-rose-500 animate-pulse" />
            <span>{time.toLocaleTimeString()} • {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center font-bold text-xs text-white">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">{currentUser?.name || 'Manager'}</span>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 p-1 ml-1 transition-colors cursor-pointer"
              title="Logout Session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD MAIN CONTENT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. KEY PERFORMANCE INDICATOR CARDS (BLACK THEME WITH DARK ZINC CARDS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          
          {/* Card 1: Total Movies */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Movies</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Film size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{totalMovies}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Active Catalog</span>
            </div>
          </div>

          {/* Card 2: Total Theatres */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Theatres</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Building2 size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{totalTheatres}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Active Screens</span>
            </div>
          </div>

          {/* Card 3: Total Bookings */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Ticket size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{totalBookings}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Live Tickets</span>
            </div>
          </div>

          {/* Card 4: Available Shows */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Shows</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Clock3 size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{availableShows}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Scheduled Today</span>
            </div>
          </div>

          {/* Card 5: Today's Bookings */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Bookings</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Calendar size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-rose-500">{todaysBookingsCount}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Tickets Sold</span>
            </div>
          </div>

          {/* Card 6: Upcoming Movies */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Movies</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <Rocket size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{upcomingMoviesCount}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Pre-booking</span>
            </div>
          </div>

          {/* Card 7: Revenue Summary Overview */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
              <div className="w-8 h-8 rounded-full bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-900/40">
                <DollarSign size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400 font-semibold mt-1 block">Total Collections</span>
            </div>
          </div>

        </div>

        {/* 2. REVENUE SUMMARY (DUMMY DATA) & QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* REVENUE SUMMARY CARD */}
          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="text-rose-500" size={20} /> Revenue Summary (Dummy Data)
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time box office ticket sales & financial analytics</p>
              </div>

              {/* Period Tabs */}
              <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center gap-1">
                {[
                  { id: 'daily', label: 'Today' },
                  { id: 'weekly', label: 'This Week' },
                  { id: 'monthly', label: 'All Time' },
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setRevenuePeriod(period.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${revenuePeriod === period.id ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-400">Selected Period Revenue ({revenuePeriod})</span>
                <div className="text-3xl font-black text-rose-500 mt-1">₹{filteredRevenueByPeriod.toLocaleString()}</div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Real ticket sales sum</span>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl">
                <span className="text-xs font-bold text-slate-400">Total Lifetime Box Office</span>
                <div className="text-3xl font-black text-white mt-1">₹{totalRevenue.toLocaleString()}</div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Cumulative movie earnings</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Top Performing Movies Share</span>
              <div className="py-6 text-center text-slate-400 text-xs font-bold border border-dashed border-zinc-800 rounded-xl p-4 bg-zinc-950/30">
                📊 No movie sales recorded yet. Count: 0
              </div>
            </div>
          </div>

          {/* QUICK ACTION CARDS */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <Sparkles className="text-rose-500" size={20} /> Quick Action Cards
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-5">System status & active operations view</p>

              <div className="space-y-3">
                <div className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-sm">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Ticket size={18} className="text-rose-500" /> Ticket Booking Counter
                  </span>
                  <span className="bg-rose-950/80 text-rose-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-800/60">
                    0 Bookings
                  </span>
                </div>

                <div className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-sm">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Film size={18} className="text-rose-500" /> Movie Catalog Sync
                  </span>
                  <span className="bg-rose-950/80 text-rose-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-800/60">
                    0 Movies
                  </span>
                </div>

                <div className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-sm">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Building2 size={18} className="text-rose-500" /> Cinema Screens
                  </span>
                  <span className="bg-rose-950/80 text-rose-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-800/60">
                    0 Screens
                  </span>
                </div>

                <div className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-sm">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Clock size={18} className="text-rose-500" /> Showtime Schedule
                  </span>
                  <span className="bg-rose-950/80 text-rose-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-rose-800/60">
                    0 Shows
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. RECENT BOOKINGS SECTION */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Ticket className="text-rose-500" size={20} /> Recent Bookings
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Live stream of customer ticket booking records</p>
            </div>

            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-rose-500" />
              <input
                type="text"
                placeholder="Search recent bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-white outline-none focus:border-rose-500 w-56 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Clean Recent Bookings Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-slate-400 uppercase tracking-wider font-extrabold text-[11px] bg-zinc-950/60">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Movie Title</th>
                  <th className="py-3 px-4">Theater & Seats</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-medium">
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{b.id}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{b.customer}</td>
                      <td className="py-3.5 px-4 text-slate-200 font-bold">{b.movie}</td>
                      <td className="py-3.5 px-4 text-slate-400">{b.theater} • {b.seats}</td>
                      <td className="py-3.5 px-4 font-black text-white">₹{b.amount}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{b.status}</td>
                      <td className="py-3.5 px-4 text-slate-400">{b.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs font-bold bg-zinc-950/40">
                      🎟️ No recent bookings recorded yet. Count: 0
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
};

export default Dashboard;
