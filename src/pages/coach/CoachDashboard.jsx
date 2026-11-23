import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_MEMBERS,
  INITIAL_TRAINING_SESSIONS,
  INITIAL_ANNOUNCEMENTS
} from '../../data/clubData';
import { KnightIcon, KingIcon, QueenIcon, BishopIcon } from '../../components/ChessIcons';
import LogoutModal from '../../components/LogoutModal';
import PersonalizedWelcome from '../../components/PersonalizedWelcome';
import {
  Users,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Plus,
  FileText,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function CoachDashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(INITIAL_TRAINING_SESSIONS);
  const [students] = useState(INITIAL_MEMBERS);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleCompleteSession = (id) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Completed' };
      }
      return s;
    }));
    setNotice('Session marked as completed. Training logs synchronized to player profile.');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-ivory-warm text-slate-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personalized Coach Welcome Banner */}
        <PersonalizedWelcome
          userName={userProfile?.displayName || userProfile?.fullName || currentUser?.displayName || 'Coach'}
          userRole="coach"
        >
          <button
            onClick={() => {
              setNotice('New tactical training session draft created.');
              setTimeout(() => setNotice(null), 3000);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl copper-gradient text-white text-xs font-semibold shadow-copper-glow hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-semibold border border-red-500/40 transition-all cursor-pointer"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                My Students
              </span>
              <div className="w-10 h-10 rounded-xl bg-copper/10 text-copper flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">{students.length}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Tactical mentoring track</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Training Sessions
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 text-emerald-deep flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">{sessions.length}</span>
              <span className="text-xs font-semibold text-copper bg-copper/15 px-2 py-0.5 rounded-full">
                This Week
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Endgames & openings</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Avg Rating Gain
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">+94</span>
              <span className="text-xs font-semibold text-emerald-700">Elo points</span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">Across enrolled roster</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Puzzles Assigned
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">3,770</span>
              <span className="text-xs font-semibold text-indigo-700">Tactics</span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">84% accuracy rate</p>
          </div>
        </div>

        {/* Section 1: Training Sessions Queue */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-dark">
                Training Sessions & Masterclasses
              </h3>
              <p className="text-xs text-slate-dark/60">
                Real-time schedule of tactical lessons, opening prep, and tournament review sessions.
              </p>
            </div>
            <span className="text-xs font-semibold text-copper bg-copper/10 px-3 py-1 rounded-full">
              {sessions.filter(s => s.status !== 'Completed').length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${s.status === 'Completed'
                    ? 'bg-ivory-warm/40 border-slate-dark/10 opacity-75'
                    : 'bg-white border-copper/30 shadow-sm hover:border-copper'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-mono text-copper flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {s.scheduledTime}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.status === 'Completed'
                        ? 'bg-slate-dark/10 text-slate-dark'
                        : 'bg-emerald-100 text-emerald-800'
                      }`}>
                      {s.status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-slate-dark text-base">
                    {s.topic}
                  </h4>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-dark/70">
                    <div className="w-6 h-6 rounded-full bg-emerald-deep text-white text-[10px] flex items-center justify-center font-bold">
                      {s.studentName.charAt(0)}
                    </div>
                    <span>Student: <strong className="text-slate-dark">{s.studentName}</strong></span>
                  </div>

                  <p className="mt-3 text-xs text-slate-dark/60 bg-ivory-warm/80 p-3 rounded-xl border border-slate-dark/5 italic">
                    "{s.drillNotes}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-dark/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-dark/50">{s.duration}</span>
                  {s.status !== 'Completed' ? (
                    <button
                      onClick={() => handleCompleteSession(s.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: My Students Roster & Progress Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students Roster (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-slate-dark mb-1">
              Assigned Students Roster
            </h3>
            <p className="text-xs text-slate-dark/60 mb-6">
              Track student Elo progression, puzzle streaks, and individual game records.
            </p>

            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-xl border border-slate-dark/10 hover:border-copper/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={student.avatar}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-copper/30"
                    />
                    <div>
                      <h4 className="font-bold text-slate-dark text-sm">{student.displayName}</h4>
                      <p className="text-xs text-slate-dark/50 font-mono">@{student.chessUsername}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                        {student.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <div className="text-slate-dark/50">Club Rating</div>
                      <div className="font-mono font-bold text-slate-dark text-sm">{student.rating} Elo</div>
                    </div>
                    <div>
                      <div className="text-slate-dark/50">Puzzles Done</div>
                      <div className="font-mono font-bold text-copper text-sm">{student.puzzlesSolved}</div>
                    </div>
                    <button
                      onClick={() => {
                        setNotice(`Analysis notebook opened for ${student.displayName}.`);
                        setTimeout(() => setNotice(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-deep text-white text-xs font-semibold hover:bg-emerald-card transition-all"
                    >
                      Game Analysis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player Progress Metrics (1 col) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-dark/10 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-dark mb-1">
                Curriculum Mastery
              </h3>
              <p className="text-xs text-slate-dark/60 mb-6">
                Cohort win rates by strategic opening theme.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Sicilian Defense (Najdorf / Dragon)</span>
                    <span className="text-emerald-700">72% Win Rate</span>
                  </div>
                  <div className="w-full bg-slate-dark/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Ruy Lopez (Closed Berlin Defense)</span>
                    <span className="text-copper">65% Win Rate</span>
                  </div>
                  <div className="w-full bg-slate-dark/10 h-2 rounded-full overflow-hidden">
                    <div className="copper-gradient h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>King's Indian Defense</span>
                    <span className="text-amber-700">58% Win Rate</span>
                  </div>
                  <div className="w-full bg-slate-dark/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Rook Endgames (Lucena & Philidor)</span>
                    <span className="text-emerald-700">84% Solved</span>
                  </div>
                  <div className="w-full bg-slate-dark/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-ivory-warm border border-copper/30">
              <div className="flex items-center gap-2 text-xs font-bold text-copper mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Coach Recommendation</span>
              </div>
              <p className="text-xs text-slate-dark/70 leading-relaxed">
                Assign 30 min of pawn structure calculation before next Thursday's rapid tournament.
              </p>
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
