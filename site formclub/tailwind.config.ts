import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0A0B',
          950: '#060607',
          900: '#0A0A0B',
          800: '#121316',
          700: '#18191D',
          600: '#222328',
        },
        charcoal: {
          DEFAULT: '#121316',
          surface: '#18191D',
          card: '#141519',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1E2026',
        },
        alabaster: {
          DEFAULT: '#F4F4F6',
          pure: '#FFFFFF',
          dim: '#E4E4E8',
        },
        bronze: {
          DEFAULT: '#C8A97E',
          light: '#DFC7A7',
          dark: '#A6865B',
          glow: 'rgba(200, 169, 126, 0.25)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#997F24',
        },
        volt: {
          DEFAULT: '#E2F163',
          glow: 'rgba(226, 241, 99, 0.25)',
          dark: '#B0C22E',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-syne)', 'var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'radial-radial-glow': 'radial-gradient(circle at 50% 0%, rgba(200, 169, 126, 0.15), transparent 70%)',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        'gold-gradient': 'linear-gradient(135deg, #DFC7A7 0%, #C8A97E 50%, #A6865B 100%)',
      },
      boxShadow: {
        'glow-bronze': '0 0 30px -5px rgba(200, 169, 126, 0.25)',
        'glow-volt': '0 0 30px -5px rgba(226, 241, 99, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
