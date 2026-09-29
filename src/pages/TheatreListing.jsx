import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, MapPin, Building2, Phone, Mail, Navigation, Star, 
  ChevronLeft, ChevronRight, RotateCcw, Sparkles, Filter, 
  Tv, Clock, Ticket, ExternalLink, Info, CheckCircle2 
} from 'lucide-react';
import { fetchTheatres } from '../services/theatreService';
import { CITIES_LIST } from '../data/theatresData';
import Navbar from '../components/Navbar';
import TheatreDetailsModal from '../components/TheatreDetailsModal';
import { useAuth } from '../context/AuthContext';

export const TheatreListing = () => {
  const { showToast, theme } = useAuth();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Modal State
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTheatresData = useCallback(async () => {
    setLoading(true);
    const data = await fetchTheatres({
      page,
      searchQuery,
      selectedCity,
      limit: 6,
    });

    if (data.success) {
      setTheatres(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
    }
    setLoading(false);
  }, [page, searchQuery, selectedCity]);

  useEffect(() => {
    loadTheatresData();
  }, [loadTheatresData]);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const topElem = document.getElementById('theatre-top');
    if (topElem) {
      topElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setPage(1);
  };

  const handleOpenDetails = (theatre) => {
    setSelectedTheatre(theatre);
    setIsModalOpen(true);
  };

  const handleOpenMaps = (e, mapsUrl) => {
    e.stopPropagation();
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="theatre-top" className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* HERO HEADER */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-zinc-800 shadow-xl shadow-black/50 text-white'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-slate-900'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={12} /> Cinema Theatre Directory
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={11} /> Real-Time Showtimes Active
              </span>
            </div>
            <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Explore <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Partner Theatres</span>
            </h1>
            <p className={`text-xs font-medium mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Search theatres by city, view available screens, show timings, exact address & Google Maps locations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`border px-4 py-2 rounded-2xl text-right ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Theatres</span>
              <span className="text-xl font-black text-rose-500">{totalResults}</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className={`p-5 rounded-3xl border space-y-4 transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-zinc-800 shadow-xl shadow-black/50'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search by theatre name, city, address, or landmark (e.g., AMB, Prasad's, Kukatpally, Banjara Hills)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className={`w-full border rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner ${
                  theme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold bg-zinc-800 px-2 py-1 rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Dropdown Filter & Reset */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setPage(1);
                  }}
                  className={`w-full border rounded-2xl px-4 py-3 text-xs font-extrabold outline-none focus:border-rose-500 cursor-pointer ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  {CITIES_LIST.map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleResetFilters}
                className="py-3 px-4 rounded-2xl bg-zinc-950 hover:bg-rose-950/80 border border-zinc-800 hover:border-rose-600/80 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 h-[46px]"
                title="Reset Filters"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

          </div>
        </div>

        {/* THEATRE GRID LISTING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 animate-pulse space-y-4">
                <div className="w-full h-44 bg-zinc-800 rounded-2xl"></div>
                <div className="h-5 bg-zinc-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded-md w-1/2"></div>
                <div className="h-10 bg-zinc-800 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : theatres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theatres.map((th) => (
              <div
                key={th.id}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between border ${
                  theme === 'dark'
                    ? 'bg-zinc-900/90 border-zinc-800 hover:border-rose-500/60 shadow-xl shadow-black/50 text-slate-100'
                    : 'bg-white border-slate-200 hover:border-rose-500/60 shadow-xl shadow-slate-200/50 text-slate-900'
                }`}
              >
                
                {/* Top Image & Badges */}
                <div className="relative w-full h-48 overflow-hidden bg-zinc-950">
                  <img
                    src={th.image}
                    alt={th.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>

                  {/* Badges: City & Rating */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <MapPin size={12} /> {th.city}
                    </span>

                    <span className="bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {th.rating}
                    </span>
                  </div>

                  {/* Screens Badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="bg-black/80 backdrop-blur-md border border-zinc-700 text-slate-200 text-[11px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Tv size={12} className="text-rose-500" />
                      {th.screensCount} Active Screens
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`text-lg font-black group-hover:text-rose-500 transition-colors tracking-tight line-clamp-1 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {th.name}
                    </h3>
                    
                    <p className={`text-xs font-medium mt-1 line-clamp-2 leading-relaxed ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {th.address}
                    </p>
                    <span className="text-[11px] font-bold text-rose-500 block mt-1">
                      📍 {th.landmark}
                    </span>
                  </div>

                  {/* Contact Info Pills */}
                  <div className={`p-3 rounded-2xl space-y-1.5 text-[11px] border ${
                    theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Phone size={13} className="text-rose-500 shrink-0" />
                      <span className="font-bold">{th.phone}</span>
                    </div>
                    <div className={`flex items-center gap-2 truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Mail size={13} className="text-rose-500 shrink-0" />
                      <span className="font-medium truncate">{th.email}</span>
                    </div>
                  </div>

                  {/* Now Showing Movies Preview */}
                  <div className={`p-3 rounded-2xl space-y-2 border ${
                    theme === 'dark' ? 'bg-zinc-950/90 border-zinc-800' : 'bg-slate-100/80 border-slate-200'
                  }`}>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block flex items-center justify-between ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span className="flex items-center gap-1"><Sparkles size={11} className="text-rose-500" /> Now Showing Movies:</span>
                      <span className="text-rose-500 font-bold">{th.screens?.length || 0} Titles</span>
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {th.screens?.map((scr, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={scr.moviePoster}
                              alt={scr.movieTitle}
                              className="w-5 h-7 rounded object-cover shrink-0 border border-zinc-700"
                            />
                            <span className={`font-black truncate group-hover:text-rose-500 transition-colors ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              {scr.movieTitle}
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold text-rose-500 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded shrink-0">
                            {scr.showtimes?.[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`grid grid-cols-2 gap-2 pt-1 border-t ${
                    theme === 'dark' ? 'border-zinc-800/80' : 'border-slate-200'
                  }`}>
                    <button
                      onClick={(e) => handleOpenMaps(e, th.mapsUrl)}
                      className={`w-full py-2.5 px-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-slate-300 hover:text-white'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      <Navigation size={13} className="text-rose-500" />
                      <span>Map Location</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetails(th)}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-950/50 cursor-pointer"
                    >
                      <Info size={13} />
                      <span>Now Showing ({th.screens?.length})</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className={`border border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 ${
            theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-300'
          }`}>
            <Building2 size={40} className="text-zinc-500 mb-1" />
            <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No Theatres Found</h3>
            <p className={`text-xs font-medium max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              No cinema theatres match your search criteria or city filter. Try clearing your search query or selecting "All Cities".
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 py-2 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-rose-950/60"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className={`flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4 ${
            theme === 'dark' ? 'border-zinc-800/80' : 'border-slate-200'
          }`}>
            <button
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
              }}
              disabled={page === 1}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-full border font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              <ChevronLeft size={16} /> Previous Page
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                  }}
                  className={`w-9 h-9 rounded-full text-xs font-black transition-all cursor-pointer ${
                    page === pageNum
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 scale-105'
                      : theme === 'dark'
                      ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 hover:text-white'
                      : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, totalPages));
              }}
              disabled={page >= totalPages}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-full border font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
              }`}
            >
              Next Page <ChevronRight size={16} />
            </button>
          </div>
        )}

      </main>

      {/* THEATRE DETAILS MODAL */}
      <TheatreDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theatre={selectedTheatre}
      />

    </div>
  );
};

export default TheatreListing;
