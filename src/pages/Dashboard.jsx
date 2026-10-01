import React, { useState, useEffect } from 'react';
import { 
  Film, Building2, Ticket, Clock, Calendar, DollarSign,
  Clock3, Sparkles, Rocket, Search, ArrowRight, Clapperboard,
  TrendingUp, Zap, Star, Bell,
  BarChart3, LineChart, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchMovies, fetchUpcomingMovies } from '../services/tmdbService';

export const Dashboard = () => {
  const { theme, currentUser, userBookings, showToast } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('today');

  // Live Trending Movies & Upcoming Movies loaded from TMDB
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [notifiedMovies, setNotifiedMovies] = useState([]);

  // Load live TMDB movies & upcoming releases for dashboard showcase
  useEffect(() => {
    const loadDashboardMovies = async () => {
      setLoadingMovies(true);
      setLoadingUpcoming(true);
      
      const [data, upcomingData] = await Promise.all([
        fetchMovies({ page: 1, limit: 6 }),
        fetchUpcomingMovies(1)
      ]);

      if (data.success) {
        setTrendingMovies(data.results.slice(0, 6));
      }
      if (upcomingData.success) {
        setUpcomingMovies(upcomingData.results.slice(0, 6));
      }

      setLoadingMovies(false);
      setLoadingUpcoming(false);
    };

    loadDashboardMovies();
  }, []);

  const handleToggleNotify = (movieId, movieTitle) => {
    if (notifiedMovies.includes(movieId)) {
      setNotifiedMovies(prev => prev.filter(id => id !== movieId));
      showToast(`Removed pre-booking reminder for "${movieTitle}".`, 'info');
    } else {
      setNotifiedMovies(prev => [...prev, movieId]);
      showToast(`🔔 Reminder set for "${movieTitle}"! We will alert you on ticket release date.`, 'success');
    }
  };

  // Real-Time Calculations starting at 0 based on actual user bookings
  const realTotalBookings = userBookings ? userBookings.length : 0;
  const realTotalRevenue = userBookings ? userBookings.reduce((sum, b) => sum + (b.amount || 350), 0) : 0;

  // Static Platform Metrics
  const totalMoviesCount = 25;
  const totalTheatresCount = 12;
  const availableShowsCount = 48;
  const upcomingMoviesCount = upcomingMovies.length || 6;

  // Filter recent bookings
  const filteredBookings = (userBookings || []).filter((b) =>
    (b.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.movie || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.theater || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dynamic line graph height values starting at 0
  const maxRevenueVal = Math.max(1000, realTotalRevenue);
  const timeSlots = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM', '11:59 PM'];
  
  // Dynamic graph curve points starting at 0
  const graphPoints = timeSlots.map((_, idx) => {
    if (realTotalBookings === 0) return 0;
    // Distribute actual revenue across time slots
    const slotBookings = (userBookings || []).filter((_, i) => i % timeSlots.length === idx);
    return slotBookings.reduce((acc, curr) => acc + (curr.amount || 350), 0);
  });

  // Calculate SVG heights (0 to 100 px)
  const svgHeights = graphPoints.map(val => {
    if (realTotalRevenue === 0) return 110; // Flat bottom line
    return 110 - Math.min(90, Math.round((val / maxRevenueVal) * 90));
  });

  // SVG Path string for SVG Area Chart
  const svgPathD = `M 20 ${svgHeights[0]} 
    L 120 ${svgHeights[1]} 
    L 220 ${svgHeights[2]} 
    L 320 ${svgHeights[3]} 
    L 420 ${svgHeights[4]} 
    L 520 ${svgHeights[5]}`;

  const svgAreaD = `${svgPathD} L 520 120 L 20 120 Z`;

  const cardClass = theme === 'dark'
    ? 'bg-zinc-900/90 border-zinc-800 shadow-xl shadow-black/50 text-slate-100'
    : 'bg-white border-slate-200 shadow-xl shadow-slate-200/60 text-slate-900';

  const pillBgClass = theme === 'dark'
    ? 'bg-zinc-950 border-zinc-800'
    : 'bg-slate-100 border-slate-200';

  // Reliable image source getter with fallback
  const getMoviePoster = (m) => {
    if (m.poster_path) return m.poster_path;
    if (m.poster) return m.poster;
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
  };

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* TOP HEADER NAVIGATION */}
      <Navbar />

      {/* DASHBOARD MAIN CONTENT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* 1. ADVANCE REAL-TIME HERO BANNER */}
        <div className={`border p-6 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all ${
          theme === 'dark'
            ? 'bg-zinc-900/80 border-zinc-800 text-white shadow-xl shadow-black/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-md shadow-slate-200/50'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${
              theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              <Clapperboard size={24} />
            </div>
            <div className="space-y-1">
              
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Welcome Back, <span className="text-rose-400">{currentUser?.name || 'Manikanta'}!</span> 👋
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                System initial ticket count is at <strong className="text-rose-400 font-semibold">{realTotalBookings} bookings</strong> (₹{realTotalRevenue.toLocaleString()} gross revenue). Reserve seats in Movies or Theatre Listing to watch live performance graphs update!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            <Link
              to="/movies"
              className={`px-4 py-2 rounded-xl border font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <span>Movies Catalog</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/theatres"
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/30'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              }`}
            >
              <span>Explore Theatres</span>
              <Building2 size={14} />
            </Link>
          </div>
        </div>

        {/* 2. REAL-TIME KEY PERFORMANCE INDICATOR CARDS (INITIAL STATS AT 0) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          
          {/* Card 1: Total Movies */}
          <Link to="/movies" className={`border hover:border-rose-500/30 rounded-2xl p-4 flex flex-col justify-between transition-all group ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider group-hover:text-rose-400 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Movies</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-zinc-800/60 text-slate-300 border-zinc-700/50' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Film size={16} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalMoviesCount}</div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block flex items-center gap-1 group-hover:text-rose-400">
                TMDB Live Catalog <ArrowRight size={10} />
              </span>
            </div>
          </Link>

          {/* Card 2: Total Theatres */}
          <Link to="/theatres" className={`border hover:border-rose-500/30 rounded-2xl p-4 flex flex-col justify-between transition-all group ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider group-hover:text-rose-400 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Theatres</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-zinc-800/60 text-slate-300 border-zinc-700/50' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Building2 size={16} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{totalTheatresCount}</div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block flex items-center gap-1 group-hover:text-rose-400">
                5 Active Cities <ArrowRight size={10} />
              </span>
            </div>
          </Link>

          {/* Card 3: Total Bookings (STARTS AT 0) */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Bookings</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}>
                <Ticket size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">{realTotalBookings}</div>
              <span className={`text-[11px] font-medium mt-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Tickets Booked</span>
            </div>
          </div>

          {/* Card 4: Available Shows */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Available Shows</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-zinc-800/60 text-slate-300 border-zinc-700/50' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Clock3 size={16} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{availableShowsCount}</div>
              <span className={`text-[11px] font-medium mt-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Scheduled Today</span>
            </div>
          </div>

          {/* Card 5: Today's Sales (STARTS AT 0) */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Today's Sales</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}>
                <Calendar size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">{realTotalBookings}</div>
              <span className={`text-[11px] font-medium mt-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Tickets Sold Today</span>
            </div>
          </div>

          {/* Card 6: Upcoming Movies */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Upcoming</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-zinc-800/60 text-slate-300 border-zinc-700/50' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Rocket size={16} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{upcomingMoviesCount}</div>
              <span className={`text-[11px] font-medium mt-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Pre-booking Open</span>
            </div>
          </div>

          {/* Card 7: Box Office Revenue (STARTS AT ₹0) */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${cardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Box Office Gross</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                <DollarSign size={16} />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{realTotalRevenue.toLocaleString()}</div>
              <span className={`text-[11px] font-medium mt-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Collections</span>
            </div>
          </div>

        </div>

        {/* 3. REAL-TIME INTERACTIVE ANALYTICS GRAPHS SECTION (STARTS AT 0) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Graph 1: Ticket Sales & Revenue Trend Area Graph (SVG Curve) */}
          <div className={`lg:col-span-2 border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${cardClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <LineChart className="text-rose-400" size={20} /> Revenue & Ticket Sales Performance Trend
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    theme === 'dark' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    LIVE ANALYTICS
                  </span>
                </div>
                <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dynamic ticket sales curve starting at initial count 0
                </p>
              </div>

              {/* Analytics Period Tabs */}
              <div className={`p-1 rounded-xl border flex items-center gap-1 text-[11px] font-semibold ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
              }`}>
                {['today', 'week', 'all'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAnalyticsPeriod(p)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      analyticsPeriod === p
                        ? 'bg-rose-600/90 text-white shadow-sm font-bold'
                        : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p === 'today' ? 'Today (24h)' : p === 'week' ? 'This Week' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Line / Area Graph */}
            <div className="w-full relative py-4">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <Activity size={14} /> Revenue Level: ₹{realTotalRevenue.toLocaleString()}
                </span>
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                  Bookings Logged: <strong className="text-rose-400">{realTotalBookings}</strong>
                </span>
              </div>

              {/* Chart Canvas */}
              <div className={`w-full h-44 rounded-2xl border relative overflow-hidden flex items-center justify-center ${
                theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <svg className="w-full h-full overflow-visible" viewBox="0 0 540 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="30" x2="540" y2="30" stroke={theme === 'dark' ? '#27272a' : '#e2e8f0'} strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="70" x2="540" y2="70" stroke={theme === 'dark' ? '#27272a' : '#e2e8f0'} strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="110" x2="540" y2="110" stroke={theme === 'dark' ? '#27272a' : '#e2e8f0'} strokeDasharray="4 4" strokeWidth="1" />

                  {/* Gradient Area Fill */}
                  <path d={svgAreaD} fill="url(#roseGradient)" />

                  {/* Glowing Stroke Curve Line */}
                  <path
                    d={svgPathD}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dynamic Nodes */}
                  {svgHeights.map((h, i) => (
                    <g key={i}>
                      <circle
                        cx={20 + i * 100}
                        cy={h}
                        r="4.5"
                        fill="#e11d48"
                        stroke={theme === 'dark' ? '#09090b' : '#ffffff'}
                        strokeWidth="2"
                        className="transition-all duration-500 hover:r-6"
                      />
                    </g>
                  ))}
                </svg>

                {realTotalBookings === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/5 backdrop-blur-[1px]">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      theme === 'dark' ? 'bg-zinc-900/90 text-rose-300 border-rose-500/20' : 'bg-white text-rose-700 border-rose-200'
                    }`}>
                      📊 Graph Baseline Initialized at 0
                    </span>
                    <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Reserve seats in movies catalog to watch live trend updates
                    </span>
                  </div>
                )}
              </div>

              {/* Time Slot Labels */}
              <div className="flex justify-between items-center mt-3 px-2 text-[10px] font-medium text-slate-400">
                {timeSlots.map((slot, idx) => (
                  <span key={idx} className="hover:text-rose-400 transition-colors">{slot}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Graph 2: Genre & Format Occupancy Bar Chart (STARTS AT 0%) */}
          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${cardClass}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <BarChart3 className="text-rose-400" size={20} /> Screen Occupancy Graph
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  theme === 'dark' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  CAPACITY SHARE %
                </span>
              </div>
              <p className={`text-xs font-medium mb-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Format occupancy graph starting at 0% initial state
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Recliner VIP Screens', count: realTotalBookings > 0 ? Math.min(100, realTotalBookings * 20) : 0, color: 'bg-rose-500/80' },
                  { label: '4K Dolby Atmos Screens', count: realTotalBookings > 0 ? Math.min(100, realTotalBookings * 15) : 0, color: 'bg-amber-500/80' },
                  { label: 'IMAX 3D Laser Screens', count: realTotalBookings > 0 ? Math.min(100, realTotalBookings * 12) : 0, color: 'bg-indigo-500/80' },
                  { label: 'Executive Gold Lounges', count: realTotalBookings > 0 ? Math.min(100, realTotalBookings * 10) : 0, color: 'bg-emerald-500/80' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                      <span className="text-rose-400 font-mono font-bold">{item.count}% Occupied</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
                      theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.count}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty graph state hint */}
            <div className={`p-3 rounded-2xl border mt-5 text-[11px] font-semibold flex items-center justify-between ${
              theme === 'dark' ? 'bg-zinc-950/90 border-zinc-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <span>Graph Status:</span>
              <span className="text-rose-400 font-bold">
                {realTotalBookings === 0 ? '0% (Initial State)' : `${realTotalBookings} Tickets Active`}
              </span>
            </div>
          </div>

        </div>

        {/* 4. TRENDING MOVIES LIVE SHOWCASE SECTION (WITH PROPER HD IMAGES & FALLBACKS) */}
        <div className={`border rounded-3xl p-6 shadow-lg space-y-4 ${cardClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className="text-rose-400" size={20} /> 🔥 Trending Movies Now Screening
              </h3>
              <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Click any movie to view showtimes & reserve seats in real time
              </p>
            </div>
            <Link
              to="/movies"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View Full 25 Movie Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loadingMovies ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className={`aspect-[2/3] rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {trendingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                    theme === 'dark' ? 'border-zinc-800 bg-zinc-950 hover:border-zinc-700' : 'border-slate-200 bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-[2/3] overflow-hidden relative bg-zinc-800">
                    <img
                      src={getMoviePoster(movie)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {movie.vote_average || movie.rating || 8.0}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className={`text-xs font-bold line-clamp-1 group-hover:text-rose-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {movie.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>{Array.isArray(movie.genres) ? movie.genres[0] : 'Cinema'}</span>
                      <span className="text-slate-400 font-medium">{movie.release_date?.split('-')[0] || movie.year || '2024'}</span>
                    </div>

                    <Link
                      to={`/movie/${movie.id}`}
                      className="mt-2 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer border border-zinc-700/60"
                    >
                      <span>Showtimes & Book</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4B. UPCOMING MOVIES & PRE-BOOKING ALERTS (REAL-TIME TMDB RELEASES) */}
        <div className={`border rounded-3xl p-6 shadow-lg space-y-4 ${cardClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Rocket className="text-amber-400" size={20} /> 🚀 Upcoming Theatrical Releases
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  theme === 'dark' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  PRE-BOOKING SOON
                </span>
              </div>
              <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Explore upcoming blockbuster releases and set pre-booking alerts in real time
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Showing <strong className="text-amber-400">{upcomingMovies.length}</strong> Upcoming Titles
            </span>
          </div>

          {loadingUpcoming ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className={`aspect-[2/3] rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {upcomingMovies.map((movie) => {
                const isNotified = notifiedMovies.includes(movie.id);
                return (
                  <div
                    key={movie.id}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                      theme === 'dark' ? 'border-zinc-800 bg-zinc-950 hover:border-amber-500/30' : 'border-slate-200 bg-slate-100 hover:border-amber-300'
                    }`}
                  >
                    <div className="aspect-[2/3] overflow-hidden relative bg-zinc-800">
                      <img
                        src={movie.poster_path || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80'}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-amber-500/90 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        {movie.release_date ? `Release: ${movie.release_date.split('-')[0]}` : 'Coming Soon'}
                      </div>
                      <button
                        onClick={() => handleToggleNotify(movie.id, movie.title)}
                        title={isNotified ? 'Cancel Alert' : 'Notify on Release'}
                        className={`absolute top-2 right-2 p-1.5 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                          isNotified
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                            : 'bg-black/60 text-slate-300 border-white/20 hover:text-white'
                        }`}
                      >
                        <Bell size={12} className={isNotified ? 'fill-white' : ''} />
                      </button>
                    </div>

                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className={`text-xs font-bold line-clamp-1 group-hover:text-amber-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {Array.isArray(movie.genres) ? movie.genres.join(', ') : 'Action, Sci-Fi'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleNotify(movie.id, movie.title)}
                        className={`w-full py-1.5 rounded-lg font-semibold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isNotified
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <Bell size={11} />
                        <span>{isNotified ? '✓ Alert Active' : 'Set Ticket Alert'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. CINEMA NETWORK & OPERATIONAL SHORTCUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cinema Format Distribution */}
          <div className={`lg:col-span-2 border rounded-3xl p-6 shadow-lg ${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <TrendingUp className="text-rose-400" size={20} /> Partner Theatre Formats
                </h3>
                <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Screen distribution across premium formats
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                theme === 'dark' ? 'bg-zinc-800 text-slate-300 border-zinc-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                100% ONLINE
              </span>
            </div>

            <div className="space-y-4">
              {[
                { label: 'IMAX 3D & Laser screens', share: 35, color: 'bg-rose-500/80' },
                { label: '4K Dolby Atmos Multiplexes', share: 45, color: 'bg-amber-500/80' },
                { label: 'Recliner VIP Lounges', share: 20, color: 'bg-indigo-500/80' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                    <span className="text-slate-400 font-mono font-medium">{item.share}%</span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-950' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.share}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Hub */}
          <div className={`border rounded-3xl p-6 shadow-lg flex flex-col justify-between ${cardClass}`}>
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Zap className="text-rose-400" size={20} /> Cinema Operations Hub
              </h3>
              <p className={`text-xs font-medium mb-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Direct navigation shortcuts</p>

              <div className="space-y-3">
                <Link to="/movies" className={`w-full border hover:border-zinc-700 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm transition-all group ${pillBgClass}`}>
                  <span className={`flex items-center gap-2.5 group-hover:text-rose-400 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Clapperboard size={18} className="text-rose-400" /> Movie Catalog (TMDB API)
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    theme === 'dark' ? 'bg-zinc-800 text-slate-300 border-zinc-700' : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    25 Movies <ArrowRight size={10} />
                  </span>
                </Link>

                <Link to="/theatres" className={`w-full border hover:border-zinc-700 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm transition-all group ${pillBgClass}`}>
                  <span className={`flex items-center gap-2.5 group-hover:text-rose-400 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Building2 size={18} className="text-rose-400" /> Partner Cinema Screens
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    theme === 'dark' ? 'bg-zinc-800 text-slate-300 border-zinc-700' : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    12 Theatres <ArrowRight size={10} />
                  </span>
                </Link>

                <div className={`w-full border p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm ${pillBgClass}`}>
                  <span className={`flex items-center gap-2.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Ticket size={18} className="text-rose-400" /> Live Ticket Counter
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {realTotalBookings} Tickets
                  </span>
                </div>

                <div className={`w-full border p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm ${pillBgClass}`}>
                  <span className={`flex items-center gap-2.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Clock size={18} className="text-rose-400" /> Showtime Engine
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    theme === 'dark' ? 'bg-zinc-800 text-slate-300 border-zinc-700' : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    48 Shows Today
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Link
                to="/movies"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-500/30"
              >
                <Film size={16} />
                <span>Explore Movies & Book Tickets</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* 6. REAL-TIME CUSTOMER BOOKINGS STREAM TABLE */}
        <div className={`border rounded-3xl p-6 shadow-lg ${cardClass}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <Ticket className="text-rose-400" size={20} /> Customer Ticket Stream & Seat Registry
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  theme === 'dark' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  COUNT: {realTotalBookings}
                </span>
              </div>
              <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Live stream of customer ticket reservations & digital seat assignments
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by customer, movie, ID or theater..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border rounded-xl pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-rose-500 w-64 transition-colors ${
                    theme === 'dark'
                      ? 'bg-zinc-950 border-zinc-800 text-white placeholder:text-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <Link
                to="/movies"
                className="px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 border border-rose-500/30"
              >
                <Film size={14} /> Browse Movies
              </Link>
            </div>
          </div>

          {/* Clean Recent Bookings Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b uppercase tracking-wider font-bold text-[11px] ${
                  theme === 'dark' ? 'border-zinc-800 text-slate-400 bg-zinc-950/80' : 'border-slate-200 text-slate-600 bg-slate-100'
                }`}>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Movie Title</th>
                  <th className="py-3.5 px-4">Theater & Seats</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Time</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-medium ${theme === 'dark' ? 'divide-zinc-800/80' : 'divide-slate-200'}`}>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-100/60'}`}>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{b.id}</td>
                      <td className={`py-3.5 px-4 font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{b.movie}</td>
                      <td className={`py-3.5 px-4 font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{b.theater} • <span className="text-rose-400 font-bold">{b.seats}</span></td>
                      <td className={`py-3.5 px-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{b.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {b.status}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-[11px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{b.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={`py-12 text-center text-xs font-semibold ${
                      theme === 'dark' ? 'text-slate-400 bg-zinc-950/40' : 'text-slate-500 bg-slate-50'
                    }`}>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Ticket size={24} className="text-rose-400 opacity-60" />
                        <span>🎟️ No real-time ticket bookings recorded yet. (Count: 0)</span>
                        <p className="text-[11px] font-normal text-slate-400">
                          Go to Movies Catalog or Theatre Listing and click "Reserve Seats" to make your first booking!
                        </p>
                      </div>
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
