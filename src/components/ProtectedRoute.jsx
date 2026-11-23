import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KnightIcon } from './ChessIcons';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-deep bg-chess-pattern flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-card border border-copper/40 flex items-center justify-center shadow-copper-glow animate-pulse">
            <KnightIcon className="w-10 h-10 text-copper animate-bounce" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-display tracking-widest text-ivory-warm">
          AUTHENTICATING
        </h2>
        <p className="mt-2 text-sm text-ivory-muted tracking-wide font-sans">
          Verifying security tokens on the 64 squares...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
