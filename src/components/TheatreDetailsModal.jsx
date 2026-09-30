import React from 'react';
import { 
  X, Building2, MapPin, Phone, Mail, Navigation, Star, 
  Sparkles, Clock, Ticket, ExternalLink, Film, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const TheatreDetailsModal = ({ isOpen, onClose, theatre }) => {
  const navigate = useNavigate();
  const { theme } = useAuth();

  if (!isOpen || !theatre) return null;

  const handleBookShow = (movieTitle, screenName, showTime, movieId) => {
    onClose();
    const fullTheaterName = `${theatre.name}: ${screenName}`;
    const query = `?theater=${encodeURIComponent(fullTheaterName)}&time=${encodeURIComponent(showTime)}`;
    navigate(`/seat-selection/${movieId || 533535}${query}`);
  };

  const handleOpenMaps = () => {
    window.open(theatre.mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGoToMovie = (movieId) => {
    onClose();
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300 ${
      theme === 'dark' ? 'bg-black/90' : 'bg-slate-900/60'
    }`}>
      <div className={`relative w-full max-w-4xl border rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col transition-colors ${
        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 shadow-rose-950/40 text-slate-100' : 'bg-white border-slate-200 shadow-slate-400 text-slate-900'
      }`}>
        
        {/* MODAL HEADER WITH HD THEATRE PICTURE */}
        <div className="relative h-48 sm:h-60 bg-zinc-900 overflow-hidden shrink-0">
          <img
            src={theatre.image}
            alt={theatre.name}
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-zinc-700 hover:border-rose-500 shadow-md"
            title="Close Modal"
          >
            <X size={20} />
          </button>

          {/* Banner Details Overlay */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Building2 size={11} /> {theatre.city}
              </span>
              <span className="bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {theatre.rating} / 5
              </span>
              <span className="bg-zinc-900/90 text-slate-300 border border-zinc-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {theatre.screensCount} Active Screens
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{theatre.name}</h2>
          </div>
        </div>

        {/* MODAL BODY SCROLL CONTAINER */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* LOCATION & CONTACT METADATA GRID */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-2xl ${
            theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            
            {/* Address & Landmark */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Address & Landmark</h4>
                  <p className={`text-xs font-medium mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{theatre.address}</p>
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">📍 Landmark: {theatre.landmark}</p>
                </div>
              </div>
            </div>

            {/* Contact Info & Maps CTA */}
            <div className={`space-y-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 flex flex-col justify-between ${
              theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Phone size={14} className="text-rose-500 shrink-0" />
                  <span className="font-bold">{theatre.phone}</span>
                </div>
                <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Mail size={14} className="text-rose-500 shrink-0" />
                  <span className="font-semibold">{theatre.email}</span>
                </div>
              </div>

              <button
                onClick={handleOpenMaps}
                className={`w-full py-2 px-4 rounded-xl border text-rose-500 hover:text-rose-600 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  theme === 'dark'
                    ? 'bg-zinc-950 hover:bg-rose-950/80 border-zinc-800 hover:border-rose-600/80'
                    : 'bg-white hover:bg-rose-50 border-slate-300 hover:border-rose-300'
                }`}
              >
                <Navigation size={14} />
                <span>Navigate on Google Maps</span>
                <ExternalLink size={12} />
              </button>
            </div>

          </div>

          {/* THEATRE AMENITIES BADGES */}
          <div>
            <h4 className={`text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <Sparkles size={13} className="text-rose-500" /> Theatre Facilities & Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {theatre.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                    theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* NOW SHOWING MOVIES & SHOW TIMINGS SECTION */}
          <div className="space-y-4">
            <div className={`flex items-center justify-between border-b pb-2 ${theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'}`}>
              <h3 className={`text-base font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Film size={18} className="text-rose-500" /> Now Showing Movies at {theatre.name}
              </h3>
              <span className="text-xs font-extrabold text-rose-500 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                {theatre.screens?.length || 0} Movies Screening
              </span>
            </div>

            <div className="space-y-4">
              {theatre.screens.map((scr, idx) => (
                <div key={idx} className={`border rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl ${
                  theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  
                  {/* Movie Banner Card */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Movie Poster */}
                    <div className="relative w-24 h-36 rounded-2xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800 shadow-md">
                      <img
                        src={scr.moviePoster}
                        alt={scr.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Movie Info & Format */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                          {scr.screenName}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                        }`}>
                          {scr.format}
                        </span>
                        <span className="bg-black/80 border border-amber-500/40 text-amber-400 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {scr.movieRating}
                        </span>
                      </div>

                      <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{scr.movieTitle}</h4>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{scr.movieGenre}</p>

                      <button
                        onClick={() => handleGoToMovie(scr.movieId)}
                        className="text-xs font-extrabold text-rose-500 hover:text-rose-600 inline-flex items-center gap-1 transition-colors cursor-pointer pt-1"
                      >
                        <span>View Full Movie Page & Synopsis</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Showtimes Pills */}
                  <div className={`border-t pt-3 ${theme === 'dark' ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider block mb-2 flex items-center gap-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Clock size={12} className="text-rose-500" /> Available Showtimes (Click to Book Seats):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {scr.showtimes.map((st, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleBookShow(scr.movieTitle, scr.screenName, st, scr.movieId)}
                          className={`px-4 py-2 rounded-xl border font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm transform hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-zinc-950 hover:bg-rose-600 border-zinc-800 hover:border-rose-500 text-white'
                              : 'bg-white hover:bg-rose-600 border-slate-300 hover:border-rose-500 text-slate-800 hover:text-white'
                          }`}
                        >
                          <Ticket size={14} />
                          <span>{st}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className={`p-4 border-t text-center shrink-0 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Powered by <strong className={theme === 'dark' ? 'text-white font-extrabold' : 'text-slate-900 font-extrabold'}>MovieMax Cinema Engine</strong> • Live Cinema Schedules
          </span>
        </div>

      </div>
    </div>
  );
};

export default TheatreDetailsModal;
