import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, Calendar, Globe, Play, Film, 
  Sparkles, Ticket, UserCheck 
} from 'lucide-react';
import { fetchMovieDetails } from '../services/tmdbService';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, theme, addBooking } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };

    if (id) {
      loadDetails();
    }
  }, [id]);

  const formatRuntime = (mins) => {
    if (!mins) return '120 min';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}m (${mins} mins)` : `${minutes} mins`;
  };

  const formatLanguage = (code) => {
    const langs = {
      en: 'English',
      te: 'Telugu',
      hi: 'Hindi',
      ta: 'Tamil',
      es: 'Spanish',
      ja: 'Japanese',
      ko: 'Korean',
    };
    return langs[code?.toLowerCase()] || code?.toUpperCase() || 'English';
  };

  const handleTrailerClick = () => {
    showToast(`🎬 Trailer preview for "${movie?.title}"`, 'info');
  };

  const handleBookTicket = () => {
    if (movie) {
      addBooking({
        movie: movie.title,
        theater: 'AMB Cinemas (Screen 1)',
        seats: 'Recliner A-12, A-13',
        amount: 700,
      });
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
            <p className={`text-xs font-extrabold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Loading TMDB Movie Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`border p-8 rounded-3xl text-center max-w-md ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <Film size={40} className="mx-auto mb-3 text-rose-500" />
            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Movie Not Found</h2>
            <p className={`text-xs mt-1 mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>The requested movie record could not be loaded.</p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md"
            >
              <ArrowLeft size={16} /> Return to Movie Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navbar */}
      <Navbar />

      {/* BACKDROP HERO BANNER */}
      <div className="relative w-full h-[450px] overflow-hidden bg-zinc-950">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-50"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-black via-black/60' : 'from-slate-50 via-slate-900/60'} to-transparent`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-black via-black/40' : 'from-slate-900/80 via-transparent'} to-transparent`}></div>

        {/* Back Button Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate('/movies')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 hover:bg-rose-600 text-white font-extrabold text-xs backdrop-blur-md border border-zinc-700 hover:border-rose-500 transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>
      </div>

      {/* DETAIL CONTENT SECTION */}
      <main className="flex-1 -mt-44 relative z-20 p-6 max-w-6xl mx-auto w-full space-y-8">
        
        {/* TOP MAIN GRID: POSTER + METADATA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Movie Poster Card */}
          <div className="relative group">
            <div className={`w-full aspect-[2/3] rounded-3xl overflow-hidden border-2 shadow-2xl ${
              theme === 'dark' ? 'border-zinc-800 shadow-rose-950/50 bg-zinc-900' : 'border-slate-200 shadow-slate-300 bg-white'
            }`}>
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, Metadata, Genres, Story & Buttons */}
          <div className="md:col-span-2 space-y-5">
            
            {/* Tagline / Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> TMDB Verified Feature
              </span>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                theme === 'dark' ? 'bg-zinc-900 text-slate-300 border-zinc-800' : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}>
                HD 4K ULTRA
              </span>
            </div>

            {/* Main Title & Tagline */}
            <div>
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm font-semibold text-rose-500 italic mt-1">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Rating, Language, Duration & Release Date Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y ${theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'}`}>
              
              {/* Rating */}
              <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Rating</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                  <span className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{movie.vote_average}</span>
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>/10</span>
                </div>
              </div>

              {/* Language */}
              <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Language</span>
                <div className={`flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Globe size={18} className="text-rose-500" />
                  <span className="text-sm font-extrabold">{formatLanguage(movie.original_language)}</span>
                </div>
              </div>

              {/* Duration */}
              <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Duration</span>
                <div className={`flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Clock size={18} className="text-rose-500" />
                  <span className="text-xs font-extrabold">{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              {/* Release Date */}
              <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Release Date</span>
                <div className={`flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Calendar size={18} className="text-rose-500" />
                  <span className="text-xs font-extrabold">{movie.release_date}</span>
                </div>
              </div>

            </div>

            {/* Genre Badges */}
            <div>
              <span className={`text-xs font-extrabold uppercase tracking-wider block mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Genres</span>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-extrabold px-3.5 py-1 rounded-full border shadow-sm ${
                      theme === 'dark' ? 'bg-zinc-900 border-zinc-700 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
                    }`}
                  >
                    {typeof g === 'object' && g !== null ? (g.name || 'Cinema') : String(g)}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis Description */}
            <div className="space-y-2">
              <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Film size={16} className="text-rose-500" /> Story Synopsis
              </h3>
              <p className={`text-sm leading-relaxed font-medium border p-4 rounded-2xl ${
                theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}>
                {movie.overview}
              </p>
            </div>

            {/* Cast Members */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-2">
                <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <UserCheck size={16} className="text-rose-500" /> Starring Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={handleTrailerClick}
                className={`w-full sm:w-auto py-3.5 px-8 rounded-full border text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 hover:bg-rose-950/80 border-rose-500/60 text-rose-400'
                    : 'bg-white hover:bg-rose-50 border-rose-300 text-rose-600 shadow-md'
                }`}
              >
                <Play size={18} className="fill-rose-500 text-rose-500" /> Watch Trailer
              </button>

              <button
                onClick={handleBookTicket}
                className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-950/50 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Ticket size={18} /> Reserve Cinema Seats
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default MovieDetails;
