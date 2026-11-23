import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KingIcon, KnightIcon, PawnIcon } from '../components/ChessIcons';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Hash,
  Info,
  GraduationCap
} from 'lucide-react';

export default function Register() {
  const { register, currentUser, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    chessUsername: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Automatically redirect already authenticated users to their authorized dashboard
  useEffect(() => {
    if (!authLoading && currentUser && userRole) {
      if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (userRole === 'coach') navigate('/coach/dashboard', { replace: true });
      else navigate('/member/dashboard', { replace: true });
    }
  }, [currentUser, userRole, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your Full Name.';
    if (formData.fullName.trim().length < 2) return 'Full Name must be at least 2 characters.';
    
    if (!formData.chessUsername.trim()) return 'Please choose a Chess Username.';
    if (formData.chessUsername.trim().length < 3) return 'Chess Username must be at least 3 characters.';
    
    // Alphanumeric + underscore check for username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.chessUsername.trim())) {
      return 'Chess Username may only contain letters, numbers, and underscores.';
    }

    if (!formData.email.trim()) return 'Please enter your email address.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (formData.password.length < 6) return 'Password must be at least 6 characters long.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    if (!formData.agreeTerms) return 'You must agree to the Club Rules and Fair-Play Code.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Public registration securely provisions the Student/Member role
      await register(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim(),
        formData.chessUsername.trim()
      );

      setSuccessMessage('Student account created! Directing you to your Student Lounge...');

      setTimeout(() => {
        navigate('/member/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      let friendlyError = 'Registration failed. Please check your information.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email address is already in use by another chess club account.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyError = 'Network error: Could not connect to Firebase Authentication servers. Check your internet connection.';
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        friendlyError = 'Invalid Firebase API Key. Please verify your configuration in .env.';
      } else if (err.message) {
        friendlyError = err.message;
      }
      setErrorMessage(friendlyError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-ivory-warm">
      {/* ================= LEFT SIDE: Student Journey & Philosophy ================= */}
      <div className="relative w-full lg:w-5/12 min-h-[400px] lg:min-h-screen bg-emerald-deep flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden text-ivory-warm">
        {/* Realistic Chess Photography */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-25 scale-100 transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1920&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-deep/95 to-emerald-deep/85" />
        <div className="absolute inset-0 bg-chess-pattern opacity-25 pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-dark/95 border border-copper/50 flex items-center justify-center shadow-lg">
            <KnightIcon className="w-8 h-8 text-copper-light" />
          </div>
          <div>
            <span className="block font-display text-xl tracking-[0.18em] font-bold text-ivory-warm">
              ROYAL GAMBIT
            </span>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-copper-light font-semibold">
              Student Enrolment
            </span>
          </div>
        </div>

        {/* Center Philosophy - Completely Unblocked */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-dark/80 border border-copper/40 text-copper-light text-xs font-semibold uppercase tracking-wider mb-5">
            <GraduationCap className="w-4 h-4 text-copper-light" />
            <span>Student Academy Membership</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ivory-warm leading-tight">
            Your Chess Journey <br />
            <span className="text-copper-accent italic">
              Starts Here
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-ivory-soft leading-relaxed font-sans">
            Elevate your strategic vision with structured tactical masterclasses, FIDE-rated club tournaments, and personalized mentor evaluations.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-dark/70 border border-copper/30 text-xs text-ivory-soft space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-copper-light">
              <ShieldCheck className="w-4 h-4 text-copper-light" />
              <span>Role-Based Governance</span>
            </div>
            <p className="text-ivory-muted leading-relaxed">
              All public registrations receive authenticated <strong className="text-ivory-warm">Student</strong> tier privileges. Coach and Administrator credentials are strictly provisioned by the executive board.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-ivory-muted/70 flex items-center justify-between">
          <span>Royal Gambit Chess Club © 2026</span>
          <span className="font-mono text-copper-light/80">Student Portal</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Registration Form ================= */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-dark">
              Join Royal Gambit
            </h2>
            <p className="mt-1 text-sm text-slate-dark/70">
              Create your student membership account.
            </p>

            {/* Small note required by user */}
            <div className="mt-3 p-3 rounded-xl bg-ivory-soft/80 border border-slate-dark/10 text-xs text-slate-dark/80 flex items-start gap-2">
              <Info className="w-4 h-4 text-copper shrink-0 mt-0.5" />
              <span>New accounts are automatically registered as Students. Coaches and Administrators receive their access from club management.</span>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Mikhail Tal"
                    className="w-full bg-white border border-slate-dark/20 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-dark text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 shadow-sm"
                  />
                </div>
              </div>

              {/* Chess Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                  Chess Username
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="chessUsername"
                    value={formData.chessUsername}
                    onChange={handleChange}
                    placeholder="mikhail_tactics"
                    className="w-full bg-white border border-slate-dark/20 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-dark text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@chessclub.com"
                  className="w-full bg-white border border-slate-dark/20 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-dark text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 shadow-sm"
                />
              </div>
            </div>

            {/* Password & Confirm Password with Show/Hide Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full bg-white border border-slate-dark/20 rounded-xl pl-10 pr-10 py-2.5 text-slate-dark text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark/50 hover:text-slate-dark cursor-pointer p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full bg-white border border-slate-dark/20 rounded-xl pl-10 pr-10 py-2.5 text-slate-dark text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark/50 hover:text-slate-dark cursor-pointer p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-dark/80">
                <input
                  type="checkbox"
                  required
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded text-copper accent-copper cursor-pointer"
                />
                <span>
                  I agree to the <span className="font-semibold text-copper">Royal Gambit Fair-Play Code</span> and accept student membership terms.
                </span>
              </label>
            </div>

            {/* Create Student Account button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl copper-gradient text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Student Account...</span>
                </>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="pt-4 text-center border-t border-slate-dark/10">
            <p className="text-sm text-slate-dark/70">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-deep hover:text-copper transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
