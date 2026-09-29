/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111613',        // Primary background — Deep Charcoal Green
        surface: '#1B2420',    // Secondary / card background — Muted Dark Green-Gray
        accent: {
          DEFAULT: '#4E9F3D',  // Highlight — Vibrant Office Green
          soft: '#6FBF5C',
          deep: '#2F6B24',
        },
        sage: '#A3C1AD',       // Text secondary / borders — Soft Sage Gray
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(78,159,61,0.35), 0 0 40px -8px rgba(78,159,61,0.45)',
        'glow-lg': '0 0 0 1px rgba(78,159,61,0.45), 0 0 90px -10px rgba(78,159,61,0.6)',
        card: '0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'accent-sheen':
          'linear-gradient(110deg, transparent 25%, rgba(163,193,173,0.35) 45%, rgba(78,159,61,0.55) 55%, transparent 75%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        sheen: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'spin-med': 'spin-slow 14s linear infinite',
        'spin-slower': 'spin-slow 44s linear infinite reverse',
        sheen: 'sheen 6s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'pulse-ring': 'pulseRing 3s ease-out infinite',
      },
    },
  },
  plugins: [],
}
