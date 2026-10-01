import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, LayoutDashboard, Clapperboard, Building2, LogOut, Clock, Sun, Moon, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { currentUser, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Real-Time Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Operations Hub', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Movie Catalog', path: '/movies', icon: Clapperboard },
    { label: 'Theatre Listing', path: '/theatres', icon: Building2 },
    { label: 'Booking History', path: '/history', icon: Ticket },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-zinc-950/95 border-b border-zinc-800/80 shadow-black/50 text-white'
        : 'bg-white/95 border-b border-slate-200 shadow-slate-200/50 text-slate-900'
    }`}>
      
      {/* Brand Logo & Name */}
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full border-2 border-rose-500 bg-rose-950/50 flex items-center justify-center text-rose-500 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
          <Film size={20} />
        </div>
        <div>
          <h1 className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            MovieMax <span className="text-rose-500">Cinema</span>
          </h1>
          <p className={`text-[10px] font-semibold tracking-wider uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>TMDB API Cinema Hub</p>
        </div>
      </Link>

      {/* Main Navigation Links */}
      <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border ${
        theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/movies' && location.pathname.startsWith('/movie'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md shadow-rose-950/50'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-zinc-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Theme Toggle, Clock & User Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border cursor-pointer shadow-sm ${
            theme === 'dark'
              ? 'bg-zinc-900 border-zinc-700 text-amber-400 hover:bg-zinc-800'
              : 'bg-slate-100 border-slate-300 text-rose-600 hover:bg-slate-200'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Real-time Clock */}
        <div className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-rose-400' : 'bg-slate-100 border-slate-200 text-rose-600'
        }`}>
          <Clock size={14} className="text-rose-500 animate-pulse" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        {/* User Pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center font-bold text-xs text-white">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <span className={`text-xs font-bold hidden sm:inline ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            {currentUser?.name || 'Manager'}
          </span>
          <button
            onClick={handleLogout}
            className="text-rose-500 hover:text-rose-400 p-1 ml-1 transition-colors cursor-pointer"
            title="Logout Session"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
