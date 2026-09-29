import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, 
  RotateCcw, Sparkles, AlertCircle, CheckCircle2, Clapperboard
} from 'lucide-react';
import { fetchMovies, GENRE_MAP, LANGUAGE_OPTIONS } from '../services/tmdbService';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';

export const MovieCatalog = () => {
  // State variables for Filters, Search, Sorting, and Pagination
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('release_date_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch Movies function wrapped in useCallback
  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const data = await fetchMovies({
      page,
      searchQuery,
      selectedGenre,
      selectedLanguage,
      selectedRating,
      sortBy,
    });

    if (data.success) {
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setIsLiveApi(data.isLive);
    } else {
      setError('Unable to retrieve movie listings. Please try again.');
    }
    setLoading(false);
  }, [page, searchQuery, selectedGenre, selectedLanguage, selectedRating, sortBy]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Scroll to top of catalog whenever page number changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const topElem = document.getElementById('catalog-top');
    if (topElem) {
      topElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedLanguage('all');
    setSelectedRating('all');
    setSortBy('release_date_desc');
    setPage(1);
  };

  return (
    <div id="catalog-top" className="min-h-screen w-full bg-black text-slate-100 flex flex-col font-sans overflow-x-hidden">
      
      {/* Top Navbar */}
      <Navbar />

      {/* CATALOG CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* HERO TITLE & ENGINE STATUS BANNER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl shadow-black/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> TMDB Real-Time Catalog
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${isLiveApi ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-amber-950/80 text-amber-400 border-amber-800'}`}>
                <CheckCircle2 size={11} /> {isLiveApi ? 'Live TMDB API Engine' : 'TMDB Resilient Engine'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Explore <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Blockbuster Movies</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Filter by genre, language, rating, and release date with live trailer buttons & detailed movie view
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Movies Found</span>
              <span className="text-xl font-black text-rose-500">{totalResults}</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl shadow-xl shadow-black/50 space-y-4">
          
          {/* Top Row: Live Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search movie title, synopsis, or genre (e.g., Deadpool, Kalki, Jawan, Leo, Sci-Fi)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-white placeholder:text-zinc-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
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

          {/* Bottom Row: Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Filter 1: Genre */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter size={12} className="text-rose-500" /> Genre:
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">All Genres</option>
                {Object.entries(GENRE_MAP).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Language */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal size={12} className="text-rose-500" /> Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Rating */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-rose-500" /> Minimum Rating:
              </label>
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="8.5">⭐ 8.5+ Top Rated</option>
                <option value="8">⭐ 8.0+ Excellent</option>
                <option value="7">⭐ 7.0+ Good</option>
                <option value="6">⭐ 6.0+ Above Average</option>
              </select>
            </div>

            {/* Filter 4: Sort Option */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown size={12} className="text-rose-500" /> Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="release_date_desc">Release Date (Newest)</option>
                <option value="release_date_asc">Release Date (Oldest)</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="rating_asc">Lowest Rated</option>
                <option value="title_asc">Title (A-Z)</option>
              </select>
            </div>

            {/* Filter Reset Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-rose-950/80 border border-zinc-800 hover:border-rose-600/80 text-rose-400 hover:text-rose-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[34px]"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            </div>

          </div>

        </div>

        {/* ERROR HANDLER DISPLAY */}
        {error && (
          <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-2xl flex items-center justify-between gap-4 text-rose-300">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0 text-rose-400" />
              <p className="text-xs font-bold">{error}</p>
            </div>
            <button
              onClick={loadMovies}
              className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Retry
            </button>
          </div>
        )}

        {/* MOVIE GRID DISPLAY WITH LOADING SKELETONS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 animate-pulse space-y-3">
                <div className="w-full aspect-[2/3] bg-zinc-800 rounded-2xl"></div>
                <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
                <div className="h-3 bg-zinc-800 rounded-md w-1/2"></div>
                <div className="h-8 bg-zinc-800 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/90 border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-slate-500">
              <Clapperboard size={32} />
            </div>
            <h3 className="text-lg font-black text-white">No Movies Match Your Criteria</h3>
            <p className="text-xs text-slate-400 font-medium max-w-md">
              Try adjusting your search query, changing the genre or language filter, or resetting all filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 py-2 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-rose-950/60"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 pt-6 gap-4">
            <button
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} /> Previous Page
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-full text-xs font-black transition-all cursor-pointer ${
                    page === pageNum
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 scale-105'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page >= totalPages}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next Page <ChevronRight size={16} />
            </button>
          </div>
        )}

      </main>

    </div>
  );
};

export default MovieCatalog;
