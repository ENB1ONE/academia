/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Oficial FormClub (site formclub: obsidian, charcoal, gold/amber)
        primary: {
          DEFAULT: '#E5A910', // Dourado / Amarelo Oficial FormClub
          hover: '#C89008',
          light: '#F5BE2C',
          dark: '#C89008',
          glow: 'rgba(229, 169, 16, 0.25)',
        },
        secondary: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
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
        gold: {
          DEFAULT: '#E5A910',
          light: '#F5BE2C',
          dark: '#C89008',
          glow: 'rgba(229, 169, 16, 0.25)',
        },
        accent: '#E5A910',
        background: '#0A0A0C', // Fundo Obsidian escuro premium do site
        surface: '#141418',    // Cards e superfície Charcoal
        text: '#FFFFFF',
        muted: '#9CA3AF',
        danger: '#EF4444',
        success: '#10B981',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
