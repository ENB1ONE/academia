/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B7DDD',
          hover: '#2F64B1',
        },
        secondary: {
          DEFAULT: '#17A2B8',
          hover: '#138496',
        },
        accent: '#F59E0B',
        background: '#F2F4F7',
        surface: '#FFFFFF',
        text: '#212529',
        border: '#CED4DA',
        danger: '#DC3545',
        success: '#28A745',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
