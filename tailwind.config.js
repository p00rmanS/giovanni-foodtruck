/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './404.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      colors: {
        shrimp: {
          50: '#fff4ec',
          100: '#ffe3cc',
          200: '#ffc699',
          300: '#ffa15f',
          400: '#ff7a33',
          500: '#f9541c',
          600: '#e83a12',
          700: '#c02710',
          800: '#992116',
          900: '#7c1d15',
        },
        lagoon: {
          50: '#eafffb',
          100: '#c7fff3',
          200: '#93ffe9',
          300: '#54f4dc',
          400: '#22d9c4',
          500: '#0bb9aa',
          600: '#06938a',
          700: '#0a746f',
          800: '#0e5c59',
          900: '#0f4c4a',
        },
        sun: {
          400: '#ffd23f',
          500: '#ffc300',
          600: '#f0a500',
        },
        ink: '#1a1410',
      },
      fontFamily: {
        display: ['"Bungee"', 'system-ui', 'sans-serif'],
        heading: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.08)' },
          '66%': { transform: 'translate(-20px, 25px) scale(0.95)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.75' },
        },
        wave: {
          '0%': { backgroundPositionX: '0px' },
          '100%': { backgroundPositionX: '1000px' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        blob: 'blob 12s ease-in-out infinite',
        bob: 'bob 5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
