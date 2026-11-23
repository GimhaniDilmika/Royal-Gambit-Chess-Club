import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KingIcon, KnightIcon, BoardIcon } from '../components/ChessIcons';
import ForgotPasswordModal from './ForgotPasswordModal';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Shield,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const { login, logout, currentUser, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Role Selection State: 'admin' | 'coach' | 'student'
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mismatchRole, setMismatchRole] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Map user-facing selection to internal claim identifier
  const roleClaimMap = {
    admin: 'admin',
    coach: 'coach',
    student: 'member'
  };

  const roleMeta = {
    admin: {
      id: 'admin',
      label: 'Admin',
      fullTitle: 'Administrator Login',
      subtitle: 'Access executive club controls, audit logs, and member oversight.',
      icon: Shield,
      placeholder: 'admin1@gmail.lk'
    },
    coach: {
      id: 'coach',
      label: 'Coach',
      fullTitle: 'Coach Login',
      subtitle: 'Manage tournament pairings, training sessions, and student rosters.',
      icon: GraduationCap,
      placeholder: 'coach1@gmail.lk'
    },
    student: {
      id: 'student',
      label: 'Student',
      fullTitle: 'Student Login',
      subtitle: 'Enter the player lounge, review tactics, and view club events.',
      icon: KnightIcon,
      placeholder: 'student1@gmail.lk'
    }
  };

  // Automatically redirect already authenticated users on initial page load
  useEffect(() => {
    if (!authLoading && currentUser && userRole && !isSubmitting) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'coach') {
        navigate('/coach/dashboard', { replace: true });
      } else {
        navigate('/member/dashboard', { replace: true });
      }
    }
  }, [currentUser, userRole, authLoading, navigate, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      setMismatchRole(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      setMismatchRole(null);
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    setErrorMessage('');
    setMismatchRole(null);

    try {
      // 1. Authenticate with Firebase Authentication
      const { role: verifiedRole } = await login(email.trim(), password, rememberMe);
      
      const expectedClaim = roleClaimMap[selectedRole];

      // 2. Validate verified role claim against the selected login role
      if (verifiedRole !== expectedClaim) {
        // Disallow access to the selected dashboard and safely terminate the session
        await logout();
        setIsSubmitting(false);

        const actualRoleName = verifiedRole === 'member' ? 'Student' : (verifiedRole === 'admin' ? 'Administrator' : 'Coach');
        const selectedRoleName = roleMeta[selectedRole].label;
        const targetSelectionId = verifiedRole === 'member' ? 'student' : verifiedRole;

        setMismatchRole(targetSelectionId);
        setErrorMessage(
          `Role Mismatch: This account is verified as "${actualRoleName}", but you selected "${selectedRoleName} Login". Access to ${selectedRoleName} privileges was blocked. Please select the "${actualRoleName}" card above.`
        );
        return;
      }

      // 3. Roles match! Redirect to the verified dashboard
      if (verifiedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (verifiedRole === 'coach') {
        navigate('/coach/dashboard', { replace: true });
      } else {
        navigate('/member/dashboard', { replace: true });
      }
    } catch (err) {
      setIsSubmitting(false);
      let friendlyError = 'Authentication failed. Please verify your credentials.';
      
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
        friendlyError = 'Invalid email address or password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyError = 'Access temporarily restricted due to multiple failed login attempts. Please reset your password or try again later.';
      } else if (err.code === 'auth/user-disabled') {
        friendlyError = 'This chess club account has been suspended by an administrator.';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyError = 'Network connection error: Unable to reach Firebase Authentication servers. Check your internet connection.';
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        friendlyError = 'Invalid Firebase API Key. Please verify your configuration in .env.';
      } else if (err.message) {
        friendlyError = err.message;
      }

      setErrorMessage(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const currentRoleConfig = roleMeta[selectedRole];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-ivory-warm">
      {/* ================= LEFT SIDE: Chess Hero & Brand Identity ================= */}
      <div className="relative w-full lg:w-1/2 min-h-[440px] lg:min-h-screen bg-emerald-deep flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden text-ivory-warm">
        {/* Realistic King & Knight Chess Photography */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-30 scale-100 transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1920&q=85')`
          }}
        />
        
        {/* Multi-layered Deep Emerald Overlay for rich contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-deep/95 to-emerald-deep/85" />
        <div className="absolute inset-0 bg-chess-pattern opacity-25 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-dark/95 border border-copper/50 flex items-center justify-center shadow-lg">
            <KingIcon className="w-8 h-8 text-copper-light" />
          </div>
          <div>
            <span className="block font-display text-xl sm:text-2xl tracking-[0.18em] font-bold text-ivory-warm">
              ROYAL GAMBIT
            </span>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-copper-light font-semibold">
              Chess Club & Academy
            </span>
          </div>
        </div>

        {/* Center Content: Where Champions Begin */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-dark/80 border border-copper/40 text-copper-light text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-copper-light" />
            <span>Grandmaster Standard Authentication</span>
          </div>

          {/* Large Visible Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-ivory-warm leading-[1.12] tracking-tight">
            Where Champions <br />
            <span className="text-copper-accent italic">
              Begin
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg sm:text-xl text-ivory-soft font-sans font-medium tracking-wide">
            Master Your Moves. Shape Your Legacy.
          </p>

          <p className="mt-5 text-sm sm:text-base text-ivory-muted/90 leading-relaxed font-sans max-w-lg">
            Step onto the 64 squares alongside international grandmasters, certified coaches, and dedicated students. One unified portal for training, tournament competition, and tactical progression.
          </p>

          {/* Chess Club Highlights */}
          <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-ivory-warm/15">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-copper-light">2,400+</div>
              <div className="text-xs text-ivory-muted mt-0.5">Peak FIDE Rating</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-copper-light">50+</div>
              <div className="text-xs text-ivory-muted mt-0.5">Annual Tournaments</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-copper-light">100%</div>
              <div className="text-xs text-ivory-muted mt-0.5">Role-Verified Access</div>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 hidden sm:flex items-center justify-between pt-4 border-t border-ivory-warm/10 text-xs text-ivory-muted/80">
          <span>
            <em className="font-serif text-ivory-soft">"Chess is the gymnasium of the mind."</em> — Blaise Pascal
          </span>
          <span className="text-[11px] text-copper-light/80 font-mono">FIDE Standard 2026</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Sign In Form ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-deep/10 text-emerald-deep border border-emerald-deep/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-copper" />
              <span>Verified Role Portal</span>
            </div>
            
            {/* Dynamic Role-Based Heading */}
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-dark tracking-tight transition-all">
              {currentRoleConfig.fullTitle}
            </h2>
            
            {/* Dynamic Role Subtitle */}
            <p className="mt-1.5 text-sm text-slate-dark/70 leading-relaxed">
              {currentRoleConfig.subtitle}
            </p>
          </div>

          {/* ================= ROLE SELECTION CARDS ================= */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-dark/70">
                Select Your Role
              </span>
              <span className="text-[10px] text-copper font-medium">
                Verified claims required
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {Object.values(roleMeta).map((role) => {
                const isSelected = selectedRole === role.id;
                const RoleIcon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setErrorMessage('');
                      setMismatchRole(null);
                    }}
                    className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-center ${
                      isSelected
                        ? 'bg-emerald-deep text-ivory-warm border-copper shadow-md ring-2 ring-copper/50 scale-[1.02]'
                        : 'bg-white hover:bg-ivory-soft/60 text-slate-dark/80 hover:text-slate-dark border-slate-dark/15 hover:border-copper/40 shadow-xs'
                    }`}
                  >
                    {/* Copper Active Indicator */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-copper rounded-full border-2 border-white shadow-xs" />
                    )}

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all mb-2 ${
                      isSelected 
                        ? 'bg-emerald-dark/90 border border-copper/60 text-copper-light shadow-inner' 
                        : 'bg-ivory-warm text-slate-dark/70 group-hover:text-copper group-hover:bg-copper/10'
                    }`}>
                      <RoleIcon className="w-5 h-5 shrink-0" />
                    </div>

                    <span className={`text-xs font-bold tracking-wide transition-colors ${
                      isSelected ? 'text-ivory-warm' : 'text-slate-dark group-hover:text-copper'
                    }`}>
                      {role.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Mismatch Alert or Standard Error */}
          {errorMessage && (
            <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 shadow-xs animate-fadeIn ${
              mismatchRole 
                ? 'bg-amber-50/90 border-amber-300 text-amber-900' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                mismatchRole ? 'text-amber-600' : 'text-red-500'
              }`} />
              <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                <div>{errorMessage}</div>
                {mismatchRole && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole(mismatchRole);
                      setErrorMessage('');
                      setMismatchRole(null);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900 text-ivory-warm text-xs font-semibold hover:bg-amber-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Switch to {roleMeta[mismatchRole].label} Login & Retry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                {currentRoleConfig.label} Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`e.g. ${currentRoleConfig.placeholder}`}
                  className="w-full bg-white border border-slate-dark/20 rounded-xl pl-11 pr-4 py-3 text-slate-dark placeholder-slate-dark/40 text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-dark/20 rounded-xl pl-11 pr-11 py-3 text-slate-dark placeholder-slate-dark/40 text-sm focus:outline-none focus:border-copper focus:ring-2 focus:ring-copper/20 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-dark/50 hover:text-slate-dark cursor-pointer p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-dark/80 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-copper focus:ring-copper accent-copper cursor-pointer"
                />
                <span className="font-medium">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-semibold text-copper hover:text-copper-dark transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl copper-gradient text-white font-semibold text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying {currentRoleConfig.label} Role...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {currentRoleConfig.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="pt-4 text-center border-t border-slate-dark/10">
            <p className="text-sm text-slate-dark/70">
              New to the club?{' '}
              <Link
                to="/register"
                className="font-bold text-emerald-deep hover:text-copper transition-colors"
              >
                Create Student Account
              </Link>
            </p>
            <p className="text-[11px] text-slate-dark/50 mt-1">
              Admin & Coach credentials are restricted and provisioned by club officials.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}
