import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KingIcon, KnightIcon, PawnIcon } from './ChessIcons';
import LogoutModal from './LogoutModal';
import { 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, userRole, userProfile, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Grandmaster Admin',
          color: 'bg-amber-900/60 text-amber-300 border-amber-600/50',
          icon: KingIcon
        };
      case 'coach':
        return {
          label: 'Senior Coach',
          color: 'bg-copper/20 text-copper-light border-copper/50',
          icon: KnightIcon
        };
      default:
        return {
          label: 'Club Student',
          color: 'bg-emerald-card text-emerald-200 border-emerald-accent',
          icon: PawnIcon
        };
    }
  };

  const badge = getRoleBadge(userRole);
  const BadgeIcon = badge.icon;

  const roleDashboardUrl = {
    admin: '/admin/dashboard',
    coach: '/coach/dashboard',
    member: '/member/dashboard'
  }[userRole] || '/member/dashboard';

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-deep/95 backdrop-blur-md border-b border-ivory-warm/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to={roleDashboardUrl} className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-dark border border-copper/40 flex items-center justify-center shadow-card group-hover:border-copper transition-all">
              <KingIcon className="w-7 h-7 text-copper transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="block font-display text-lg tracking-widest text-ivory-warm font-bold uppercase">
                Royal Gambit
              </span>
              <span className="block text-[11px] font-sans uppercase tracking-[0.2em] text-copper-light">
                Chess Club & Academy
              </span>
            </div>
          </Link>

          {/* Navigation link matching assigned role */}
          <nav className="hidden md:flex items-center gap-2">
            <span className="text-xs text-ivory-muted tracking-wide flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-copper" />
              <span>Verified Session:</span>
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
          </nav>

          {/* Right: User Profile & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Profile Brief */}
            <div className="flex items-center gap-3 pl-2 border-l border-ivory-warm/10">
              <img
                src={userProfile?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile?.chessUsername || currentUser?.email || 'player'}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-copper/50"
              />
              <div className="text-left">
                <span className="block text-xs font-semibold text-ivory-warm leading-tight">
                  {userProfile?.displayName || userProfile?.fullName || currentUser?.displayName || 'Club Player'}
                </span>
                <span className="block text-[11px] text-ivory-muted font-mono">
                  @{userProfile?.chessUsername || userProfile?.username || currentUser?.email?.split('@')[0] || 'member'}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-surface/60 hover:bg-red-950/60 text-ivory-muted hover:text-red-300 border border-ivory-warm/10 hover:border-red-500/40 text-xs font-semibold transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-ivory-muted hover:text-red-300"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory-warm hover:text-copper"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-emerald-dark border-t border-ivory-warm/10 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-ivory-warm/10">
              <img
                src={userProfile?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile?.chessUsername || currentUser?.email || 'player'}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-copper"
              />
              <div>
                <p className="text-sm font-semibold text-ivory-warm">{userProfile?.displayName || currentUser?.displayName}</p>
                <p className="text-xs text-copper font-mono">{currentUser?.email} • [{userRole}]</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-red-950/70 text-red-200 border border-red-500/40 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Session</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sign Out Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
