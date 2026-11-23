import React from 'react';
import { KingIcon, KnightIcon, PawnIcon } from './ChessIcons';
import { Trophy } from 'lucide-react';

/**
 * Reusable Personalized Welcome Banner Component
 * 
 * Props:
 * - userName (string): The logged-in user's display name
 * - userRole (string): 'admin' | 'coach' | 'member' (Student)
 * - avatar (string, optional): User avatar image URL
 * - subtitleInfo (string, optional): Secondary handle or status line
 * - children (ReactNode, optional): Custom action buttons or metric badge for the dashboard
 */
export default function PersonalizedWelcome({ 
  userName, 
  userRole, 
  avatar,
  subtitleInfo,
  children 
}) {
  // Normalize role identifier (member is displayed as Student in UI)
  const normalizedRole = (userRole || 'member').toLowerCase();

  // Role-specific configuration based on requirements
  const roleConfig = {
    admin: {
      title: "Welcome, Administrator!",
      subtitle: "Manage your club, oversee members, and lead the next generation of chess champions.",
      badge: "Executive Club Administrator",
      badgeIcon: KingIcon,
      icon: KingIcon,
      watermarkIcon: KingIcon
    },
    coach: {
      title: "Welcome, Coach!",
      subtitle: "Inspire future champions, manage training sessions, and guide your students to victory.",
      badge: "Certified Chess Coach",
      badgeIcon: KnightIcon,
      icon: KnightIcon,
      watermarkIcon: KnightIcon
    },
    member: {
      title: "Welcome, Champion!",
      subtitle: "Your next great move starts here. Explore your training, tournaments, and chess achievements.",
      badge: "Student Member",
      badgeIcon: Trophy,
      icon: PawnIcon,
      watermarkIcon: PawnIcon
    }
  };

  const config = roleConfig[normalizedRole] || roleConfig.member;
  const RoleIcon = config.icon;
  const WatermarkIcon = config.watermarkIcon;
  const BadgeIcon = config.badgeIcon;

  // Clean fallback for display name
  const displayName = userName && userName.trim() ? userName.trim() : 'Valued Member';

  return (
    <div className="relative rounded-3xl bg-emerald-deep bg-chess-pattern p-6 sm:p-10 text-ivory-warm overflow-hidden shadow-card border border-copper/30 transition-all duration-300 hover:border-copper/50 animate-fadeIn">
      {/* Decorative Chess Watermark in Background */}
      <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none transition-transform duration-700 hover:scale-105">
        <WatermarkIcon className="w-80 h-80 sm:w-96 sm:h-96 text-copper" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Welcome Messages & User Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-3xl">
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-copper/60 shadow-md shrink-0"
            />
          )}

          <div>
            {/* Role Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 shadow-sm backdrop-blur-sm transition-all"
                 style={{ backgroundColor: 'rgba(18, 59, 53, 0.85)', borderColor: 'rgba(166, 87, 32, 0.4)' }}>
              <BadgeIcon className="w-3.5 h-3.5 text-copper-light" />
              <span className="tracking-wider uppercase text-[11px] font-sans text-copper-light">
                {config.badge}
              </span>
            </div>

            {/* Personalized Greeting Required by Specification */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ivory-warm tracking-tight leading-tight">
              {config.title}
            </h1>

            {/* User Display Name */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-ivory-muted font-sans">
                Logged in as:
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-dark/90 border border-copper/40 text-xs sm:text-sm font-semibold text-copper-light shadow-sm">
                <RoleIcon className="w-3.5 h-3.5 text-copper-light shrink-0" />
                <span className="font-sans font-bold text-white tracking-wide">{displayName}</span>
              </span>
              {subtitleInfo && (
                <span className="text-xs text-copper-light font-mono ml-1">
                  {subtitleInfo}
                </span>
              )}
            </div>

            {/* Subtitle Required by Specification */}
            <p className="mt-3 text-sm sm:text-base text-ivory-soft leading-relaxed font-sans max-w-2xl">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons / Metrics Slot */}
        {children && (
          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-ivory-warm/10">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
