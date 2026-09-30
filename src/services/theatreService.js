import { MASTER_THEATRES_CATALOG } from '../data/theatresData';

export const fetchTheatres = async ({
  page = 1,
  searchQuery = '',
  selectedCity = 'All Cities',
  limit = 6,
} = {}) => {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 200));

  let filtered = [...MASTER_THEATRES_CATALOG];

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (th) =>
        th.name.toLowerCase().includes(q) ||
        th.city.toLowerCase().includes(q) ||
        th.address.toLowerCase().includes(q) ||
        th.landmark.toLowerCase().includes(q)
    );
  }

  if (selectedCity && selectedCity !== 'All Cities') {
    filtered = filtered.filter(
      (th) => th.city.toLowerCase() === selectedCity.toLowerCase()
    );
  }

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * limit;
  const paginatedResults = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    page: currentPage,
    totalPages: totalPages,
    totalResults: totalResults,
    results: paginatedResults,
  };
};

export const fetchTheatreDetails = async (theatreId) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const found = MASTER_THEATRES_CATALOG.find((t) => t.id === theatreId);
  return found || MASTER_THEATRES_CATALOG[0];
};

export const getTheatresForMovie = (movieId, movieTitle) => {
  const targetId = Number(movieId);
  const targetTitle = (movieTitle || '').toLowerCase().trim();

  const matchingOptions = [];

  MASTER_THEATRES_CATALOG.forEach((th) => {
    if (Array.isArray(th.screens)) {
      th.screens.forEach((scr) => {
        const scrMovieId = Number(scr.movieId);
        const scrMovieTitle = (scr.movieTitle || '').toLowerCase().trim();

        const isMatch =
          (targetId && scrMovieId === targetId) ||
          (targetTitle && (scrMovieTitle.includes(targetTitle) || targetTitle.includes(scrMovieTitle)));

        if (isMatch) {
          matchingOptions.push({
            theatreId: th.id,
            theatreName: th.name,
            screenName: scr.screenName,
            format: scr.format,
            fullName: `${th.name.split(':')[0].trim()}: ${scr.screenName} (${scr.format})`,
            showtimes: scr.showtimes || ['11:00 AM', '02:15 PM', '06:30 PM', '09:45 PM'],
          });
        }
      });
    }
  });

  if (matchingOptions.length > 0) {
    return matchingOptions;
  }

  // Fallback options for dynamic TMDB titles or unlisted movies
  return [
    {
      theatreId: 'th-2',
      theatreName: "Prasad's Multiplex & Large Screen",
      screenName: 'Large Screen (PCX 64ft)',
      format: '4K Dual Laser Large Format',
      fullName: "Prasad's Multiplex: Large Screen (PCX 4K)",
      showtimes: ['09:30 AM', '01:15 PM', '05:00 PM', '08:45 PM'],
    },
    {
      theatreId: 'th-1',
      theatreName: 'AMB Cinemas: Gachibowli',
      screenName: 'Screen 1 (VIP Superplex)',
      format: 'Dolby Atmos 4K',
      fullName: 'AMB Cinemas: Screen 1 (4K Dolby)',
      showtimes: ['10:15 AM', '01:45 PM', '05:15 PM', '09:00 PM'],
    },
    {
      theatreId: 'th-3',
      theatreName: 'PVR PXL: Forum Sujana Mall',
      screenName: 'PXL Auditorium 1',
      format: 'PVR PXL 4K Atmos',
      fullName: 'PVR Forum Mall: Screen 1 (PXL Atmos)',
      showtimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'],
    },
    {
      theatreId: 'th-4',
      theatreName: 'INOX: GVK One Mall',
      screenName: 'INSIGNIA Audi 1',
      format: 'Ultra HD 4K Dolby Atmos',
      fullName: 'INOX GVK One: INSIGNIA Audi 1',
      showtimes: ['11:00 AM', '02:45 PM', '06:30 PM', '10:00 PM'],
    }
  ];
};
