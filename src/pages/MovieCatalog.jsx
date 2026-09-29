import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, 
  RotateCcw, Sparkles, AlertCircle, CheckCircle2, Clapperboard
} from 'lucide-react';
import { fetchMovies, GENRE_MAP, LANGUAGE_OPTIONS } from '../services/tmdbService';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const MovieCatalog = () => {
  const { theme } = useAuth();

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
    <div id="catalog-top" className={`min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar />

      {/* CATALOG CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* HERO TITLE & ENGINE STATUS BANNER */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-zinc-800 shadow-xl shadow-black/50 text-white'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-slate-900'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> TMDB Live Movie Catalog
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${isLiveApi ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-amber-950/80 text-amber-400 border-amber-800'}`}>
                <CheckCircle2 size={11} /> {isLiveApi ? 'Live TMDB API Engine' : 'TMDB Resilient Engine'}
              </span>
            </div>
            <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Explore <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Blockbuster Movies</span>
            </h1>
            <p className={`text-xs font-medium mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Filter by genre, language, rating, and release date with live trailer buttons & detailed movie view
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`border px-4 py-2 rounded-2xl text-right ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total Movies Found</span>
              <span className="text-xl font-black text-rose-500">{totalResults}</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className={`p-5 rounded-3xl border space-y-4 transition-colors ${
          theme === 'dark'
            ? 'bg-zinc-900/90 border-zinc-800 shadow-xl shadow-black/50'
            : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
        }`}>
          
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

          {/* Bottom Row: Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Filter 1: Genre */}
            <div className="flex flex-col gap-1">
              <label className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <Filter size={12} className="text-rose-500" /> Genre:
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-rose-500 cursor-pointer ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
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
              <label className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <SlidersHorizontal size={12} className="text-rose-500" /> Language:
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setPage(1);
                }}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-rose-500 cursor-pointer ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
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
              <label className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <Sparkles size={12} className="text-rose-500" /> Minimum Rating:
              </label>
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setPage(1);
                }}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-rose-500 cursor-pointer ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
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
              <label className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <ArrowUpDown size={12} className="text-rose-500" /> Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-rose-500 cursor-pointer ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
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
                className={`w-full py-2 px-3 rounded-xl border text-rose-500 hover:text-rose-600 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer h-[34px] ${
                  theme === 'dark'
                    ? 'bg-zinc-950 hover:bg-rose-950/80 border-zinc-800 hover:border-rose-600/80'
                    : 'bg-slate-100 hover:bg-rose-50 border-slate-200 hover:border-rose-300'
                }`}
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            </div>

          </div>

        </div>

        {/* ERROR HANDLER DISPLAY */}
        {error && (
          <div className={`border p-4 rounded-2xl flex items-center justify-between gap-4 ${
            theme === 'dark' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0 text-rose-500" />
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
              <div key={idx} className={`border rounded-3xl p-4 animate-pulse space-y-3 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`w-full aspect-[2/3] rounded-2xl ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
                <div className={`h-4 rounded-md w-3/4 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
                <div className={`h-3 rounded-md w-1/2 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
                <div className={`h-8 rounded-xl w-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>
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
          <div className={`border border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 ${
            theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-300'
          }`}>
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <Clapperboard size={32} />
            </div>
            <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No Movies Match Your Criteria</h3>
            <p className={`text-xs font-medium max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
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
          <div className={`flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4 ${
            theme === 'dark' ? 'border-zinc-800/80' : 'border-slate-200'
          }`}>
            <button
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
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

    </div>
  );
};

export default MovieCatalog;
