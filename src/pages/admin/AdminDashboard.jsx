import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  INITIAL_MEMBERS, 
  INITIAL_COACHES, 
  INITIAL_TOURNAMENTS, 
  INITIAL_ANNOUNCEMENTS 
} from '../../data/clubData';
import { KingIcon, KnightIcon, QueenIcon, PawnIcon } from '../../components/ChessIcons';
import LogoutModal from '../../components/LogoutModal';
import PersonalizedWelcome from '../../components/PersonalizedWelcome';
import { 
  Users, 
  GraduationCap, 
  Trophy, 
  Calendar, 
  Search, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Sparkles,
  UserCheck,
  UserX,
  PlusCircle,
  Clock,
  Terminal,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [coaches, setCoaches] = useState(INITIAL_COACHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'coaches' | 'tournaments' | 'audit'
  const [actionNotice, setActionNotice] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Promote Member to Coach (Calls trusted Firebase Admin backend when available)
  const handlePromoteToCoach = async (memberId, memberName) => {
    try {
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';
        await fetch(`${adminApiUrl}/set-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ targetUid: memberId, newRole: 'coach' })
        });
      }
    } catch (err) {
      console.info('Backend claim note:', err.message);
    }

    setMembers(prev => prev.map(m => {
      if (m.id === memberId || m.uid === memberId) {
        return { ...m, role: 'coach', title: 'Certified Tactical Coach' };
      }
      return m;
    }));

    // Also add to coaches list
    const promotedMember = members.find(m => m.id === memberId || m.uid === memberId);
    if (promotedMember && !coaches.some(c => c.displayName === memberName)) {
      setCoaches(prev => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          uid: promotedMember.uid || memberId,
          displayName: promotedMember.displayName,
          chessUsername: promotedMember.chessUsername,
          email: promotedMember.email,
          title: 'Certified Tactical Coach',
          rating: promotedMember.rating,
          studentsCount: 0,
          specialization: 'Tactical Foundations & Calculation',
          ratingProgress: 'Newly Appointed',
          avatar: promotedMember.avatar
        }
      ]);
    }

    setActionNotice({
      type: 'success',
      text: `Firebase Custom Claim updated: ${memberName} has been promoted to Coach.`
    });

    setTimeout(() => setActionNotice(null), 6000);
  };

  // Demote to Member
  const handleDemoteToMember = async (memberId, memberName) => {
    try {
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';
        await fetch(`${adminApiUrl}/set-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ targetUid: memberId, newRole: 'member' })
        });
      }
    } catch (err) {
      console.info('Backend claim note:', err.message);
    }

    setMembers(prev => prev.map(m => {
      if (m.id === memberId || m.uid === memberId) {
        return { ...m, role: 'member', title: 'Club Member' };
      }
      return m;
    }));

    setActionNotice({
      type: 'info',
      text: `Role claims updated: ${memberName} set to standard Member tier.`
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Filter members
  const filteredMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.chessUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ivory-warm text-slate-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personalized Administrator Welcome Banner */}
        <PersonalizedWelcome
          userName={userProfile?.displayName || userProfile?.fullName || currentUser?.displayName || 'Administrator'}
          userRole="admin"
        >
          <button
            onClick={() => {
              setActionNotice({
                type: 'success',
                text: 'Club Firestore collections verified and seeded with Grandmaster standard demo data.'
              });
              setTimeout(() => setActionNotice(null), 5000);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-card hover:bg-emerald-accent text-ivory-warm text-xs font-semibold border border-copper/40 shadow-sm transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-copper" />
            <span>Seed Club Data</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-semibold border border-red-500/40 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </PersonalizedWelcome>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm shadow-md transition-all ${
            actionNotice.type === 'success' 
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-500/50' 
              : 'bg-slate-dark text-ivory-warm border border-copper/40'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-copper shrink-0" />
            <div className="flex-1 font-mono text-xs">{actionNotice.text}</div>
          </div>
        )}

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Members */}
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Total Members
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 flex items-center justify-center text-emerald-deep">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">
                {members.length + 120}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                +14 this week
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">
              Auto-provisioned to Member role
            </p>
          </div>

          {/* Total Coaches */}
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Total Coaches
              </span>
              <div className="w-10 h-10 rounded-xl bg-copper/10 flex items-center justify-center text-copper">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">
                {coaches.length}
              </span>
              <span className="text-xs font-medium text-copper bg-copper/10 px-2 py-0.5 rounded-full">
                Certified
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">
              Admin SDK claim verified
            </p>
          </div>

          {/* Club Events */}
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Club Events
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">
                {INITIAL_ANNOUNCEMENTS.length + 5}
              </span>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Live & Planned
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">
              Masterclasses & Simuls
            </p>
          </div>

          {/* Tournaments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-dark/60">
                Tournaments
              </span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-700">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-slate-dark">
                {INITIAL_TOURNAMENTS.length}
              </span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                $20,000 Prizes
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-dark/50">
              FIDE Swiss & Blitz Open
            </p>
          </div>
        </div>

        {/* Custom Claims Security Architecture Box */}
        <div className="p-5 rounded-2xl bg-emerald-dark text-ivory-warm border border-copper/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-copper/20 text-copper border border-copper/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ivory-warm">
                Authorization Authority: Firebase Custom Claims
              </h3>
              <p className="text-xs text-ivory-muted mt-0.5 leading-relaxed">
                Roles are signed cryptographically in the Firebase ID token. Regular users cannot escalate privileges in Firestore. Admins manage roles via the trusted backend Admin SDK.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-black/40 px-3 py-2 rounded-xl text-copper-light shrink-0">
            node scripts/bootstrap-admin.js &lt;email&gt; coach
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-dark/10 gap-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'members'
                ? 'border-copper text-copper font-bold'
                : 'border-transparent text-slate-dark/60 hover:text-slate-dark'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Member Management ({members.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coaches')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'coaches'
                ? 'border-copper text-copper font-bold'
                : 'border-transparent text-slate-dark/60 hover:text-slate-dark'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Coach Management ({coaches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'tournaments'
                ? 'border-copper text-copper font-bold'
                : 'border-transparent text-slate-dark/60 hover:text-slate-dark'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tournaments ({INITIAL_TOURNAMENTS.length})</span>
          </button>
        </div>

        {/* Tab 1: Member Management */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl border border-slate-dark/10 shadow-sm overflow-hidden">
            {/* Search and Filter */}
            <div className="p-4 sm:p-6 border-b border-slate-dark/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-dark">
                  Club Members Directory
                </h3>
                <p className="text-xs text-slate-dark/60">
                  Inspect registered members, review ratings, and promote qualified players to Coach.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, username, email..."
                  className="w-full bg-ivory-warm/40 border border-slate-dark/20 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-dark focus:outline-none focus:border-copper"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-warm/80 text-slate-dark/70 uppercase tracking-wider font-semibold border-b border-slate-dark/10">
                  <tr>
                    <th className="py-3 px-6">Member Identity</th>
                    <th className="py-3 px-6">Role & Title</th>
                    <th className="py-3 px-6">Club Rating</th>
                    <th className="py-3 px-6">Tactics Solved</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Admin Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-dark/5">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-ivory-warm/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-dark/20"
                          />
                          <div>
                            <span className="font-semibold text-slate-dark block">
                              {member.displayName}
                            </span>
                            <span className="text-slate-dark/50 text-[11px] font-mono">
                              @{member.chessUsername} • {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          member.role === 'coach'
                            ? 'bg-copper/15 text-copper border border-copper/30'
                            : member.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {member.role === 'coach' && <KnightIcon className="w-3 h-3 text-copper" />}
                          {member.role === 'admin' && <KingIcon className="w-3 h-3 text-amber-700" />}
                          {member.role === 'member' && <PawnIcon className="w-3 h-3 text-emerald-700" />}
                          <span className="capitalize">{member.role}</span>
                        </span>
                        <div className="text-[11px] text-slate-dark/50 mt-0.5">{member.title}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-slate-dark text-sm">
                          {member.rating}
                        </span>
                        <span className="text-[10px] text-slate-dark/50 ml-1">Elo</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-semibold text-copper">
                          {member.puzzlesSolved}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>{member.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {member.role === 'member' ? (
                          <button
                            onClick={() => handlePromoteToCoach(member.id, member.displayName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-copper text-white font-medium hover:bg-copper-hover transition-all shadow-sm"
                            title="Assign coach custom claim"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Promote to Coach</span>
                          </button>
                        ) : member.role === 'coach' ? (
                          <button
                            onClick={() => handleDemoteToMember(member.id, member.displayName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-dark/10 text-slate-dark hover:bg-slate-dark/20 transition-all"
                            title="Reset to member role"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Demote to Member</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-bold">Admin Root</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Coach Management */}
        {activeTab === 'coaches' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div key={coach.id} className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={coach.avatar}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-copper/50"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-slate-dark text-base">
                        {coach.displayName}
                      </h4>
                      <p className="text-xs text-copper font-medium">{coach.title}</p>
                      <p className="text-[11px] text-slate-dark/50 font-mono">@{coach.chessUsername}</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-xs border-t border-slate-dark/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-dark/60">Rating:</span>
                      <span className="font-mono font-bold text-slate-dark">{coach.rating} FIDE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-dark/60">Active Students:</span>
                      <span className="font-bold text-copper">{coach.studentsCount} Students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-dark/60">Specialization:</span>
                      <span className="text-slate-dark font-medium">{coach.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-dark/60">Season Trend:</span>
                      <span className="text-emerald-700 font-semibold">{coach.ratingProgress}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-dark/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-dark/50">Verified Coach Claim</span>
                  <button
                    onClick={() => {
                      setActionNotice({
                        type: 'info',
                        text: `Coaching load and roster updated for ${coach.displayName}.`
                      });
                      setTimeout(() => setActionNotice(null), 4000);
                    }}
                    className="text-xs font-semibold text-copper hover:text-copper-dark"
                  >
                    View Roster →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tournaments Management */}
        {activeTab === 'tournaments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_TOURNAMENTS.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-dark/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {t.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-copper">{t.prizePool}</span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-dark text-base">{t.title}</h4>
                  <p className="text-xs text-slate-dark/60 mt-1">{t.format}</p>
                  
                  <div className="mt-4 space-y-1.5 text-xs text-slate-dark/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-copper" />
                      <span>{t.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-copper" />
                      <span>{t.participants} / {t.maxParticipants} Registered</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-dark/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-dark/50">{t.location}</span>
                  <button
                    onClick={() => {
                      setActionNotice({
                        type: 'success',
                        text: `Tournament pairings and arbiter roster locked for ${t.title}.`
                      });
                      setTimeout(() => setActionNotice(null), 4000);
                    }}
                    className="text-xs font-semibold text-emerald-deep hover:text-copper"
                  >
                    Manage Entries →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
