import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { KnightIcon } from '../components/ChessIcons';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ loading: true, success: null, error: null });
    try {
      await resetPassword(email.trim());
      setStatus({
        loading: false,
        success: 'Password reset link dispatched. Please check your inbox and spam folder.',
        error: null
      });
      setEmail('');
    } catch (err) {
      let msg = 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No chess club account registered with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        msg = 'Invalid Firebase API Key. Please verify your .env file credentials from Firebase Console.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network error: Unable to reach Firebase Authentication servers.';
      } else if (err.message) {
        msg = err.message;
      }
      setStatus({ loading: false, success: null, error: msg });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-copper/30 shadow-2xl text-ivory-warm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ivory-muted hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-emerald-card border border-copper/40 flex items-center justify-center mx-auto mb-3">
          <KnightIcon className="w-6 h-6 text-copper" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-serif font-bold text-ivory-warm">
            Reset Chess Club Password
          </h3>
          <p className="mt-1 text-xs text-ivory-muted">
            Enter your registered email and we will send you a recovery link to reset your credentials.
          </p>
        </div>

        {status.success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{status.success}</span>
          </div>
        )}

        {status.error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ivory-muted mb-1.5 uppercase tracking-wider">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ivory-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grandmaster@chessclub.com"
                className="w-full bg-slate-deep/80 border border-ivory-warm/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ivory-warm placeholder-ivory-muted/40 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-surface/80 hover:bg-slate-surface text-ivory-warm text-sm font-medium border border-ivory-warm/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl copper-gradient text-white text-sm font-semibold shadow-copper-glow hover:opacity-95 disabled:opacity-50"
            >
              {status.loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <span>Send Link</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
