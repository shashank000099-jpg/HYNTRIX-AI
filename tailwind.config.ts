import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0a0a0a',
        primary: '#0071e3',
        secondary: '#34c759',
        accent: '#ff9500',
        success: '#34c759',
        danger: '#ff3b30',
        'apple-black': '#000000',
        'apple-gray': {
          50: '#f5f5f7',
          100: '#efefef',
          200: '#e5e5e7',
          300: '#d5d5d7',
          400: '#86868b',
          500: '#6b6b6f',
          600: '#555559'
        }
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(0, 113, 227, 0.2)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        'apple-gradient': 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
};

export default config;
