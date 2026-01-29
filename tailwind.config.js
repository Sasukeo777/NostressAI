/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './content/**/*.mdx'
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      colors: {
        // Nature-Tech Palette
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
          950: 'rgb(var(--primary-950) / <alpha-value>)',
        },
        // Warm Sand/Clay Accents
        accent: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#ebdcc5',
          300: '#dec29e',
          400: '#d0a273',
          500: '#c68650',
          600: '#ba6d42',
          700: '#9b5638',
          800: '#7e4632',
          900: '#663a2b',
          950: '#371d16',
        },
        // Warm Sophisticated Neutrals (Cream/Sand undertones)
        neutral: {
          25: '#fefdfb',   // Warm white
          50: '#faf9f7',   // Cream
          100: '#f5f3f0',  // Light sand
          200: '#e8e4df',  // Warm gray
          300: '#d4cfc7',  // Sand
          400: '#a8a196',  // Warm medium
          500: '#7a7267',  // Warm gray-brown
          600: '#5c554c',  // Warm dark
          700: '#44403a',  // Dark warm
          800: '#292524',  // Warm charcoal
          900: '#1c1917',  // Warm black
          950: '#0c0a09',  // Deep warm black
        },
        // Vibrant Functional Colors
        success: '#3b8c7e', // Deep Teal
        warning: '#d97706', // Amber
        danger: '#ef4444', // Red
        info: '#3b82f6', // Blue
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        soft: '0 2px 4px -2px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.04)',
        glow: '0 0 20px -5px var(--tw-shadow-color)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ]
};
