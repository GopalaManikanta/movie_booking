import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, Film, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export const Register = () => {
  const { register, showToast, theme } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      showToast('Account created successfully! Welcome to MovieMax.', 'success');
      navigate('/profile');
    } else if (result.error) {
      setErrors((prev) => ({ ...prev, general: result.error }));
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex overflow-x-hidden font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Decorative Red Glows */}
      <div className="absolute top-[6%] left-[5%] w-48 h-48 rounded-full border border-rose-500/10 bg-rose-500/5 blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[8%] w-32 h-32 rounded-full border border-rose-500/10 bg-rose-500/5 blur-lg pointer-events-none"></div>

      <div className="flex min-h-screen w-full relative border-none">
        {/* LEFT FORM PANEL */}
        <div className={`w-full md:w-[50vw] h-screen px-6 md:px-20 py-8 flex flex-col items-center justify-center text-center z-10 border-none overflow-y-auto no-scrollbar transition-colors ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }`}>
          {/* Top Film Reel Ring Icon */}
          <div className="w-12 h-12 rounded-full border border-rose-500/40 bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3 shadow-lg shadow-rose-500/20">
            <Film size={22} />
          </div>

          {/* Heading */}
          <h2 className={`text-2xl font-black mb-1 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Join <span className="text-rose-500">MovieMax</span> Today
          </h2>
          <p className={`text-xs font-medium mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Create your account to unlock instant movie tickets & VIP seats</p>

          {errors.general && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-3 rounded-xl text-xs font-bold mb-3 w-full max-w-[360px]">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-[360px] text-left" noValidate>
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Full Name:</label>
              <div className={`relative flex items-center border rounded-xl transition-all shadow-sm ${
                errors.name 
                  ? 'border-rose-500 ring-2 ring-rose-500/20' 
                  : theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              }`}>
                <User className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Manikanta"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-transparent py-2.5 pl-12 pr-4 text-sm font-medium outline-none ${
                    theme === 'dark' ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              {errors.name && <span className="text-xs font-semibold text-rose-500">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Email Address:</label>
              <div className={`relative flex items-center border rounded-xl transition-all shadow-sm ${
                errors.email 
                  ? 'border-rose-500 ring-2 ring-rose-500/20' 
                  : theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              }`}>
                <Mail className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="cinema@movietickets.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent py-2.5 pl-12 pr-4 text-sm font-medium outline-none ${
                    theme === 'dark' ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              {errors.email && <span className="text-xs font-semibold text-rose-500">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number (Optional):</label>
              <div className={`relative flex items-center border rounded-xl transition-all shadow-sm ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              }`}>
                <Phone className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-transparent py-2.5 pl-12 pr-4 text-sm font-medium outline-none ${
                    theme === 'dark' ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Password:</label>
              <div className={`relative flex items-center border rounded-xl transition-all shadow-sm ${
                errors.password 
                  ? 'border-rose-500 ring-2 ring-rose-500/20' 
                  : theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              }`}>
                <Lock className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-transparent py-2.5 pl-12 pr-12 text-sm font-medium outline-none ${
                    theme === 'dark' ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 text-rose-500 hover:text-rose-600 p-1 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs font-semibold text-rose-500">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Confirm Password:</label>
              <div className={`relative flex items-center border rounded-xl transition-all shadow-sm ${
                errors.confirmPassword 
                  ? 'border-rose-500 ring-2 ring-rose-500/20' 
                  : theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              }`}>
                <ShieldCheck className="absolute left-4 text-rose-500 shrink-0" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-transparent py-2.5 pl-12 pr-12 text-sm font-medium outline-none ${
                    theme === 'dark' ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 text-rose-500 hover:text-rose-600 p-1 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-xs font-semibold text-rose-500">{errors.confirmPassword}</span>}
            </div>

            {/* Live Password Strength Bar */}
            <PasswordStrengthMeter password={formData.password} />

            {/* Terms Checkbox */}
            <div className="mt-1">
              <label className={`flex items-center gap-2 font-semibold text-xs cursor-pointer ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="accent-rose-500 w-4 h-4 cursor-pointer"
                />
                I agree to the <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}>Terms & Privacy Policy</strong>
              </label>
              {errors.agreeTerms && <span className="text-xs font-semibold text-rose-500 block mt-1">{errors.agreeTerms}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create MovieMax Account'}
            </button>
          </form>

          {/* Footer Link */}
          <div className={`mt-4 text-xs text-center w-full max-w-[360px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-rose-500 font-extrabold hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT GIANT CURVED CIRCLE OVERLAY PANEL */}
        <div className="hidden md:flex absolute -top-[5vh] -right-[5vw] w-[62vw] h-[110vh] rounded-l-[500px] px-24 py-16 flex-col justify-center text-white z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.85)] bg-[url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2000&q=100')] bg-center bg-cover bg-no-repeat border-l-[3px] border-rose-500/60">
          <div className="max-w-[440px] text-left">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/25 border border-rose-500/80 text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-4 shadow-lg shadow-rose-500/40 backdrop-blur-md">
              <Sparkles size={14} /> VIP MEMBER ACCESS
            </span>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.95)]">
              Experience <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Cinema Magic</span>
            </h1>
            <p className="text-sm font-medium text-white/90 leading-relaxed mb-7 [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]">
              Join thousands of movie lovers enjoying instant online ticket bookings, zero booking fees, and exclusive premiere access!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
