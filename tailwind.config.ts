import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        // subColor: '#f8c144',
        // mainColor: '#008b4b',
        mainColor: 'rgb(var(--color-mainColor) / <alpha-value>)',
        subColor: 'rgb(var(--color-subColor) / <alpha-value>)',
        dark: {
          background: '#1e1e1e',
          card: '#2E2E2E',
          surface: '#333333',
          text: '#C9C9BF',
          dimmed: '#424242',
          muted: '#9ca3af',
          border: '#444444',
          accent: '#00BFA6'
        }
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '2rem'
      },
      fontFamily: {
        sans: ['var(--font-quicksand)', ...fontFamily.sans],
        quicksand: ['var(--font-quicksand)', ...fontFamily.sans]
      },
      keyframes: {
        typing: {
          '0%': {
            width: '0ch'
          },
          '100%': {
            width: '40ch'
          }
        },
        showLeftTo: {
          '0%': {
            transform: 'translateX(-20%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1'
          }
        },
        showRightTo: {
          '0%': {
            transform: 'translateX(20%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0%)',
            opacity: '1'
          }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg) scale(0.9) ' },
          '10%': { transform: 'rotate(0deg) scale(1)' },
          '20%': { transform: 'rotate(-3deg) scale(1)' },
          '30%': { transform: 'rotate(3deg) scale(1)' },
          '40%': { transform: 'rotate(-3deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1)' }
        },
        'slide-right': {
          '0%': { transform: 'translateX(0)', opacity: '0.3' },
          '50%': { transform: 'translateX(20px)', opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '0.3' }
        },
        shake: {
          '10%': { transform: 'rotate(15deg)' },
          '20%': { transform: 'rotate(-15deg)' },
          '30%': { transform: 'rotate(15deg)' },
          '50%': { transform: 'rotate(0deg)' }
        },
        fadeTop: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeBottom: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease infinite',
        shake: 'shake 1s ease-in-out infinite',
        fadeTop: 'fadeTop 0.3s ease-in-out',
        fadeBottom: 'fadeBottom 0.3s ease-in-out',
        pulse: 'pulse 1.5s ease-in-out infinite',
        'slide-right': 'slide-right 2s ease-in-out infinite',
        typing: 'typing 2s steps(40) alternate infinite',
        showLeftTo: 'showLeftTo 0.5s ease',
        showRightTo: 'showRightTo 0.5s ease'
      }
    },
    screens: {
      xs: '576px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1440px'
    }
  },
  plugins: []
} satisfies Config;
