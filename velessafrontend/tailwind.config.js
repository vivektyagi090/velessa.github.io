/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F8F5F0',
          light: '#FDFBF7',
          dark: '#EFEAE1',
        },
        champagne: {
          light: '#DFCA9B',
          DEFAULT: '#C6A15B',
          dark: '#A37F38',
          hover: '#B58F49',
        },
        charcoal: {
          DEFAULT: '#1C1C1C',
          light: '#2E2E2E',
          muted: '#555555',
        },
        beige: {
          light: '#F4EFE6',
          DEFAULT: '#E8DED1',
          dark: '#D8CAB7',
        },
        cream: '#FBF9F5',
        gold: {
          50: '#FBF8EF',
          100: '#F5ECCF',
          200: '#EBDB9F',
          300: '#DEC56E',
          400: '#D2B24A',
          500: '#C6A15B',
          600: '#A9813E',
          700: '#87622C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Inter"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      letterSpacing: {
        'widest-luxury': '0.25em',
        'wider-luxury': '0.18em',
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(28, 28, 28, 0.06), 0 4px 6px -2px rgba(28, 28, 28, 0.02)',
        'luxury-hover': '0 20px 40px -10px rgba(28, 28, 28, 0.12), 0 8px 10px -4px rgba(198, 161, 91, 0.08)',
        'gold-glow': '0 0 25px rgba(198, 161, 91, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
