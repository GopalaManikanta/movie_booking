import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, Play, Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Exactly 2 Ultra-HD 4K Cinema Backdrop Images for 30-Second Auto Carousel
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2560&q=100',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2560&q=100',
];

export const Login = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  // 30-Second Image Slider Carousel State for 2 Images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 30000); // 30 seconds
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Please fill out your email address.';
    } else if (!isValidEmail) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Please fill out your password.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill out required fields before logging in.', 'error');
      return;
    }

    setErrors({});
    setLoading(true);
    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      showToast('Login Successful! Opening MovieMax Dashboard...', 'success');
      navigate('/profile', { replace: true });
    } else if (result.error) {
      showToast(result.error, 'error');
    }
  };

  const handleDemoFill = () => {
    setFormData({
      email: 'rahul@movie.com',
      password: 'Password123!',
      rememberMe: true,
    });
    setErrors({});
    showToast('Movie member account autofilled!', 'info');
  };

  const handleSocialConnect = (provider) => {
    showToast(`Connecting via ${provider}...`, 'info');
    setTimeout(() => {
      handleDemoFill();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex bg-black overflow-x-hidden font-sans">
      
      <div className="flex min-h-screen w-full relative bg-black border-none">
        
        {/* LEFT FORM PANEL */}
        <div className="w-full md:w-[40vw] h-screen px-6 lg:px-16 py-10 flex flex-col items-center justify-center text-center z-10 bg-black border-none outline-none shadow-none overflow-y-auto no-scrollbar">
          {/* Top Film Reel Circle Icon */}
          <div className="w-13 h-13 rounded-full border-[3.5px] border-rose-500 bg-rose-950/60 flex items-center justify-center text-rose-500 mb-4 shadow-lg shadow-rose-500/30">
            <Film size={24} />
          </div>

          {/* COLORFUL GRADIENT HEADING FOR "LOG IN / SIGN UP ON MOVIEMAX" */}
          <h2 className="text-2xl md:text-3xl font-black mb-5 tracking-tight">
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
              Log in / Sign Up On
            </span>{' '}
            <span className="text-white font-extrabold">
              MovieMax
            </span>
          </h2>

          {/* Simple Sleek Demo Credentials Pill */}
          <div className="w-full max-w-[360px] mb-4 flex">
            <button
              type="button"
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              onClick={handleDemoFill}
            >
              <Sparkles size={14} className="shrink-0 text-rose-500" />
              <span>Click to auto-fill: <strong className="text-rose-400 font-bold">rahul@movie.com</strong></span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-[360px] text-left" noValidate>
            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-300">Email Address:</label>
              <div className={`relative flex items-center bg-zinc-900 border rounded-xl transition-all shadow-sm ${errors.email ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-950/30' : isValidEmail ? 'border-emerald-500 ring-4 ring-emerald-500/15' : 'border-zinc-800 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20'}`}>
                <Mail className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="cinema@movietickets.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-white text-sm font-medium outline-none placeholder:text-slate-500"
                />
                {isValidEmail && !errors.email && <CheckCircle2 size={18} className="text-emerald-500 mr-3 shrink-0" />}
                {errors.email && <AlertCircle size={18} className="text-rose-500 mr-3 shrink-0" />}
              </div>
              {errors.email && (
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-0.5">
                  ⚠️ {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-bold text-slate-300">Password:</label>
              <div className={`relative flex items-center bg-zinc-900 border ${errors.password ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-950/30' : 'border-zinc-800 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20'} rounded-xl transition-all shadow-sm`}>
                <Lock className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="***************"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 pl-12 pr-12 text-white text-sm font-medium outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  className="absolute right-3 text-rose-500 hover:text-rose-400 p-1 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-0.5">
                  ⚠️ {errors.password}
                </span>
              )}
            </div>

            {/* Checkbox & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-rose-400 font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Red & Orange Gradient Pill Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-500 via-rose-400 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-lg shadow-rose-500/35 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Logging in...
                </span>
              ) : (
                'Log in to MovieMax'
              )}
            </button>
          </form>

          {/* Social Connect Icons */}
          <div className="text-center mt-6 w-full max-w-[360px]">
            <p className="text-xs text-slate-400 mb-3 font-medium">or connect with</p>
            <div className="flex justify-center gap-4">
              <button
                className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-blue-400 flex items-center justify-center font-extrabold text-lg hover:scale-110 transition-all shadow-sm cursor-pointer"
                onClick={() => handleSocialConnect('Facebook')}
                title="Connect with Facebook"
              >
                f
              </button>
              <button
                className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-rose-500 flex items-center justify-center font-extrabold text-lg hover:scale-110 transition-all shadow-sm cursor-pointer"
                onClick={() => handleSocialConnect('Google')}
                title="Connect with Google"
              >
                G
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-xs text-slate-400 text-center w-full max-w-[360px]">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-400 font-extrabold hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* RIGHT HD CINEMA PANEL WITH PERFECT SMOOTH FULL-HEIGHT CURVE */}
        <div 
          className="hidden md:flex absolute top-0 right-0 w-[60vw] lg:w-[62vw] h-screen rounded-l-full border-l-[3px] border-rose-500/60 shadow-[-20px_0_50px_rgba(244,63,94,0.3)] px-16 lg:px-24 py-16 flex-col justify-center text-white z-20 bg-center bg-cover bg-no-repeat transition-all duration-700 ease-in-out relative overflow-hidden"
          style={{ backgroundImage: `url(${HERO_IMAGES[currentImageIndex]})` }}
        >
          {/* Dark Overlay Tint for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent pointer-events-none"></div>

          <div className="max-w-[480px] text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/30 border border-rose-500/80 text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-4 shadow-lg shadow-rose-500/40 backdrop-blur-md">
              <Sparkles size={14} /> LIVE IN THEATERS
            </span>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.95)]">
              MovieMax <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Movie Tickets</span>
            </h1>
            <p className="text-sm font-medium text-white/90 leading-relaxed mb-7 [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]">
              Experience the ultimate movie ticket booking portal. Reserve Dolby Atmos recliners, access instant digital QR tickets, and enjoy VIP cinema privileges.
            </p>

            <div className="flex items-center gap-5">
              <button
                type="button"
                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-rose-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                onClick={() => showToast('Explore MovieMax VIP Cinema Perks', 'info')}
              >
                Explore Movies
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full border-2 border-white bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                onClick={() => showToast('Playing Movie Trailers...', 'info')}
                title="Watch Movie Trailers"
              >
                <Play size={18} fill="#ffffff" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
