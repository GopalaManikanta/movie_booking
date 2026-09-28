import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, Play, Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

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
    const result = await login(formData.email.trim(), formData.password, formData.rememberMe);
    setLoading(false);

    if (result.success) {
      showToast('Login Successful! Opening CineMax Dashboard...', 'success');
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
    <div className="relative w-screen h-screen flex bg-rose-50 overflow-hidden font-sans">
      {/* Background Decorative Red Bubbles */}
      <div className="absolute top-[6%] left-[5%] w-36 h-36 rounded-full border-2 border-rose-500/20 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[8%] w-16 h-16 rounded-full border-2 border-rose-500/20 pointer-events-none"></div>

      <div className="flex w-screen h-screen overflow-hidden relative bg-white">
        {/* LEFT FORM PANEL */}
        <div className="w-full md:w-[50vw] h-screen px-6 md:px-20 py-10 flex flex-col items-center justify-center text-center z-10 bg-white border-none overflow-y-auto no-scrollbar">
          {/* Top Film Reel Circle Icon */}
          <div className="w-13 h-13 rounded-full border-[3.5px] border-rose-500 bg-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-lg shadow-rose-500/20">
            <Film size={24} />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-5 tracking-tight">
            Log in / Sign Up On <span className="text-rose-600">CineMax</span>
          </h2>

          {/* Simple Sleek Demo Credentials Pill */}
          <div className="w-full max-w-[360px] mb-4 flex">
            <button
              type="button"
              className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-4 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm transform hover:-translate-y-0.5"
              onClick={handleDemoFill}
            >
              <Sparkles size={14} className="shrink-0" />
              <span>Click to auto-fill: <strong className="text-rose-600 font-bold">rahul@movie.com</strong></span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-[360px] text-left" noValidate>
            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address:</label>
              <div className={`relative flex items-center bg-white border rounded-xl transition-all shadow-sm ${errors.email ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40' : isValidEmail ? 'border-emerald-500 ring-4 ring-emerald-500/15' : 'border-slate-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20'}`}>
                <Mail className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="cinema@movietickets.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-900 text-sm font-medium outline-none placeholder:text-slate-400"
                />
                {isValidEmail && !errors.email && <CheckCircle2 size={18} className="text-emerald-500 mr-3 shrink-0" />}
                {errors.email && <AlertCircle size={18} className="text-rose-500 mr-3 shrink-0" />}
              </div>
              {errors.email && (
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                  ⚠️ {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-bold text-slate-700">Password:</label>
              <div className={`relative flex items-center bg-white border ${errors.password ? 'border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40' : 'border-slate-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20'} rounded-xl transition-all shadow-sm`}>
                <Lock className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="***************"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 pl-12 pr-12 text-slate-900 text-sm font-medium outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="absolute right-3 text-rose-500 hover:text-rose-600 p-1 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                  ⚠️ {errors.password}
                </span>
              )}
            </div>

            {/* Checkbox & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="text-rose-600 font-bold hover:underline">
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
                'Log in to CineMax'
              )}
            </button>
          </form>

          {/* Social Connect Icons (f and G) */}
          <div className="text-center mt-6 w-full max-w-[360px]">
            <p className="text-xs text-slate-500 mb-3 font-medium">or connect with</p>
            <div className="flex justify-center gap-4">
              <button
                className="w-10 h-10 rounded-full border border-blue-200 bg-white text-blue-600 flex items-center justify-center font-extrabold text-lg hover:scale-110 transition-all shadow-sm"
                onClick={() => handleSocialConnect('Facebook')}
                title="Connect with Facebook"
              >
                f
              </button>
              <button
                className="w-10 h-10 rounded-full border border-rose-200 bg-white text-rose-500 flex items-center justify-center font-extrabold text-lg hover:scale-110 transition-all shadow-sm"
                onClick={() => handleSocialConnect('Google')}
                title="Connect with Google"
              >
                G
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-xs text-slate-500 text-center w-full max-w-[360px]">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-600 font-extrabold hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* RIGHT GIANT RED & BLACK MOVIE CIRCLE PANEL */}
        <div className="hidden md:flex absolute -top-[5vh] -right-[5vw] w-[62vw] h-[110vh] rounded-l-[500px] px-24 py-16 flex-col justify-center text-white z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.35)] bg-[url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2000&q=100')] bg-center bg-cover bg-no-repeat">
          <div className="max-w-[440px] text-left">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/25 border border-rose-500/80 text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-4 shadow-lg shadow-rose-500/40 backdrop-blur-md">
              <Sparkles size={14} /> LIVE IN THEATERS
            </span>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.95)]">
              CineMax <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Movie Tickets</span>
            </h1>
            <p className="text-sm font-medium text-white/90 leading-relaxed mb-7 [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]">
              Experience the ultimate movie ticket booking portal. Reserve Dolby Atmos recliners, access instant digital QR tickets, and enjoy VIP cinema privileges.
            </p>

            <div className="flex items-center gap-5">
              <button
                type="button"
                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-rose-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                onClick={() => showToast('Explore CineMax VIP Cinema Perks', 'info')}
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
