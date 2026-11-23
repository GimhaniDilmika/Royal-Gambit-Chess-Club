import React from 'react';

export function KingIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M10 4h4" />
      <path d="M5 20h14" />
      <path d="M6 16h12l1-7-3.5 2L12 6 8.5 11 5 9z" />
      <path d="M7 16l-1 4" />
      <path d="M17 16l1 4" />
    </svg>
  );
}

export function KnightIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20h14" />
      <path d="M6 20c0-4 2-7 4-8.5C9 10 8.5 8 9 6c.5-2 2-3 4-3 1.5 0 3 1 3 3 0 1-.5 2-1 3 2 1.5 4 4.5 4 8.5" />
      <path d="M9 11l3-1 2 2" />
      <circle cx="11.5" cy="7.5" r="1" fill={color} />
    </svg>
  );
}

export function QueenIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20h14" />
      <path d="M6 16h12" />
      <path d="M4 8l3 8h10l3-8-4 4-4-7-4 7z" />
      <circle cx="4" cy="7" r="1" fill={color} />
      <circle cx="20" cy="7" r="1" fill={color} />
      <circle cx="12" cy="4" r="1" fill={color} />
      <circle cx="8" cy="11" r="1" fill={color} />
      <circle cx="16" cy="11" r="1" fill={color} />
    </svg>
  );
}

export function RookIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20h14" />
      <path d="M6 17h12" />
      <path d="M7 17v-7h10v7" />
      <path d="M6 10h12V5h-2v2h-2V5h-4v2H8V5H6z" />
    </svg>
  );
}

export function BishopIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20h14" />
      <path d="M7 17h10" />
      <path d="M12 4v2" />
      <path d="M11 5h2" />
      <path d="M8 17c0-4 1.5-6.5 4-10.5 2.5 4 4 6.5 4 10.5" />
      <path d="M10 11l4 2" />
    </svg>
  );
}

export function PawnIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20h12" />
      <path d="M8 17h8" />
      <path d="M9 17c0-3 1-4.5 2-6.5" />
      <path d="M15 17c0-3-1-4.5-2-6.5" />
      <circle cx="12" cy="7" r="3" />
    </svg>
  );
}

export function BoardIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}
