import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, Calendar, Globe, Play, Film, 
  Sparkles, Ticket, UserCheck, Share2, Heart, 
  Check, MapPin, Coffee, Smartphone, Armchair, 
  MessageSquare, ThumbsUp, Filter, ShieldAlert, User
} from 'lucide-react';
import { fetchMovieDetails } from '../services/tmdbService';
import { getTheatresForMovie } from '../services/theatreService';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// Comprehensive Movie Cast & Character Roles Database
const MOVIE_CAST_ROLES = {
  // Deadpool & Wolverine
  533535: [
    { actor: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Hugh Jackman', role: 'Logan / Wolverine', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Emma Corrin', role: 'Cassandra Nova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Morena Baccarin', role: 'Vanessa Carlysle', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  ],
  // Kalki 2898 AD
  801688: [
    { actor: 'Prabhas', role: 'Bhairava / Karna', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Amitabh Bachchan', role: 'Ashwatthama', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Kamal Haasan', role: 'Supreme Yaskin', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Deepika Padukone', role: 'SUM-80 / Sumathi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Disha Patani', role: 'Roxie', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  ],
  // Dune: Part Two
  693134: [
    { actor: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Zendaya', role: 'Chani', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Rebecca Ferguson', role: 'Lady Jessica', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Austin Butler', role: 'Feyd-Rautha Harkonnen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  ],
  // Oppenheimer
  872585: [
    { actor: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Emily Blunt', role: 'Katherine Oppenheimer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Matt Damon', role: 'Leslie Groves', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Robert Downey Jr.', role: 'Lewis Strauss', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ],
  // Spider-Man: Across the Spider-Verse
  569094: [
    { actor: 'Shameik Moore', role: 'Miles Morales / Spider-Man', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Hailee Steinfeld', role: 'Gwen Stacy / Spider-Gwen', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Oscar Isaac', role: 'Miguel O\'Hara / Spider-Man 2099', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  ],
  // Interstellar
  157336: [
    { actor: 'Matthew McConaughey', role: 'Joseph Cooper', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Anne Hathaway', role: 'Dr. Amelia Brand', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Jessica Chastain', role: 'Murphy Cooper', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  ],
  // The Dark Knight
  155: [
    { actor: 'Christian Bale', role: 'Bruce Wayne / Batman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Heath Ledger', role: 'The Joker', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Aaron Eckhart', role: 'Harvey Dent / Two-Face', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ],
  // Jawan
  1075794: [
    { actor: 'Shah Rukh Khan', role: 'Vikram Rathore / Azad', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Nayanthara', role: 'Narmada Rai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Vijay Sethupathi', role: 'Kaalie Gaikwad', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  ],
  // RRR
  570890: [
    { actor: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Ram Charan', role: 'Alluri Sitarama Raju', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Ajay Devgn', role: 'Venkata Rama Raju', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Alia Bhatt', role: 'Sita', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ],
  // Pushpa 2: The Rule
  1182390: [
    { actor: 'Allu Arjun', role: 'Pushpa Raj', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Rashmika Mandanna', role: 'Srivalli', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Fahadh Faasil', role: 'SP Bhanwar Singh Shekhawat', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Jagapathi Babu', role: 'Siddappa', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ],
  // Avatar: Fire and Ash
  9901: [
    { actor: 'Sam Worthington', role: 'Jake Sully', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Zoe Saldana', role: 'Neytiri', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Sigourney Weaver', role: 'Kiri', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Oona Chaplin', role: 'Varang (Ash Tribe Leader)', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  ],
  // Moana 2
  9902: [
    { actor: 'Auliʻi Cravalho', role: 'Moana (Voice)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Dwayne Johnson', role: 'Maui (Voice)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Alan Tudyk', role: 'Heihei (Voice)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  ],
  // Gladiator II
  9905: [
    { actor: 'Paul Mescal', role: 'Lucius Verus', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Pedro Pascal', role: 'General Acacius', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Denzel Washington', role: 'Macrinus', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Connie Nielsen', role: 'Lucilla', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  ],
  // Wicked
  9906: [
    { actor: 'Cynthia Erivo', role: 'Elphaba Thropp', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Ariana Grande', role: 'Glinda Upland', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Jonathan Bailey', role: 'Fiyero Tigelaar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { actor: 'Jeff Goldblum', role: 'Wizard of Oz', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ],
};

// Available dates for booking
const BOOKING_DATES = [
  { id: 'today', label: 'Today', date: '30 Sep', day: 'Wed', isToday: true },
  { id: 'tomorrow', label: 'Tomorrow', date: '1 Oct', day: 'Thu', isToday: false },
  { id: 'fri', label: 'Friday', date: '2 Oct', day: 'Fri', isToday: false },
  { id: 'sat', label: 'Saturday', date: '3 Oct', day: 'Sat', isToday: false },
  { id: 'sun', label: 'Sunday', date: '4 Oct', day: 'Sun', isToday: false },
];

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, theme } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableTheatres, setAvailableTheatres] = useState([]);
  
  // Interactive UI States
  const [activeTab, setActiveTab] = useState('showtimes'); // 'showtimes', 'about', 'cast', 'reviews'
  const [selectedDate, setSelectedDate] = useState(BOOKING_DATES[0]);
  const [selectedFormatFilter, setSelectedFormatFilter] = useState('ALL');
  const [isFavorite, setIsFavorite] = useState(false);

  // Reviews State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Vikram R.',
      rating: 5,
      date: 'Yesterday',
      comment: 'Absolute cinematic masterpiece! Mind-blowing sound design and performance. Must watch in theatres!',
      verified: true,
      likes: 42,
    },
    {
      id: 2,
      name: 'Ananya Sharma',
      rating: 4.5,
      date: '2 days ago',
      comment: 'Sensational background score and intense lead actor performances. Superb cinema experience!',
      verified: true,
      likes: 29,
    },
    {
      id: 3,
      name: 'Karthik N.',
      rating: 5,
      date: '3 days ago',
      comment: 'Best movie experience of 2024 hands down. Screen 1 Dolby Atmos made it 10x better.',
      verified: true,
      likes: 18,
    },
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);

      if (data) {
        const options = getTheatresForMovie(data.id, data.title);
        setAvailableTheatres(options);
      }

      setLoading(false);
    };

    if (id) {
      loadDetails();
    }
  }, [id]);

  const formatRuntime = (mins) => {
    if (!mins) return '2h 15m (135 min)';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}m (${mins} min)` : `${minutes} mins`;
  };

  const formatLanguage = (code) => {
    const langs = {
      en: 'English (Original)',
      te: 'Telugu (Original / Dubbed)',
      hi: 'Hindi (Dubbed)',
      ta: 'Tamil (Dubbed)',
      es: 'Spanish',
      ja: 'Japanese',
      ko: 'Korean',
    };
    return langs[code?.toLowerCase()] || code?.toUpperCase() || 'English';
  };

  const releaseDateObj = movie?.release_date ? new Date(movie.release_date) : null;
  const isUpcomingMovie = movie?.isUpcoming || (releaseDateObj && releaseDateObj > new Date());

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`🔗 Movie link copied to clipboard! Share with friends.`, 'success');
    } else {
      showToast(`🎬 Link: ${window.location.href}`, 'info');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      showToast(`❤️ Added "${movie?.title}" to your Watchlist!`, 'success');
    } else {
      showToast(`Removed from Watchlist`, 'info');
    }
  };

  const handleTrailerClick = () => {
    showToast(`🎬 Trailer preview active for "${movie?.title}"`, 'info');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      showToast(`Please enter your review text.`, 'warning');
      return;
    }
    const newEntry = {
      id: Date.now(),
      name: 'You (Verified Audience)',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim(),
      verified: true,
      likes: 0,
    };
    setReviewsList([newEntry, ...reviewsList]);
    setNewReviewText('');
    showToast(`🌟 Thank you! Your review has been posted.`, 'success');
  };

  // Helper to extract Cast & Roles array for current movie
  const getMovieCastRoles = () => {
    if (!movie) return [];
    if (MOVIE_CAST_ROLES[movie.id]) {
      return MOVIE_CAST_ROLES[movie.id];
    }
    // Fallback using cast names array
    const names = Array.isArray(movie.cast) ? movie.cast : ['Lead Actor', 'Co-Star', 'Supporting Lead'];
    return names.map((actorName, idx) => ({
      actor: typeof actorName === 'string' ? actorName : (actorName?.name || 'Actor'),
      role: idx === 0 ? 'Protagonist / Lead Hero' : idx === 1 ? 'Co-Protagonist / Heroine' : 'Key Supporting Lead',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=150&auto=format&fit=crop&q=80`
    }));
  };

  const castRolesList = getMovieCastRoles();

  // Filter theatres by format
  const filteredTheatres = availableTheatres.filter((th) => {
    if (selectedFormatFilter === 'ALL') return true;
    return (th.format || '').toLowerCase().includes(selectedFormatFilter.toLowerCase());
  });

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
            <p className="text-xs font-black tracking-wider uppercase text-rose-500 animate-pulse">Loading Cinematic Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`border p-8 rounded-3xl text-center max-w-md ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <Film size={44} className="mx-auto mb-3 text-rose-500" />
            <h2 className="text-2xl font-black">Movie Record Not Found</h2>
            <p className={`text-xs mt-1 mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>The requested movie title could not be fetched from the database.</p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
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
      theme === 'dark' ? 'bg-zinc-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navbar */}
      <Navbar />

      {/* HERO BACKDROP BANNER */}
      <div className="relative w-full h-[450px] md:h-[520px] overflow-hidden bg-zinc-950">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-75 dark:brightness-60 scale-100 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = movie.poster_path || 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg';
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          theme === 'dark' ? 'from-zinc-950 via-zinc-950/70' : 'from-slate-50 via-slate-50/70'
        } to-transparent`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${
          theme === 'dark' ? 'from-zinc-950/90 via-zinc-950/40' : 'from-slate-900/60 via-transparent'
        } to-transparent`}></div>

        {/* Top Floating Control Bar */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/movies')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/75 hover:bg-rose-600 text-white font-extrabold text-xs backdrop-blur-md border border-zinc-700 hover:border-rose-500 transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft size={16} /> Movie Catalog
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite 
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/50 scale-110' 
                  : 'bg-black/75 hover:bg-zinc-800 border-zinc-700 text-slate-200'
              }`}
              title="Add to Watchlist"
            >
              <Heart size={18} className={isFavorite ? 'fill-white' : ''} />
            </button>

            <button
              onClick={handleShareClick}
              className="p-2.5 rounded-full bg-black/75 hover:bg-zinc-800 border border-zinc-700 text-slate-200 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
              title="Share Movie"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Watch Trailer Button Overlay */}
        <div className="absolute bottom-10 right-6 md:right-12 z-20">
          <button
            onClick={handleTrailerClick}
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xl shadow-rose-950/60 hover:scale-105 transition-all cursor-pointer border border-rose-400"
          >
            <Play size={16} className="fill-white text-white translate-x-0.5" />
            <span>WATCH TRAILER</span>
          </button>
        </div>
      </div>

      {/* DETAIL MAIN WRAPPER */}
      <main className="flex-1 -mt-48 relative z-20 p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-8">
        
        {/* TOP POSTER & METADATA SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Movie Poster Card */}
          <div className="relative group mx-auto md:mx-0 w-full max-w-xs md:max-w-none">
            <div className={`w-full aspect-[2/3] rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${
              theme === 'dark' ? 'border-zinc-800 shadow-rose-950/40 bg-zinc-900' : 'border-slate-200 shadow-slate-300 bg-white'
            }`}>
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Main Info Header */}
          <div className="md:col-span-2 space-y-5">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} /> TMDB VERIFIED FEATURE
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                UA 13+ CERTIFIED
              </span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                theme === 'dark' ? 'bg-zinc-900 text-slate-300 border-zinc-800' : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}>
                4K DOLBY ATMOS
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm font-extrabold text-rose-500 italic mt-2">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Rating & Key Details Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y ${
              theme === 'dark' ? 'border-zinc-800/80' : 'border-slate-200'
            }`}>
              
              {/* Rating */}
              <div className={`p-3.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Audience Score</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                  <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{movie.vote_average}</span>
                  <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>/10</span>
                </div>
              </div>

              {/* Language */}
              <div className={`p-3.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Languages</span>
                <div className={`flex items-center gap-1.5 mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Globe size={18} className="text-rose-500 shrink-0" />
                  <span className="text-xs font-black truncate">{formatLanguage(movie.original_language)}</span>
                </div>
              </div>

              {/* Runtime */}
              <div className={`p-3.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Runtime</span>
                <div className={`flex items-center gap-1.5 mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Clock size={18} className="text-rose-500 shrink-0" />
                  <span className="text-xs font-black">{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              {/* Release Date */}
              <div className={`p-3.5 rounded-2xl border ${
                theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>Release Date</span>
                <div className={`flex items-center gap-1.5 mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Calendar size={18} className="text-rose-500 shrink-0" />
                  <span className="text-xs font-black">{movie.release_date}</span>
                </div>
              </div>

            </div>

            {/* STARRING CAST & CHARACTER ROLES CARD (TEXT ONLY - NO IMAGES) */}
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 text-rose-500">
                <UserCheck size={16} />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Starring Cast & Character Roles
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {castRolesList.map((c, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                      theme === 'dark' ? 'bg-zinc-950 border-zinc-800/80 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <User size={14} className="text-rose-500 shrink-0" />
                    <div className="min-w-0">
                      <h4 className={`text-xs font-black truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {c.actor}
                      </h4>
                      <p className="text-[11px] font-extrabold text-rose-400 truncate">
                        as {c.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-black uppercase tracking-wider mr-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>Genres:</span>
              {movie.genres?.map((g, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-extrabold px-3.5 py-1 rounded-full border shadow-sm ${
                    theme === 'dark' 
                      ? 'bg-zinc-900 border-zinc-700 text-rose-400' 
                      : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
                >
                  {typeof g === 'object' && g !== null ? (g.name || 'Cinema') : String(g)}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* ADVANCED TAB NAVIGATION BAR */}
        <div className={`border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            
            <button
              onClick={() => setActiveTab('showtimes')}
              className={`py-3 px-4 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'showtimes'
                  ? 'border-rose-600 text-rose-500'
                  : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket size={16} /> 🍿 Book Tickets & Showtimes
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`py-3 px-4 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'border-rose-600 text-rose-500'
                  : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film size={16} /> 📖 Storyline & Trivia
            </button>

            <button
              onClick={() => setActiveTab('cast')}
              className={`py-3 px-4 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'cast'
                  ? 'border-rose-600 text-rose-500'
                  : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={16} /> 🎭 Starring Cast & Roles ({castRolesList.length})
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-4 text-xs sm:text-sm font-black border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-rose-600 text-rose-500'
                  : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={16} /> ⭐ Audience Reviews ({reviewsList.length})
            </button>

          </div>
        </div>

        {/* TAB 1: BOOK TICKETS & SHOWTIMES */}
        {activeTab === 'showtimes' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* UPCOMING MOVIE ALERT BLOCK */}
            {isUpcomingMovie ? (
              <div className={`p-6 rounded-3xl border text-center space-y-3 ${
                theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <ShieldAlert size={36} className="mx-auto text-amber-400 animate-bounce" />
                <h3 className="text-lg font-black">🚀 Pre-Booking Opens Soon!</h3>
                <p className="text-xs font-semibold max-w-lg mx-auto">
                  "{movie.title}" is scheduled for official theatrical premiere on <span className="font-extrabold text-amber-400">{movie.release_date}</span>. Seat reservations will unlock on release day!
                </p>
                <button
                  onClick={() => showToast(`🔔 Alert activated! We'll notify you when tickets go live.`, 'success')}
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg transition-all cursor-pointer"
                >
                  Set Pre-Booking Reminder Alert
                </button>
              </div>
            ) : (
              <>
                {/* DATE SELECTOR STRIP */}
                <div className="space-y-2">
                  <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <Calendar size={14} className="text-rose-500" /> Select Showtime Date:
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {BOOKING_DATES.map((d) => {
                      const isSelected = selectedDate.id === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDate(d)}
                          className={`flex flex-col items-center min-w-[90px] py-2.5 px-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/40 scale-105 font-black'
                              : theme === 'dark'
                              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-slate-300'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider font-extrabold">{d.day}</span>
                          <span className="text-sm font-black">{d.date}</span>
                          {d.isToday && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full mt-1 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              TODAY
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FORMAT FILTER STRIP */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-rose-500" />
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Format Filter:</span>
                    {['ALL', '2D', '3D', 'IMAX 3D', 'Dolby'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedFormatFilter(fmt)}
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          selectedFormatFilter === fmt
                            ? 'bg-rose-600 text-white border-rose-500'
                            : theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-slate-400' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    {filteredTheatres.length} Partner Multiplexes Screening
                  </span>
                </div>

                {/* MULTIPLEX THEATRES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredTheatres.map((th, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between transition-all hover:border-rose-500/60 ${
                        theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/60'
                      }`}
                    >
                      <div>
                        {/* Header: Name & Screen */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              {th.screenName}
                            </span>
                            <h4 className={`text-base font-black tracking-tight mt-1.5 ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              {th.theatreName}
                            </h4>
                          </div>
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            4.8 / 5
                          </span>
                        </div>

                        {/* Location & Format Tags */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            🎬 {th.format}
                          </span>
                          <span className={`text-[11px] font-medium flex items-center gap-1 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <MapPin size={12} className="text-rose-500" /> Gachibowli (2.4 km)
                          </span>
                        </div>

                        {/* Facilities Pills */}
                        <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-400 border-t border-zinc-800/60 pt-2">
                          <span className="flex items-center gap-1"><Coffee size={12} className="text-rose-400" /> Food & Bev</span>
                          <span className="flex items-center gap-1"><Smartphone size={12} className="text-rose-400" /> M-Ticket</span>
                          <span className="flex items-center gap-1"><Armchair size={12} className="text-rose-400" /> Recliner Seats</span>
                        </div>
                      </div>

                      {/* Showtimes Buttons */}
                      <div className="space-y-2 pt-3 border-t border-rose-500/10">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider block ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            Showtimes on {selectedDate.date}:
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            Starting ₹150
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {th.showtimes.map((t, tIdx) => {
                            const isFastFilling = tIdx % 2 === 1;
                            const isAlmostFull = tIdx === 3;
                            
                            return (
                              <button
                                key={t}
                                onClick={() => {
                                  const query = `?theater=${encodeURIComponent(th.fullName)}&time=${encodeURIComponent(t)}&date=${encodeURIComponent(selectedDate.date)}`;
                                  navigate(`/seat-selection/${movie.id}${query}`);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-xs shadow-md shadow-rose-950/40 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 group"
                                title={`Book ${movie.title} at ${th.theatreName} (${t})`}
                              >
                                <span className={`w-2 h-2 rounded-full ${
                                  isAlmostFull ? 'bg-red-300 animate-ping' : isFastFilling ? 'bg-amber-300' : 'bg-emerald-300'
                                }`}></span>
                                <Ticket size={13} />
                                <span>{t}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        )}

        {/* TAB 2: STORYLINE & TRIVIA */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <div className={`p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-rose-500">
                <Film size={20} /> Comprehensive Synopsis & Plot Summary
              </h3>
              <p className={`text-base leading-relaxed font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {movie.overview}
              </p>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${
                theme === 'dark' ? 'border-zinc-800' : 'border-slate-200'
              }`}>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-500">Sound & Audio Format</span>
                  <p className="text-xs font-semibold">Dolby Atmos 7.1 Surround / DTS-X Master Audio</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-500">Aspect Ratio</span>
                  <p className="text-xs font-semibold">1.90:1 (IMAX Digital Expanded Aspect Ratio)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-500">Production Studio</span>
                  <p className="text-xs font-semibold">Marvel Studios / Mythri Movie Makers / Warner Bros.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-500">Subtitles & Captioning</span>
                  <p className="text-xs font-semibold">English Subtitles Available across all Multiplex Screens</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STARRING CAST & CHARACTER ROLES */}
        {activeTab === 'cast' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <UserCheck size={20} className="text-rose-500" /> Full Starring Cast & Character Roles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {castRolesList.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center gap-3 shadow-md transition-all hover:border-rose-500/40 ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <User size={18} className="text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-black truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {c.actor}
                    </h4>
                    <p className="text-xs font-extrabold text-rose-400 mt-0.5 truncate">
                      Role: {c.role}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                      Verified Billing Cast
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIENCE REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* WRITE A REVIEW FORM */}
            <form onSubmit={handleAddReview} className={`p-5 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-rose-500">
                <Star size={16} /> Write an Audience Review
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 cursor-pointer hover:scale-125 transition-transform"
                  >
                    <Star
                      size={20}
                      className={star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-400 ml-2">{newReviewRating} / 5 Stars</span>
              </div>

              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Share your thoughts about acting, plot, visuals, and multiplex experience..."
                rows={3}
                className={`w-full p-3.5 rounded-2xl border text-xs font-medium focus:outline-none focus:border-rose-500 transition-all ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              ></textarea>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                Submit Review
              </button>
            </form>

            {/* REVIEWS LIST */}
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-5 rounded-3xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {rev.name}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-amber-400">{rev.rating} / 5</span>
                    </div>
                  </div>

                  <p className={`text-xs font-medium leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-2 text-[10px] font-extrabold text-slate-400">
                    {rev.verified && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check size={12} /> Verified Ticket Buyer
                      </span>
                    )}
                    <button
                      onClick={() => showToast(`Liked review!`, 'info')}
                      className="flex items-center gap-1 hover:text-rose-500 cursor-pointer"
                    >
                      <ThumbsUp size={12} /> {rev.likes} Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default MovieDetails;
