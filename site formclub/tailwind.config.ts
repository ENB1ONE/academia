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
          DEFAULT: '#0A0A0C',
          950: '#050507',
          900: '#0A0A0C',
          800: '#121215',
          700: '#18181D',
          600: '#222229',
        },
        charcoal: {
          DEFAULT: '#141418',
          surface: '#1A1A20',
          card: '#16161C',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1F1F27',
        },
        alabaster: {
          DEFAULT: '#FFFFFF',
          pure: '#FFFFFF',
          dim: '#E5E7EB',
        },
        // Tom de amarelo/dourado oficial FORMCLUB (@form.club)
        gold: {
          DEFAULT: '#E5A910',
          light: '#F5BE2C',
          dark: '#C89008',
          glow: 'rgba(229, 169, 16, 0.25)',
        },
        bronze: {
          DEFAULT: '#E5A910',
          light: '#F5BE2C',
          dark: '#C89008',
          glow: 'rgba(229, 169, 16, 0.25)',
        },
        volt: {
          DEFAULT: '#E5A910',
          glow: 'rgba(229, 169, 16, 0.25)',
          dark: '#C89008',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-syne)', 'var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'radial-radial-glow': 'radial-gradient(circle at 50% 0%, rgba(229, 169, 16, 0.16), transparent 70%)',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #E5A910 50%, #C89008 100%)',
      },
      boxShadow: {
        'glow-bronze': '0 0 30px -5px rgba(229, 169, 16, 0.3)',
        'glow-volt': '0 0 30px -5px rgba(229, 169, 16, 0.3)',
        'glow-gold': '0 0 30px -5px rgba(229, 169, 16, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
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
