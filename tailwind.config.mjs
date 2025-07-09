/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Use CSS variables for colors so they work with theme switching
      colors: {
        // Theme-aware colors using CSS variables
        'theme-bg': 'var(--color-bg-primary)',
        'theme-bg-secondary': 'var(--color-bg-secondary)',
        'theme-bg-tertiary': 'var(--color-bg-tertiary)',
        'theme-text': 'var(--color-text-primary)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-text-tertiary': 'var(--color-text-tertiary)',
        'theme-accent': 'var(--color-accent-primary)',
        'theme-accent-secondary': 'var(--color-accent-secondary)',
        'theme-accent-tertiary': 'var(--color-accent-tertiary)',
        
        // Brutalist palette
        'brutal': {
          'white': '#FAFAFA',
          'black': '#171717',
          'grey': {
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
        
        // Punk accent colors
        'punk': {
          'electric': '#00D4FF',
          'coral': '#FF6B6B',
          'mint': '#4ECDC4',
          'magenta': '#FF3D71',
          'yellow': '#FFD93D',
          'orange': '#FF8C42',
        },
      },
      
      // Typography scale
      fontFamily: {
        'heading': ['var(--font-heading)'],
        'body': ['var(--font-body)'],
        'mono': ['var(--font-mono)'],
        'serif': ['var(--font-serif)'],
      },
      
      // Brutalist font sizes
      fontSize: {
        'brutal-xs': ['0.75rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-sm': ['0.875rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-base': ['1rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-lg': ['1.125rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-xl': ['1.25rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-2xl': ['1.5rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-3xl': ['1.875rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-4xl': ['2.25rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-5xl': ['3rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-6xl': ['3.75rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-7xl': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-8xl': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'brutal-9xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
      },
      
      // Spacing tokens
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      
      // Transition tokens
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      
      // Animation keyframes for punk effects
      keyframes: {
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      
      animation: {
        'glitch': 'glitch 0.3s ease-in-out',
        'flicker': 'flicker 0.1s ease-in-out',
      },
    },
  },
  plugins: [],
}
