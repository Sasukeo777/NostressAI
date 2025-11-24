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
          50: '#f2f7f5',
          100: '#e1ebe8',
          200: '#c5dad6',
          300: '#9ebfb9',
          400: '#759e98',
          500: '#56827c',
          600: '#426661',
          700: '#37524e',
          800: '#2f4240',
          900: '#293836',
          950: '#151f1e',
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
        // Sophisticated Neutrals
        neutral: {
          25: '#fcfcfc',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#544b46',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
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
      },
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ]
};
