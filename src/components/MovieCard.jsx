import React, { useState } from 'react';
import { Star, Clock, Calendar, Globe, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MovieCard = ({ movie }) => {
  const { showToast, theme } = useAuth();
  const [imgError, setImgError] = useState(false);

  const formatRuntime = (mins) => {
    if (!mins) return '120 min';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
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

  const handleTrailerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`🎬 Trailer preview for "${movie.title}"`, 'info');
  };

  return (
    <div className={`group relative rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between border ${
      theme === 'dark'
        ? 'bg-zinc-900/90 border-zinc-800 hover:border-rose-500/60 shadow-xl shadow-black/50 text-slate-100'
        : 'bg-white border-slate-200 hover:border-rose-500/60 shadow-xl shadow-slate-200/50 text-slate-900'
    }`}>
      
      {/* Top Image Poster Banner Container */}
      <Link to={`/movie/${movie.id}`} className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-950 block">
        {!imgError ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-rose-950 via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center border-b border-zinc-800">
            <span className="text-4xl mb-2">🎬</span>
            <h4 className="text-base font-black text-white line-clamp-2">{movie.title}</h4>
            <span className="text-[10px] text-rose-400 font-extrabold mt-2 uppercase tracking-wider">Official TMDB Film</span>
          </div>
        )}

        {/* Top Badges: Rating & Language */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 px-2.5 py-1 rounded-full text-xs font-black shadow-md">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {movie.vote_average} <span className="text-[10px] text-slate-400 font-medium">/10</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md border border-rose-500/40 text-rose-400 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase shadow-md">
            <Globe size={11} />
            {formatLanguage(movie.original_language)}
          </span>
        </div>

        {/* Quick Hover Details Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="bg-rose-600/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-extrabold text-xs shadow-xl flex items-center gap-2 border border-rose-400">
            <Info size={16} />
            <span>View Movie Details</span>
          </div>
        </div>
      </Link>

      {/* Card Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1.5">
          {movie.genres?.slice(0, 3).map((g, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {typeof g === 'object' && g !== null ? (g.name || 'Cinema') : String(g)}
            </span>
          ))}
        </div>

        {/* Movie Title */}
        <div>
          <Link to={`/movie/${movie.id}`} className="hover:underline">
            <h3 className={`text-base font-black group-hover:text-rose-500 transition-colors line-clamp-1 tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {movie.title}
            </h3>
          </Link>
          <p className={`text-xs line-clamp-2 mt-1 font-medium leading-relaxed ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {movie.overview}
          </p>
        </div>

        {/* Duration & Release Date */}
        <div className={`flex items-center justify-between text-[11px] font-semibold border-t pt-2.5 mt-auto ${
          theme === 'dark' ? 'border-zinc-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            <Clock size={13} className="text-rose-500" />
            {formatRuntime(movie.runtime)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-rose-500" />
            {movie.release_date}
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleTrailerClick}
            type="button"
            className={`w-full py-2 px-3 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-zinc-950 hover:bg-rose-950/80 border-zinc-800 hover:border-rose-600/80 text-rose-400 hover:text-rose-300'
                : 'bg-slate-100 hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-rose-600 hover:text-rose-700 shadow-sm'
            }`}
          >
            <Play size={13} className="fill-rose-500 text-rose-500" />
            <span>Trailer</span>
          </button>

          <Link
            to={`/movie/${movie.id}`}
            className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-950/50 cursor-pointer text-center"
          >
            <Info size={13} />
            <span>Details</span>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default MovieCard;
