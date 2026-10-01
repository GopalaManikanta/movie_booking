import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { showToast } = useToast();

  // Load bookings from localStorage
  const [userBookings, setUserBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem('cinemax_user_bookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch {
      return [];
    }
  });

  // Sync bookings changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinemax_user_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error('Failed to sync userBookings to localStorage:', e);
    }
  }, [userBookings]);

  // Add new ticket booking with collision-free Booking ID generation
  const addBooking = useCallback((bookingData) => {
    const existingIds = new Set((userBookings || []).map(b => b.id));
    let uniqueSuffix = Math.floor(100000 + Math.random() * 900000);
    while (existingIds.has(`TKT-2026-${uniqueSuffix}`)) {
      uniqueSuffix = Math.floor(100000 + Math.random() * 900000);
    }
    const bookingId = bookingData.id || `TKT-2026-${uniqueSuffix}`;

    const newBooking = {
      id: bookingId,
      customer: bookingData.customer || 'Manikanta',
      movie: bookingData.movie || 'Deadpool & Wolverine',
      movieId: bookingData.movieId,
      theater: bookingData.theater || 'AMB Cinemas: Screen 1 (4K Dolby)',
      showTime: bookingData.showTime || bookingData.time || '06:30 PM',
      seats: bookingData.seats || 'Recliner (A1, A2)',
      seatCodes: bookingData.seatCodes || [],
      amount: bookingData.amount || 350,
      subtotal: bookingData.subtotal || bookingData.amount || 350,
      convenienceFee: bookingData.convenienceFee || 30,
      gst: bookingData.gst || 0,
      status: 'Confirmed 🟢',
      time: bookingData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      timestamp: Date.now(),
    };

    setUserBookings((prev) => [newBooking, ...prev]);
    if (showToast) {
      showToast(`🎟️ Ticket Booked Successfully! ID: ${newBooking.id}`, 'success');
    }
    return newBooking;
  }, [userBookings, showToast]);

  // Clear all bookings state
  const clearBookings = useCallback(() => {
    setUserBookings([]);
    if (showToast) {
      showToast('Cleared all bookings state back to 0.', 'info');
    }
  }, [showToast]);

  // Cancel Booking and mark as Cancelled 🔴
  const cancelBooking = useCallback((bookingId) => {
    setUserBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled 🔴' } : b
      )
    );
    if (showToast) {
      showToast(`🔴 Booking ${bookingId} cancelled. Refund initiated!`, 'info');
    }
  }, [showToast]);

  // Dynamic Occupied Seats Finder
  const getOccupiedSeats = useCallback((movieTitle, theaterName, showTime) => {
    const baseOccupied = ['A3', 'A4', 'B7', 'C2', 'C3', 'D8', 'D9', 'F5', 'F6', 'G1', 'G2'];
    if (!userBookings || userBookings.length === 0) return baseOccupied;

    const targetMovie = (movieTitle || '').toLowerCase();
    const targetTheater = (theaterName || '').toLowerCase();
    const targetTime = (showTime || '').toLowerCase();

    const matching = userBookings.filter(b => {
      // Exclude cancelled bookings so seats are freed up
      if (b.status === 'Cancelled 🔴') return false;

      const bMovie = (b.movie || '').toLowerCase();
      const bTheater = (b.theater || '').toLowerCase();
      const bTime = (b.showTime || b.time || '').toLowerCase();

      const movieMatch = bMovie && (bMovie.includes(targetMovie) || targetMovie.includes(bMovie));
      const theaterMatch = bTheater && (bTheater.includes(targetTheater.split(':')[0].toLowerCase()) || targetTheater.includes(bTheater.split('[')[0].trim()));
      const timeMatch = !targetTime || !bTime || bTime.includes(targetTime) || targetTime.includes(bTime);

      return movieMatch && theaterMatch && timeMatch;
    });

    const bookedCodes = [];
    matching.forEach(b => {
      if (Array.isArray(b.seatCodes) && b.seatCodes.length > 0) {
        bookedCodes.push(...b.seatCodes);
      } else if (typeof b.seats === 'string') {
        const matches = b.seats.match(/[A-G]\d{1,2}/g);
        if (matches) bookedCodes.push(...matches);
      }
    });

    return Array.from(new Set([...baseOccupied, ...bookedCodes]));
  }, [userBookings]);

  // Helper to check if a single seat is already booked
  const isSeatBooked = useCallback((movieTitle, theaterName, showTime, seatCode) => {
    const occupied = getOccupiedSeats(movieTitle, theaterName, showTime);
    return occupied.includes(seatCode);
  }, [getOccupiedSeats]);

  const value = {
    userBookings,
    addBooking,
    cancelBooking,
    clearBookings,
    getOccupiedSeats,
    isSeatBooked,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
