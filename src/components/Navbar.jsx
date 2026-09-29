import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, LayoutDashboard, Clapperboard, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
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
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3 flex items-center justify-between gap-4 shadow-lg shadow-black/50">
      
      {/* Brand Logo & Name */}
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full border-2 border-rose-500 bg-rose-950/50 flex items-center justify-center text-rose-500 shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
          <Film size={20} />
        </div>
        <div>
          <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            MovieMax <span className="text-rose-500">Cinema</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">TMDB API Cinema Hub</p>
        </div>
      </Link>

      {/* Main Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-full">
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
                  : 'text-slate-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Real-Time Clock & User Profile / Logout */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-rose-400 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <Clock size={14} className="text-rose-500 animate-pulse" />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center font-bold text-xs text-white">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">{currentUser?.name || 'Manager'}</span>
          <button
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 p-1 ml-1 transition-colors cursor-pointer"
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
