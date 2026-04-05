/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0e0e13',
        primary: '#df8eff',
        'primary-dim': '#bb00fc',
        'primary-fixed': '#d878ff',
        secondary: '#00e3fd',
        'on-primary': '#4f006d',
        'on-background': '#f8f5fd',
        surface: '#0e0e13',
        'surface-low': '#131318',
        'surface-container': '#19191f',
        'surface-high': '#1f1f26',
        'surface-variant': '#25252c',
        'on-surface-variant': '#acaab1',
        outline: '#76747b',
        'outline-variant': '#48474d',
        error: '#ff6e84'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(0, 227, 253, 0.4)',
        'neon-primary': '0 0 20px rgba(223, 142, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
