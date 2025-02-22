import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-merge-black)', ...fontFamily.sans],
        mergeblack: ['var(--font-merge-black)'],
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
        pulse: 'pulse 1.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
