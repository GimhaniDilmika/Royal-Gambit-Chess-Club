/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: '#123B35',
          dark: '#0C2723',
          card: '#184740',
          accent: '#1D5A50',
          glow: '#1F6B5F',
        },
        ivory: {
          warm: '#F6F3EA',
          soft: '#EAE5D6',
          muted: '#D8D1BE',
        },
        copper: {
          DEFAULT: '#A65720',
          hover: '#BD6424',
          dark: '#854215',
          light: '#C9773B',
          glow: 'rgba(166, 87, 32, 0.25)',
        },
        slate: {
          dark: '#283B42',
          deep: '#1B272C',
          surface: '#334952',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'chess-radial': 'radial-gradient(circle at 50% 0%, rgba(166, 87, 32, 0.18) 0%, transparent 70%)',
        'emerald-gradient': 'linear-gradient(135deg, #123B35 0%, #0C2723 100%)',
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
        'copper-glow': '0 0 25px rgba(166, 87, 32, 0.35)',
        'emerald-glow': '0 0 30px rgba(18, 59, 53, 0.4)',
      }
    },
  },
  plugins: [],
}
