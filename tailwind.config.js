/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color
        'cvs-primary': '#2563eb',  // Professional blue
        
        // Text colors
        'cvs-foreground': '#1f2937', // Dark text color
        'cvs-muted': '#6b7280',      // Muted text color
        
        // Secondary colors for different resume sections
        'cvs-experience': '#8b5cf6',  // Purple for work experience
        'cvs-education': '#14b8a6',   // Teal for education
        'cvs-skills': '#f59e0b',      // Amber for skills
        
        // UI colors
        'cvs-success': '#10b981',     // Green for success states
        'cvs-error': '#ef4444',       // Red for errors
        'cvs-neutral': '#6b7280',     // Gray for less important elements
        'cvs-background': '#f9fafb',  // Light background
        'background': 'var(--background)',

        // Add any other custom colors here
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    }
  },
  plugins: [],
} 