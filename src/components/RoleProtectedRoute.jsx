import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KnightIcon, KingIcon } from './ChessIcons';
import { ShieldAlert, ArrowRight, LogOut } from 'lucide-react';

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { currentUser, userRole, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-deep bg-chess-pattern flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-full bg-emerald-card border border-copper/40 flex items-center justify-center shadow-copper-glow animate-pulse">
          <KnightIcon className="w-10 h-10 text-copper animate-bounce" />
        </div>
        <h2 className="mt-6 text-xl font-display tracking-widest text-ivory-warm">
          CHECKING PRIVILEGES
        </h2>
        <p className="mt-2 text-sm text-ivory-muted tracking-wide">
          Verifying Firebase role claims...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, show modern Access Denied view
  if (!allowedRoles.includes(userRole)) {
    const roleDashboardMap = {
      admin: '/admin/dashboard',
      coach: '/coach/dashboard',
      member: '/member/dashboard'
    };

    const targetDashboard = roleDashboardMap[userRole] || '/member/dashboard';

    return (
      <div className="min-h-screen bg-slate-deep bg-chess-pattern flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-2xl p-8 border border-red-500/30 text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-900/50 text-red-300 border border-red-700/50">
            Authorization Failed (HTTP 403)
          </span>

          <h2 className="mt-4 text-2xl font-serif text-ivory-warm">
            Illegal Move: Access Restricted
          </h2>

          <p className="mt-3 text-sm text-ivory-muted leading-relaxed">
            Your current assigned role is <span className="font-semibold text-copper uppercase">[{userRole === 'member' ? 'Student' : (userRole || 'unassigned')}]</span>. 
            This area requires one of the following privilege levels: <span className="text-ivory-warm font-medium uppercase">[{allowedRoles.map(r => r === 'member' ? 'Student' : r).join(', ')}]</span>.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-dark/50 border border-ivory-warm/10 text-left text-xs text-ivory-muted space-y-1">
            <div className="flex justify-between">
              <span>Account:</span>
              <span className="text-ivory-warm font-mono">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Authority:</span>
              <span className="text-copper font-mono">Firebase Custom Claims</span>
            </div>
            <div className="flex justify-between">
              <span>Assigned Role:</span>
              <span className="text-emerald-400 font-mono capitalize">{userRole === 'member' ? 'Student (member)' : userRole}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to={targetDashboard}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl copper-gradient text-white font-semibold text-sm shadow-copper-glow hover:opacity-95 transition-all"
            >
              <span>Return to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-dark/70 text-ivory-muted hover:text-white border border-ivory-warm/10 text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
