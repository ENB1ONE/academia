/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        danger: '#EF4444',
        success: '#22C55E'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
