export const INITIAL_MEMBERS = [
  {
    id: 'm1',
    uid: 'demo-member-01',
    displayName: 'Levon Aronian',
    chessUsername: 'levon_tactics',
    email: 'levon@chessclub.com',
    role: 'member',
    rating: 1840,
    title: 'Candidate Master (CM)',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    joined: 'Jan 2024',
    assignedCoach: 'Alexandra Botez',
    puzzlesSolved: 420
  },
  {
    id: 'm2',
    uid: 'demo-member-02',
    displayName: 'Hikaru Nakamura Jr.',
    chessUsername: 'speedy_hikaru',
    email: 'hikaru.jr@chessclub.com',
    role: 'member',
    rating: 2010,
    title: 'Expert',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    joined: 'Feb 2024',
    assignedCoach: 'Alexandra Botez',
    puzzlesSolved: 890
  },
  {
    id: 'm3',
    uid: 'demo-member-03',
    displayName: 'Anna Rudolf',
    chessUsername: 'miss_rudolf',
    email: 'anna.rudolf@chessclub.com',
    role: 'member',
    rating: 1650,
    title: 'Club Member',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    joined: 'Mar 2024',
    assignedCoach: 'Magnus Carlsen',
    puzzlesSolved: 310
  },
  {
    id: 'm4',
    uid: 'demo-member-04',
    displayName: 'Hans Niemann',
    chessUsername: 'hans_speaks',
    email: 'hans@chessclub.com',
    role: 'member',
    rating: 2320,
    title: 'FIDE Master (FM)',
    status: 'Pending Review',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    joined: 'Apr 2024',
    assignedCoach: 'Unassigned',
    puzzlesSolved: 1200
  },
  {
    id: 'm5',
    uid: 'demo-member-05',
    displayName: 'Beth Harmon',
    chessUsername: 'queens_gambit_beth',
    email: 'beth.harmon@chessclub.com',
    role: 'member',
    rating: 2190,
    title: 'Senior Competitor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    joined: 'May 2024',
    assignedCoach: 'Magnus Carlsen',
    puzzlesSolved: 950
  }
];

export const INITIAL_COACHES = [
  {
    id: 'c1',
    uid: 'demo-coach-01',
    displayName: 'Alexandra Botez',
    chessUsername: 'coach_alexandra',
    email: 'coach@chessclub.com',
    title: 'Woman FIDE Master (WFM)',
    rating: 2040,
    studentsCount: 14,
    specialization: 'Tactical Calculation & Speed Chess',
    ratingProgress: '+85 Elo this season',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'c2',
    uid: 'demo-coach-02',
    displayName: 'Magnus Carlsen',
    chessUsername: 'magnus_grandmaster',
    email: 'magnus.c@chessclub.com',
    title: 'Grandmaster (GM) & World Champion',
    rating: 2882,
    studentsCount: 6,
    specialization: 'Endgame Mastery & Intuitive Play',
    ratingProgress: '+12 Elo this season',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'c3',
    uid: 'demo-coach-03',
    displayName: 'Viswanathan Anand',
    chessUsername: 'lightning_vishy',
    email: 'vishy.a@chessclub.com',
    title: 'Grandmaster (GM)',
    rating: 2750,
    studentsCount: 8,
    specialization: 'Opening Repertoire & Classical Theory',
    ratingProgress: '+24 Elo this season',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_TOURNAMENTS = [
  {
    id: 't1',
    title: 'Royal Gambit Winter Open 2026',
    format: 'Swiss System • 9 Rounds (90m + 30s)',
    prizePool: '$15,000 USD',
    date: 'Dec 12 - 16, 2026',
    participants: 78,
    maxParticipants: 100,
    status: 'Registration Open',
    fideRated: true,
    location: 'Main Grand Hall & Hybrid Online'
  },
  {
    id: 't2',
    title: 'Crown Blitz Championship',
    format: 'Round Robin • 3m + 2s Fischer Increment',
    prizePool: '$5,000 USD',
    date: 'Dec 05, 2026',
    participants: 45,
    maxParticipants: 64,
    status: 'Registration Open',
    fideRated: true,
    location: 'Arena Room B'
  },
  {
    id: 't3',
    title: 'Junior Cadets Invitational',
    format: 'Swiss • 5 Rounds (60m Rapid)',
    prizePool: 'Trophies & Master Mentorship',
    date: 'Jan 10, 2027',
    participants: 32,
    maxParticipants: 40,
    status: 'Upcoming',
    fideRated: false,
    location: 'Academy Lounge'
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'a1',
    title: 'Exclusive GM Masterclass: Modern Sicilian Defense',
    author: 'Viktor Korchnoi (Club Director)',
    date: 'Nov 24, 2026',
    tag: 'Masterclass',
    content: 'Grandmaster Viktor Korchnoi will host an intensive 3-hour masterclass breaking down the latest theoretical novelties in the Sicilian Najdorf and Dragon variations. Open to all active members.'
  },
  {
    id: 'a2',
    title: 'FIDE Rated Winter Open Registrations Now Live',
    author: 'Tournament Committee',
    date: 'Nov 20, 2026',
    tag: 'Tournament',
    content: 'Registration for the prestigious Royal Gambit Winter Open is now open. Early registration bonuses include free entry into the Blitz Warmup event.'
  },
  {
    id: 'a3',
    title: 'New High-Precision DGT Chess Clocks Installed in Club Hall',
    author: 'Administration',
    date: 'Nov 18, 2026',
    tag: 'Facility Update',
    content: 'All physical boards have been upgraded with digital broadcast DGT boards connected to our live commentary screens for Thursday evening sparring sessions.'
  }
];

export const INITIAL_TRAINING_SESSIONS = [
  {
    id: 's1',
    studentName: 'Levon Aronian',
    studentUsername: 'levon_tactics',
    topic: 'Rook & Pawn Endgames: The Lucena & Philidor Positions',
    scheduledTime: 'Tomorrow, 4:00 PM EST',
    duration: '60 minutes',
    status: 'Scheduled',
    drillNotes: 'Focus on cutting off the enemy king along the 4th rank and building the bridge.'
  },
  {
    id: 's2',
    studentName: 'Beth Harmon',
    studentUsername: 'queens_gambit_beth',
    topic: 'Queen\'s Gambit Accepted: Modern Classical Lines',
    scheduledTime: 'Thursday, 6:00 PM EST',
    duration: '90 minutes',
    status: 'Confirmed',
    drillNotes: 'Analyze Karpov vs Kasparov 1985 Game 16; evaluate isolated queen pawn dynamics.'
  },
  {
    id: 's3',
    studentName: 'Hikaru Nakamura Jr.',
    studentUsername: 'speedy_hikaru',
    topic: 'Tactical Pattern Recognition: Greek Gift Sacrifice (Bxh7+)',
    scheduledTime: 'Friday, 3:30 PM EST',
    duration: '45 minutes',
    status: 'Pending Prep',
    drillNotes: 'Review 20 tactical puzzles with king hunt motifs in open center games.'
  }
];

export const RECENT_MATCHES = [
  {
    id: 'm-101',
    opponent: 'GM Fabiano Caruana (Bot)',
    result: 'Victory',
    color: 'White',
    opening: 'Ruy Lopez, Closed Berlin',
    moves: 42,
    ratingDelta: '+14',
    date: 'Yesterday'
  },
  {
    id: 'm-102',
    opponent: 'WGM Judit Polgar (Bot)',
    result: 'Draw',
    color: 'Black',
    opening: 'Sicilian Defense, Scheveningen',
    moves: 58,
    ratingDelta: '+2',
    date: '3 days ago'
  },
  {
    id: 'm-103',
    opponent: 'IM Eric Rosen (Club Member)',
    result: 'Defeat',
    color: 'White',
    opening: 'Stafford Gambit Declined',
    moves: 31,
    ratingDelta: '-11',
    date: '5 days ago'
  }
];
