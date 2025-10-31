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
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg) scale(0.9) ' },
          '10%': { transform: 'rotate(0deg) scale(1)' },
          '20%': { transform: 'rotate(-3deg) scale(1)' },
          '30%': { transform: 'rotate(3deg) scale(1)' },
          '40%': { transform: 'rotate(-3deg) scale(1)' },
          '50%': { transform: 'rotate(3deg) scale(1)' }
        },
        slideRightPulse: {
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
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease infinite',
        shake: 'shake 1s ease-in-out infinite',
        fadeDown: 'fadeDown 0.3s ease-in-out',
        fadeUp: 'fadeUp 0.3s ease-in-out',
        pulse: 'pulse 1.5s ease-in-out infinite',
        slideRightPulse: 'slideRightPulse 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
        bounceSlow: 'bounceSlow 2s infinite ease-in-out'
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
