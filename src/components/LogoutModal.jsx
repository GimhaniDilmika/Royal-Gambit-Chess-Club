import React from 'react';
import { KingIcon } from './ChessIcons';
import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-copper/30 shadow-2xl text-ivory-warm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ivory-muted hover:text-white rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chess Piece Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-card border border-copper/50 flex items-center justify-center mx-auto mb-4 shadow-copper-glow">
          <KingIcon className="w-8 h-8 text-copper" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-serif font-bold text-ivory-warm">
            Conclude Active Session?
          </h3>
          <p className="mt-2 text-sm text-ivory-muted leading-relaxed">
            Are you sure you want to sign out of Royal Gambit Chess Club? Your board positions and account state are securely saved.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-surface/80 hover:bg-slate-surface text-ivory-warm text-sm font-medium border border-ivory-warm/10 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl copper-gradient text-white text-sm font-semibold shadow-copper-glow hover:opacity-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
