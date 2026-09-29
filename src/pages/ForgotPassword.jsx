import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export const ForgotPassword = () => {
  const { usersDb, resetPassword, showToast } = useAuth();
  const navigate = useNavigate();

  // Wizard Steps: 1 = Enter Email, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Timer effect for automatic redirect on success step
  useEffect(() => {
    let timer = null;
    if (step === 4 && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 4 && redirectCountdown === 0) {
      navigate('/login');
    }
    return () => clearInterval(timer);
  }, [step, redirectCountdown, navigate]);

  // Step 1: Handle Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setErrors({ email: 'Please enter your registered email address.' });
      return;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    const foundUser = usersDb.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!foundUser) {
      setErrors({ email: 'No account found with this email. Try rahul@movie.com' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setErrors({});
      setLoading(false);
      setStep(2);
      setResendTimer(60);
      showToast(`🔑 Your Security OTP Code is: ${mockOtp}`, 'info');
    }, 700);
  };

  // Step 2: Handle OTP Change & Key navigation
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...userEnteredOtp];
    newOtp[index] = value;
    setUserEnteredOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !userEnteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    setUserEnteredOtp(generatedOtp.split(''));
    showToast('OTP code auto-filled!', 'success');
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setUserEnteredOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    showToast(`🔑 New OTP Code sent: ${mockOtp}`, 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = userEnteredOtp.join('');
    if (otpCode.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits of the OTP code.' });
      return;
    }

    if (otpCode !== generatedOtp) {
      setErrors({ otp: 'Invalid OTP code. Please enter the code shown above.' });
      return;
    }

    setErrors({});
    setStep(3);
    showToast('OTP verified! Please set your new password.', 'success');
  };

  // Step 3: Handle Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, newPassword);
    setLoading(false);

    if (result.success) {
      setStep(4);
      showToast('Password updated successfully!', 'success');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-black overflow-x-hidden font-sans text-slate-100">
      {/* Background Decorative Red Glows */}
      <div className="absolute top-[6%] left-[5%] w-48 h-48 rounded-full border border-rose-500/10 bg-rose-500/5 blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[8%] w-32 h-32 rounded-full border border-rose-500/10 bg-rose-500/5 blur-lg pointer-events-none"></div>

      <div className="flex min-h-screen w-full relative bg-black">
        {/* LEFT FORM PANEL */}
        <div className="w-full md:w-[50vw] h-screen px-6 md:px-20 py-10 flex flex-col items-center justify-center text-center z-10 bg-black border-none overflow-y-auto no-scrollbar">
          {/* Wizard Steps Header */}
          <div className="flex items-center justify-center gap-2 mb-6 w-full max-w-[320px]">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-extrabold text-xs transition-all ${step >= 1 ? 'bg-gradient-to-r from-rose-600 to-orange-500 border-transparent text-white shadow-md shadow-rose-950/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>1</div>
            <div className={`flex-1 h-0.75 rounded transition-all ${step >= 2 ? 'bg-rose-500' : 'bg-zinc-800'}`}></div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-extrabold text-xs transition-all ${step >= 2 ? 'bg-gradient-to-r from-rose-600 to-orange-500 border-transparent text-white shadow-md shadow-rose-950/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>2</div>
            <div className={`flex-1 h-0.75 rounded transition-all ${step >= 3 ? 'bg-rose-500' : 'bg-zinc-800'}`}></div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-extrabold text-xs transition-all ${step >= 3 ? 'bg-gradient-to-r from-rose-600 to-orange-500 border-transparent text-white shadow-md shadow-rose-950/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>3</div>
          </div>

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <div className="w-13 h-13 rounded-full border border-rose-500/40 bg-rose-950/40 flex items-center justify-center text-rose-500 mx-auto mb-3 shadow-lg shadow-rose-950/50">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Forgot Password?</h2>
                <p className="text-xs text-slate-400 font-medium">Enter your registered email address to receive a security code</p>
              </div>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-4 w-full max-w-[360px] text-left" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-email" className="text-xs font-bold text-slate-300">Email Address:</label>
                  <div className={`relative flex items-center bg-zinc-900 border ${errors.email ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'} rounded-xl transition-all shadow-sm`}>
                    <Mail className="absolute left-4 text-rose-500 shrink-0" size={18} />
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="e.g. rahul@movie.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({});
                      }}
                      className="w-full bg-transparent py-3 pl-12 pr-4 text-white text-sm font-medium outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  {errors.email && <span className="text-xs font-semibold text-rose-400">{errors.email}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-lg shadow-rose-950/60 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Sending Verification Code...' : 'Send OTP Code'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <>
              <div className="text-center mb-4">
                <div className="w-13 h-13 rounded-full border border-rose-500/40 bg-rose-950/40 flex items-center justify-center text-rose-500 mx-auto mb-3 shadow-lg shadow-rose-950/50">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Verify OTP Code</h2>
                <p className="text-xs text-slate-400 font-medium">Enter the 6-digit code sent to <strong className="text-slate-200">{email}</strong></p>
              </div>

              {/* Real-time Mock OTP Display Banner */}
              <div className="bg-rose-950/60 border-2 border-dashed border-rose-500/60 rounded-xl p-4 mb-4 text-center flex flex-col items-center gap-2 w-full max-w-[360px]">
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-extrabold uppercase tracking-wide">
                  <Sparkles size={14} />
                  <span>Real-Time Security Code</span>
                </div>
                <div className="text-3xl font-black tracking-[6px] text-rose-400 font-mono">{generatedOtp}</div>
                <button
                  type="button"
                  className="bg-rose-600 hover:bg-rose-500 text-white border-none py-1.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-all shadow-md shadow-rose-950/60 transform hover:scale-105"
                  onClick={handleAutoFillOtp}
                >
                  ⚡ Auto-fill Code ({generatedOtp})
                </button>
              </div>

              {errors.otp && (
                <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-3 rounded-xl text-xs font-bold mb-3 text-center w-full max-w-[360px]">
                  {errors.otp}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 w-full max-w-[360px]">
                <div className="flex justify-center gap-2 my-2 w-full">
                  {userEnteredOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      className="w-11 h-13 rounded-xl border border-zinc-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-zinc-900 text-center text-xl font-black text-white outline-none transition-all shadow-sm"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>

                <div className="flex justify-center items-center my-1 text-xs">
                  {resendTimer > 0 ? (
                    <span className="text-slate-400 font-medium">
                      Resend code in <strong className="text-rose-400 font-bold">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="bg-transparent border-none text-rose-400 font-bold text-xs cursor-pointer flex items-center gap-1.5 hover:underline p-0 hover:text-rose-300"
                      onClick={handleResendOtp}
                    >
                      <RefreshCw size={14} /> Resend OTP Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-lg shadow-rose-950/60 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Verify Code
                </button>
              </form>
            </>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <div className="w-13 h-13 rounded-full border border-rose-500/40 bg-rose-950/40 flex items-center justify-center text-rose-500 mx-auto mb-3 shadow-lg shadow-rose-950/50">
                  <Lock size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-1">Set New Password</h2>
                <p className="text-xs text-slate-400 font-medium">Your password must be at least 8 characters long</p>
              </div>

              {errors.general && (
                <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-3 rounded-xl text-xs font-bold mb-3 text-center w-full max-w-[360px]">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-full max-w-[360px] text-left" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">New Password:</label>
                  <div className={`relative flex items-center bg-zinc-900 border ${errors.newPassword ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'} rounded-xl transition-all shadow-sm`}>
                    <Lock className="absolute left-4 text-rose-500 shrink-0" size={18} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent py-3 pl-12 pr-12 text-white text-sm font-medium outline-none placeholder:text-zinc-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 text-rose-400 hover:text-rose-300 p-1 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="text-xs font-semibold text-rose-400">{errors.newPassword}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Confirm New Password:</label>
                  <div className={`relative flex items-center bg-zinc-900 border ${errors.confirmPassword ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-800 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'} rounded-xl transition-all shadow-sm`}>
                    <ShieldCheck className="absolute left-4 text-rose-500 shrink-0" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent py-3 pl-12 pr-12 text-white text-sm font-medium outline-none placeholder:text-zinc-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 text-rose-400 hover:text-rose-300 p-1 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-xs font-semibold text-rose-400">{errors.confirmPassword}</span>}
                </div>

                <PasswordStrengthMeter password={newPassword} />

                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-lg shadow-rose-950/60 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? 'Resetting Password...' : 'Update Password'}
                </button>
              </form>
            </>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center py-4 w-full max-w-[360px]">
              <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-4 border-emerald-500/40 flex items-center justify-center mb-5 shadow-xl shadow-emerald-950/80">
                <CheckCircle2 size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Password Changed!</h2>
              <p className="text-xs text-slate-400 font-medium mb-4">Your password has been updated. You will be redirected to Login automatically.</p>
              
              <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 px-4 py-2 rounded-full text-xs font-bold mb-5">
                Redirecting to Login in <strong className="font-extrabold">{redirectCountdown}s</strong>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 px-6 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-lg shadow-rose-950/60 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Go to Sign In Now
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold hover:underline transition-all hover:-translate-x-1 hover:text-rose-300">
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT GIANT CURVED CIRCLE OVERLAY PANEL */}
        <div className="hidden md:flex absolute -top-[5vh] -right-[5vw] w-[62vw] h-[110vh] rounded-l-[500px] px-24 py-16 flex-col justify-center text-white z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.85)] bg-[url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2000&q=100')] bg-center bg-cover bg-no-repeat border-l-[3px] border-rose-500/60">
          <div className="max-w-[440px] text-left">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/25 border border-rose-500/80 text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-4 shadow-lg shadow-rose-500/40 backdrop-blur-md">
              <Sparkles size={14} /> SECURITY CENTER
            </span>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight leading-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.95)]">
              MovieMax <span className="bg-gradient-to-r from-rose-500 via-rose-300 to-orange-400 bg-clip-text text-transparent">Account Recovery</span>
            </h1>
            <p className="text-sm font-medium text-white/90 leading-relaxed mb-7 [text-shadow:_0_2px_16px_rgba(0,0,0,0.95)]">
              Your security is our top priority. Reset your password securely and return to booking your favorite blockbuster movies!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
