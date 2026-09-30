import { MASTER_MOVIES_CATALOG } from '../data/moviesData';


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_API_KEY = '3fd2be6f0c70a2a598f084dd9302cfc9';

export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const LANGUAGE_OPTIONS = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
];

export const mapGenreIds = (genreIds = []) => {
  if (!genreIds || !Array.isArray(genreIds)) return ['Cinema'];
  const names = genreIds.map((id) => GENRE_MAP[id]).filter(Boolean);
  return names.length > 0 ? names : ['Action', 'Drama'];
};

const filterMasterCatalog = ({ searchQuery = '', selectedGenre = 'all', selectedLanguage = 'all', selectedRating = 'all', sortBy = 'release_date_desc' }) => {
  let filtered = [...MASTER_MOVIES_CATALOG];

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
    );
  }

  if (selectedGenre !== 'all' && !isNaN(Number(selectedGenre))) {
    const gid = Number(selectedGenre);
    filtered = filtered.filter((m) => m.genre_ids.includes(gid));
  }

  if (selectedLanguage !== 'all') {
    filtered = filtered.filter(
      (m) => m.original_language.toLowerCase() === selectedLanguage.toLowerCase()
    );
  }

  if (selectedRating !== 'all') {
    const minRating = Number(selectedRating);
    filtered = filtered.filter((m) => m.vote_average >= minRating);
  }

  if (sortBy === 'release_date_asc') {
    filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  } else if (sortBy === 'rating_desc') {
    filtered.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy === 'rating_asc') {
    filtered.sort((a, b) => a.vote_average - b.vote_average);
  } else if (sortBy === 'title_asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  }

  return filtered.map((m) => ({
    ...m,
    genres: m.genres || mapGenreIds(m.genre_ids),
  }));
};

// Fetch Movies using TMDB API URL with real-time pagination support
export const fetchMovies = async ({
  page = 1,
  searchQuery = '',
  selectedGenre = 'all',
  selectedLanguage = 'all',
  selectedRating = 'all',
  sortBy = 'release_date_desc',
  limit = 8,
  apiKey = DEFAULT_API_KEY,
} = {}) => {
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (searchQuery.trim()) {
    queryParams.append('query', searchQuery.trim());
  }
  if (selectedGenre !== 'all' && !isNaN(Number(selectedGenre))) {
    queryParams.append('with_genres', selectedGenre);
  }
  if (selectedLanguage !== 'all') {
    queryParams.append('with_original_language', selectedLanguage);
  }
  if (sortBy) {
    queryParams.append('sort_by', sortBy);
  }

  const endpoint = searchQuery.trim()
    ? `${TMDB_BASE_URL}/search/movie?${queryParams.toString()}`
    : `${TMDB_BASE_URL}/discover/movie?${queryParams.toString()}`;

  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      if (data.results) {
        const liveMovies = data.results.map((m) => ({
          id: m.id,
          title: m.title || m.original_title || 'Untitled Movie',
          original_title: m.original_title || '',
          overview: m.overview || 'No synopsis overview description available from TMDB.',
          poster_path: m.poster_path
            ? (m.poster_path.startsWith('http') ? m.poster_path : `https://image.tmdb.org/t/p/w500${m.poster_path}`)
            : 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
          backdrop_path: m.backdrop_path
            ? (m.backdrop_path.startsWith('http') ? m.backdrop_path : `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`)
            : 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
          vote_average: m.vote_average ? Number(m.vote_average.toFixed(1)) : 7.0,
          vote_count: m.vote_count || 0,
          release_date: m.release_date || '2024-07-24',
          original_language: m.original_language || 'en',
          runtime: m.runtime || 120 + (m.id % 40),
          genres: m.genres || mapGenreIds(m.genre_ids),
          genre_ids: m.genre_ids || [],
        }));

        return {
          success: true,
          isLive: true,
          page: data.page || page,
          totalPages: data.total_pages || Math.ceil((data.total_results || liveMovies.length) / limit),
          totalResults: data.total_results !== undefined ? data.total_results : liveMovies.length,
          results: liveMovies,
        };
      }
    }
  } catch (_err) {}

  const filtered = filterMasterCatalog({ searchQuery, selectedGenre, selectedLanguage, selectedRating, sortBy });
  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * limit;
  const paginatedResults = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    isLive: false,
    page: currentPage,
    totalPages: totalPages,
    totalResults: totalResults,
    results: paginatedResults,
  };
};



export const UPCOMING_MOVIES_LIST = [
  {
    id: 9901,
    title: 'Avatar: Fire and Ash',
    original_title: 'Avatar: Fire and Ash',
    overview: 'Jake Sully and Neytiri encounter a new hostile Na\'vi tribe associated with fire and volcanic ash on Pandora.',
    poster_path: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/vL5WB9w2RjG578AOjJ19yB1o25v.jpg',
    vote_average: 9.2,
    vote_count: 4820,
    release_date: '2025-12-19',
    original_language: 'en',
    runtime: 190,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Oona Chaplin'],
    isUpcoming: true,
    tagline: 'Enter the Ash People of Pandora',
  },
  {
    id: 9902,
    title: 'Moana 2',
    original_title: 'Moana 2',
    overview: 'Moana receives an unexpected call from her wayfinding ancestors and voyages to the far seas of Oceania into dangerous, long-lost waters for an adventure unlike anything she has ever faced.',
    poster_path: 'https://upload.wikimedia.org/wikipedia/en/7/73/Moana_2_poster.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg',
    vote_average: 9.0,
    vote_count: 5100,
    release_date: '2024-11-27',
    original_language: 'en',
    runtime: 100,
    genres: ['Animation', 'Adventure', 'Family'],
    cast: ['Auliʻi Cravalho', 'Dwayne Johnson', 'Alan Tudyk'],
    isUpcoming: true,
    tagline: 'The Ocean is Calling Her Back',
  },
  {
    id: 9903,
    title: 'Spider-Man: Beyond the Spider-Verse',
    original_title: 'Spider-Man: Beyond the Spider-Verse',
    overview: 'Miles Morales traverses the multiverse to save his father and resolve the temporal paradox created by the Spot.',
    poster_path: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    vote_average: 9.1,
    vote_count: 6100,
    release_date: '2026-06-18',
    original_language: 'en',
    runtime: 145,
    genres: ['Animation', 'Action', 'Sci-Fi'],
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    isUpcoming: true,
    tagline: 'Every Universe Has a Hero',
  },
  {
    id: 9904,
    title: 'The Batman Part II',
    original_title: 'The Batman Part II',
    overview: 'The Dark Knight investigates Gotham City\'s deepest corporate and political conspiracy during a harsh winter freezing the city.',
    poster_path: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/nMKdUUwvWjA23vuvBjhRSflmF3Z.jpg',
    vote_average: 8.9,
    vote_count: 5400,
    release_date: '2026-10-02',
    original_language: 'en',
    runtime: 165,
    genres: ['Crime', 'Drama', 'Thriller'],
    cast: ['Robert Pattinson', 'Colin Farrell', 'Andy Serkis', 'Jeffrey Wright'],
    isUpcoming: true,
    tagline: 'Gotham Never Sleeps',
  },
  {
    id: 9905,
    title: 'Gladiator II',
    original_title: 'Gladiator II',
    overview: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors.',
    poster_path: 'https://upload.wikimedia.org/wikipedia/en/0/04/Gladiator_II_%282024%29_poster.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    vote_average: 8.7,
    vote_count: 3200,
    release_date: '2024-11-22',
    original_language: 'en',
    runtime: 150,
    genres: ['Action', 'Drama', 'History'],
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    isUpcoming: true,
    tagline: 'Strength and Honor',
  },
  {
    id: 9906,
    title: 'Wicked',
    original_title: 'Wicked',
    overview: 'Elphaba, an misunderstood green-skinned woman, forms an unlikely friendship with Glinda before their choices lead them to fulfill their destinies as the Witches of Oz.',
    poster_path: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Wicked_%282024_film%29_poster.png',
    backdrop_path: 'https://image.tmdb.org/t/p/w1280/fm6K8Oi2AF2wfvV2Qp2Z55g7p4.jpg',
    vote_average: 8.8,
    vote_count: 4100,
    release_date: '2024-11-27',
    original_language: 'en',
    runtime: 160,
    genres: ['Fantasy', 'Music', 'Romance'],
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Jonathan Bailey', 'Jeff Goldblum'],
    isUpcoming: true,
    tagline: 'Discover the Untold Story of the Witches of Oz',
  }
];

export const fetchMovieDetails = async (movieId, apiKey = DEFAULT_API_KEY) => {
  const targetId = Number(movieId);
  const foundInCatalog = MASTER_MOVIES_CATALOG.find((m) => m.id === targetId);
  const foundInUpcoming = UPCOMING_MOVIES_LIST.find((m) => m.id === targetId);

  if (foundInCatalog || foundInUpcoming) {
    const found = foundInCatalog || foundInUpcoming;
    return {
      ...found,
      genres: found.genres || mapGenreIds(found.genre_ids),
      cast: found.credits?.cast
        ? found.credits.cast.map((c) => (typeof c === 'string' ? c : c.name))
        : (found.cast || ['Cast information available']),
    };
  }

  const endpoint = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      return {
        id: data.id,
        title: data.title || data.original_title || 'Untitled Movie',
        original_title: data.original_title || '',
        overview: data.overview || 'No synopsis description available.',
        tagline: data.tagline || '',
        poster_path: data.poster_path
          ? (data.poster_path.startsWith('http') ? data.poster_path : `https://image.tmdb.org/t/p/w500${data.poster_path}`)
          : 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        backdrop_path: data.backdrop_path
          ? (data.backdrop_path.startsWith('http') ? data.backdrop_path : `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`)
          : 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
        vote_average: data.vote_average ? Number(data.vote_average.toFixed(1)) : 7.0,
        vote_count: data.vote_count || 0,
        release_date: data.release_date || '2024-01-01',
        original_language: data.original_language || 'en',
        runtime: data.runtime || 120,
        genres: data.genres ? data.genres.map((g) => (typeof g === 'string' ? g : g.name)) : ['Cinema'],
        cast: data.credits?.cast
          ? data.credits.cast.slice(0, 6).map((c) => (typeof c === 'string' ? c : c.name))
          : ['Cast information available'],
        isUpcoming: new Date(data.release_date || '') > new Date(),
      };
    }
  } catch (_err) {}

  const fallback = MASTER_MOVIES_CATALOG[0];
  return {
    ...fallback,
    genres: fallback.genres || mapGenreIds(fallback.genre_ids),
    cast: fallback.credits?.cast
      ? fallback.credits.cast.map((c) => (typeof c === 'string' ? c : c.name))
      : ['Cast information available'],
  };
};

export const fetchUpcomingMovies = async () => {
  return {
    success: true,
    results: UPCOMING_MOVIES_LIST,
  };
};


