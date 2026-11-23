import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  INITIAL_TOURNAMENTS, 
  INITIAL_ANNOUNCEMENTS, 
  RECENT_MATCHES 
} from '../../data/clubData';
import { KingIcon, KnightIcon, BoardIcon, PawnIcon } from '../../components/ChessIcons';
import LogoutModal from '../../components/LogoutModal';
import PersonalizedWelcome from '../../components/PersonalizedWelcome';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ExternalLink,
  Zap,
  Swords,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function MemberDashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [registeredTournaments, setRegisteredTournaments] = useState(['t2']);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notice, setNotice] = useState(null);

  // Tournament registration handler
  const handleRegisterTournament = (tournament) => {
    if (registeredTournaments.includes(tournament.id)) return;

    setRegisteredTournaments(prev => [...prev, tournament.id]);

    // Celebrate with chess confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A65720', '#123B35', '#F6F3EA']
      });
    } catch {
      // safe fallback
    }

    setNotice(`Registered! Your seat in the ${tournament.title} has been confirmed.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="min-h-screen bg-ivory-warm text-slate-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personalized Student Welcome Banner */}
        <PersonalizedWelcome
          userName={userProfile?.displayName || userProfile?.fullName || currentUser?.displayName || 'Champion'}
          userRole="member"
          avatar={userProfile?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile?.chessUsername || 'champion'}`}
          subtitleInfo={userProfile?.chessUsername ? `@${userProfile.chessUsername}` : null}
        >
          <div className="bg-emerald-dark/90 p-4 rounded-2xl border border-copper/40 text-center min-w-[140px] shadow-sm">
            <span className="block text-[11px] uppercase tracking-wider text-ivory-muted font-bold font-sans">
              Club Rapid Rating
            </span>
            <span className="block font-serif text-3xl font-bold text-copper-light mt-1">
              {userProfile?.rating || 1580}
            </span>
            <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5">
              Top 15% of Club
            </span>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-semibold border border-red-500/40 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </PersonalizedWelcome>

        {/* Notice alert */}
        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-900 border border-emerald-500 text-emerald-100 text-xs flex items-center gap-3 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-copper shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 4 Player Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Tactics Streak
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">14</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Days in a row
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Daily puzzle rush completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Blitz Win Rate
              </span>
              <div className="w-10 h-10 rounded-xl bg-copper/10 text-copper flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">64.8%</span>
              <span className="text-xs font-semibold text-emerald-700">+3.2%</span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Last 50 games evaluated</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Tournaments Played
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">8</span>
              <span className="text-xs font-semibold text-indigo-700">Events</span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">2 Podiums / Medals</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Opening Accuracy
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 text-emerald-deep flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">91.4%</span>
              <span className="text-xs font-semibold text-emerald-700">Master Level</span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Ruy Lopez & Sicilian</p>
          </div>
        </div>

        {/* Section 1: Upcoming Tournaments & Registration */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-dark">
                Upcoming Club Tournaments
              </h3>
              <p className="text-xs text-slate-dark/60">
                Compete against fellow members and earn official club rating points.
              </p>
            </div>
            <span className="text-xs font-semibold text-copper">Official FIDE & Club Events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournaments.map((t) => {
              const isRegistered = registeredTournaments.includes(t.id);
              return (
                <div 
                  key={t.id} 
                  className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                    isRegistered 
                      ? 'bg-emerald-50/50 border-emerald-400 shadow-sm' 
                      : 'bg-white border-slate-dark/10 hover:border-copper/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isRegistered ? 'bg-emerald-200 text-emerald-900' : 'bg-copper/15 text-copper'
                      }`}>
                        {isRegistered ? 'Seat Confirmed' : t.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-copper">{t.prizePool}</span>
                    </div>

                    <h4 className="font-serif font-bold text-slate-dark text-lg">{t.title}</h4>
                    <p className="text-xs text-slate-dark/60 mt-1">{t.format}</p>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-dark/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-copper" />
                        <span>{t.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-copper" />
                        <span>{t.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-dark/10">
                    {isRegistered ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>You Are Enrolled</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegisterTournament(t)}
                        className="w-full py-2.5 px-4 rounded-xl copper-gradient text-white font-semibold text-xs shadow-copper-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>Register Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Chess Activities & Club Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Chess Activities */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-slate-dark mb-1">
              Recent Match History
            </h3>
            <p className="text-xs text-slate-dark/60 mb-6">
              Review recent games played on club boards and digital arenas.
            </p>

            <div className="space-y-3">
              {RECENT_MATCHES.map((match) => (
                <div 
                  key={match.id}
                  className="p-4 rounded-xl border border-slate-dark/10 flex items-center justify-between hover:bg-ivory-warm/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      match.result === 'Victory' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : match.result === 'Draw'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {match.result === 'Victory' ? '1-0' : match.result === 'Draw' ? '½-½' : '0-1'}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-dark text-sm">{match.opponent}</h4>
                      <p className="text-xs text-slate-dark/50">
                        {match.opening} • {match.moves} moves
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${
                      match.ratingDelta.startsWith('+') ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {match.ratingDelta} Elo
                    </span>
                    <span className="block text-[11px] text-slate-dark/40">{match.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Club Announcements */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-dark mb-1">
                Club Announcements
              </h3>
              <p className="text-xs text-slate-dark/60 mb-6">
                Official notices from Grandmaster directors and arbiter committees.
              </p>

              <div className="space-y-4">
                {INITIAL_ANNOUNCEMENTS.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl bg-ivory-warm/60 border border-slate-dark/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-copper/15 text-copper">
                        {a.tag}
                      </span>
                      <span className="text-slate-dark/50 font-mono text-[11px]">{a.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-dark text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-dark/70 leading-relaxed">{a.content}</p>
                    <p className="text-[11px] text-copper font-medium pt-1">— {a.author}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-dark/10 text-xs text-slate-dark/50 flex justify-between items-center">
              <span>Have a question for the arbiters?</span>
              <a href="mailto:admin@chessclub.com" className="font-semibold text-emerald-deep hover:text-copper">
                Contact Board →
              </a>
            </div>
          </div>
        </div>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setShowLogoutModal(false);
          await logout();
          navigate('/login', { replace: true });
        }}
      />
    </div>
  );
}
