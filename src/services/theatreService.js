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
