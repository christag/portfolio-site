/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Custom breakpoints for our design system
    screens: {
      xs: '320px', // Extra small phones
      sm: '480px', // Small phones
      md: '768px', // Tablets
      lg: '1024px', // Small desktops
      xl: '1280px', // Large desktops
      '2xl': '1440px', // Extra large desktops
      '3xl': '1920px', // Ultra wide
    },
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

        // Brutalist palette - integrated into both themes
        brutal: {
          white: '#FAFAFA',
          black: '#171717',
          grey: {
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

        // Strategic accent colors - used selectively for maximum impact
        'dusty-pink': '#b8869a', // Primary accent - darker dusty pink
        electric: '#00d4ff', // Secondary accent - electric blue/cyan
        coral: '#ff6b6b', // Legacy coral pink (kept for compatibility)
        mint: '#4ecdc4', // Tertiary accent - mint green

        // Brutalist accent colors
        brutalist: {
          accent: 'var(--color-brutalist-accent)', // Pure black/white for contrast
          highlight: 'var(--color-brutalist-highlight)', // Neon pink/pale pink for energy
        },

        // Glass material colors using CSS variables
        glass: {
          'bg-light': 'var(--glass-bg-primary)',
          'bg-medium': 'var(--glass-bg-secondary)',
          'bg-heavy': 'var(--glass-bg-tertiary)',
          'border-light': 'var(--glass-border-light)',
          'border-medium': 'var(--glass-border-medium)',
          tint: 'var(--glass-tint)',
          'shadow-light': 'var(--glass-shadow-light)',
          'shadow-medium': 'var(--glass-shadow-medium)',
          'shadow-heavy': 'var(--glass-shadow-heavy)',
          highlight: 'var(--glass-inner-highlight)',
        },
      },

      // Typography scale
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif)'],
      },

      // Brutalist font sizes
      fontSize: {
        'brutal-xs': [
          '0.75rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-sm': [
          '0.875rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-base': [
          '1rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-lg': [
          '1.125rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-xl': [
          '1.25rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-2xl': [
          '1.5rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-3xl': [
          '1.875rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-4xl': [
          '2.25rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-5xl': [
          '3rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-6xl': [
          '3.75rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-7xl': [
          '4.5rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-8xl': [
          '6rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
        'brutal-9xl': [
          '8rem',
          { lineHeight: '0.9', letterSpacing: '-0.025em' },
        ],
      },

      // Spacing tokens using CSS variables
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',

        // Deliberate misalignment spacing
        'offset-1': '0.125rem', // 2px
        'offset-2': '0.25rem', // 4px
        'offset-3': '0.375rem', // 6px
        'offset-4': '0.5rem', // 8px
        'offset-6': '0.75rem', // 12px
        'offset-8': '1rem', // 16px
        'offset-12': '1.5rem', // 24px
        'offset-16': '2rem', // 32px

        // Asymmetric spacing
        'asym-1': '0.3125rem', // 5px - odd number for asymmetry
        'asym-2': '0.6875rem', // 11px
        'asym-3': '1.0625rem', // 17px
        'asym-4': '1.4375rem', // 23px
        'asym-5': '1.8125rem', // 29px
        'asym-6': '2.1875rem', // 35px
      },

      // Glass-specific spacing and sizing
      borderRadius: {
        glass: 'var(--glass-radius)',
        'glass-sm': 'var(--glass-radius-small)',
        'glass-lg': 'var(--glass-radius-large)',
      },

      // Enhanced backdrop blur values for glassmorphism
      backdropBlur: {
        'glass-button': 'var(--glass-blur-button)',
        'glass-container': 'var(--glass-blur-container)',
        'glass-nav': 'var(--glass-blur-navigation)',
        'glass-xs': '8px',
        'glass-sm': '12px',
        'glass-md': '16px',
        'glass-lg': '20px',
        'glass-xl': '24px',
        'glass-2xl': '28px',
        'glass-3xl': '32px',
      },

      // Glass-specific box shadows
      boxShadow: {
        'glass-light':
          '0 8px 32px var(--glass-shadow-light), inset 0 1px 0 var(--glass-inner-highlight)',
        'glass-medium':
          '0 12px 40px var(--glass-shadow-medium), inset 0 1px 0 var(--glass-inner-highlight)',
        'glass-heavy':
          '0 16px 48px var(--glass-shadow-heavy), inset 0 1px 0 var(--glass-inner-highlight)',
        'glass-float':
          '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-button':
          '0 4px 16px var(--glass-shadow-light), inset 0 1px 0 var(--glass-inner-highlight)',
      },

      // Grid utilities for asymmetric layouts
      gridTemplateColumns: {
        'asym-2': '1fr 1.618fr', // Golden ratio
        'asym-3': '1fr 1.618fr 1fr', // Golden ratio middle
        'asym-4': '1fr 2fr 1fr 1.5fr', // Varied columns
        'asym-5': '1fr 1.5fr 2fr 1fr 1.2fr',
      },

      // Container max widths for different breakpoints
      maxWidth: {
        xs: '20rem', // 320px
        sm: '30rem', // 480px
        md: '48rem', // 768px
        lg: '64rem', // 1024px
        xl: '80rem', // 1280px
        '2xl': '90rem', // 1440px
        '3xl': '120rem', // 1920px
      },

      // Transition tokens using CSS variables
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
        glass: '300ms',
        'glass-hover': '200ms',
      },

      // Glass-specific transitions
      transitionTimingFunction: {
        glass: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'glass-hover': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Extended animation keyframes for brutalist effects
      keyframes: {
        // Glass-specific animations
        'glass-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glass-float': {
          '0%, 100%': { transform: 'translateY(0) translateZ(0)' },
          '50%': { transform: 'translateY(-8px) translateZ(0)' },
        },
        'glass-pulse': {
          '0%, 100%': {
            backdropFilter: 'blur(var(--glass-blur-container)) saturate(180%)',
            borderColor: 'var(--glass-border-medium)',
          },
          '50%': {
            backdropFilter:
              'blur(calc(var(--glass-blur-container) + 4px)) saturate(200%)',
            borderColor: 'var(--glass-border-light)',
          },
        },

        // Glitch Effects
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glitch-intense': {
          '0%, 100%': {
            transform: 'translate(0) skew(0deg)',
            filter: 'hue-rotate(0deg)',
          },
          '10%': {
            transform: 'translate(-5px, 2px) skew(-2deg)',
            filter: 'hue-rotate(90deg)',
          },
          '20%': {
            transform: 'translate(-10px, -2px) skew(2deg)',
            filter: 'hue-rotate(180deg)',
          },
          '30%': {
            transform: 'translate(10px, 2px) skew(-1deg)',
            filter: 'hue-rotate(270deg)',
          },
          '40%': {
            transform: 'translate(5px, -2px) skew(1deg)',
            filter: 'hue-rotate(360deg)',
          },
          '50%': {
            transform: 'translate(-2px, 2px) skew(-3deg)',
            filter: 'hue-rotate(45deg)',
          },
          '60%': {
            transform: 'translate(2px, 5px) skew(2deg)',
            filter: 'hue-rotate(135deg)',
          },
          '70%': {
            transform: 'translate(-3px, -5px) skew(-1deg)',
            filter: 'hue-rotate(225deg)',
          },
          '80%': {
            transform: 'translate(3px, -2px) skew(1deg)',
            filter: 'hue-rotate(315deg)',
          },
          '90%': {
            transform: 'translate(-1px, 2px) skew(-2deg)',
            filter: 'hue-rotate(180deg)',
          },
        },
        'glitch-rgb': {
          '0%, 100%': {
            transform: 'translate(0)',
            textShadow: '0 0 0 red, 0 0 0 blue',
          },
          '25%': {
            transform: 'translate(-2px, 0)',
            textShadow: '2px 0 0 red, -2px 0 0 blue',
          },
          '50%': {
            transform: 'translate(2px, 0)',
            textShadow: '-2px 0 0 red, 2px 0 0 blue',
          },
          '75%': {
            transform: 'translate(-1px, 0)',
            textShadow: '1px 0 0 red, -1px 0 0 blue',
          },
        },

        // Flicker and Flash Effects
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'flicker-intense': {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.1' },
          '20%': { opacity: '1' },
          '30%': { opacity: '0.3' },
          '40%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '60%': { opacity: '0.1' },
          '70%': { opacity: '1' },
          '80%': { opacity: '0.5' },
          '90%': { opacity: '1' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },

        // Movement and Slide Effects
        'slide-offset': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(var(--slide-distance, 0.5rem))' },
        },
        'slide-chaotic': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, -3px)' },
          '50%': { transform: 'translate(-3px, 7px)' },
          '75%': { transform: 'translate(7px, 2px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'bounce-brutal': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        // Rotation and Skew Effects
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '30%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '50%': { transform: 'translateX(-2px)' },
          '60%': { transform: 'translateX(2px)' },
          '70%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
          '90%': { transform: 'translateX(-2px)' },
        },
        'skew-brutal': {
          '0%, 100%': { transform: 'skew(0deg)' },
          '50%': { transform: 'skew(-5deg)' },
        },

        // Scale and Zoom Effects
        'pulse-brutal': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'zoom-glitch': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(0.95)' },
          '75%': { transform: 'scale(1.02)' },
        },

        // Particle and Floating Effects
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-chaotic': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -15px) rotate(90deg)' },
          '50%': { transform: 'translate(-5px, -30px) rotate(180deg)' },
          '75%': { transform: 'translate(-15px, -10px) rotate(270deg)' },
          '100%': { transform: 'translate(0, 0) rotate(360deg)' },
        },

        // Loading and Progress Effects
        'loading-brutal': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'loading-jagged': {
          '0%': {
            transform: 'scaleX(0)',
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          },
          '25%': {
            clipPath: 'polygon(0 0, 30% 0, 25% 100%, 0 100%)',
          },
          '50%': {
            clipPath: 'polygon(0 0, 60% 0, 55% 100%, 0 100%)',
          },
          '75%': {
            clipPath: 'polygon(0 0, 90% 0, 85% 100%, 0 100%)',
          },
          '100%': {
            transform: 'scaleX(1)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          },
        },

        // Typing and Text Effects
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },

      // Animation utilities
      animation: {
        // Glass animations
        'glass-shimmer': 'glass-shimmer 2s ease-in-out infinite',
        'glass-float': 'glass-float 3s ease-in-out infinite',
        'glass-pulse': 'glass-pulse 2s ease-in-out infinite',

        // Glitch animations
        glitch: 'glitch 0.3s ease-in-out',
        'glitch-fast': 'glitch 0.1s ease-in-out',
        'glitch-slow': 'glitch 0.6s ease-in-out',
        'glitch-intense': 'glitch-intense 0.5s ease-in-out',
        'glitch-rgb': 'glitch-rgb 0.4s ease-in-out',
        'glitch-infinite': 'glitch 2s ease-in-out infinite',
        'glitch-intense-infinite': 'glitch-intense 3s ease-in-out infinite',

        // Flicker animations
        flicker: 'flicker 0.1s ease-in-out',
        'flicker-fast': 'flicker 0.05s ease-in-out',
        'flicker-slow': 'flicker 0.2s ease-in-out',
        'flicker-intense': 'flicker-intense 0.8s ease-in-out',
        'flicker-infinite': 'flicker 1.5s ease-in-out infinite',
        flash: 'flash 0.3s ease-in-out',

        // Movement animations
        'slide-offset': 'slide-offset 0.3s ease-out',
        'slide-chaotic': 'slide-chaotic 2s ease-in-out infinite',
        'bounce-brutal': 'bounce-brutal 1s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        'shake-infinite': 'shake 2s ease-in-out infinite',
        'skew-brutal': 'skew-brutal 0.3s ease-in-out',

        // Scale animations
        'pulse-brutal': 'pulse-brutal 1s ease-in-out infinite',
        'zoom-glitch': 'zoom-glitch 0.4s ease-in-out',

        // Particle animations
        float: 'float 3s ease-in-out infinite',
        'float-chaotic': 'float-chaotic 4s linear infinite',

        // Loading animations
        'loading-brutal': 'loading-brutal 1s ease-out',
        'loading-jagged': 'loading-jagged 2s ease-out',

        // Text animations
        typing: 'typing 2s steps(40) forwards',
        'cursor-blink': 'cursor-blink 1s infinite',
      },

      // Custom filters for motion blur and effects
      filter: {
        'motion-blur': 'blur(2px)',
        'motion-blur-heavy': 'blur(4px)',
        'glitch-filter': 'hue-rotate(90deg) saturate(150%)',
      },

      // Custom backdrop filters
      backdropFilter: {
        glitch: 'blur(2px) hue-rotate(90deg)',
      },
    },
  },
  plugins: [
    // Custom Glassmorphism Plugin
    function ({ addUtilities, addComponents, theme }) {
      // Add glass utility classes
      addUtilities({
        '.glass-surface': {
          backdropFilter: 'blur(var(--glass-blur-container)) saturate(180%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-container)) saturate(180%)',
        },
        '.glass-surface-strong': {
          backdropFilter: 'blur(var(--glass-blur-navigation)) saturate(200%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-navigation)) saturate(200%)',
        },
        '.glass-surface-subtle': {
          backdropFilter: 'blur(var(--glass-blur-button)) saturate(150%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-button)) saturate(150%)',
        },
      });

      // Add glass component classes
      addComponents({
        '.glass-card': {
          background:
            'linear-gradient(135deg, var(--glass-bg-primary), var(--glass-tint))',
          backdropFilter: 'blur(var(--glass-blur-container)) saturate(180%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-container)) saturate(180%)',
          border: '1px solid var(--glass-border-medium)',
          borderRadius: 'var(--glass-radius)',
          boxShadow:
            '0 8px 32px var(--glass-shadow-light), inset 0 1px 0 var(--glass-inner-highlight)',
          transition: 'all var(--transition-glass)',
        },
        '.glass-button': {
          background:
            'linear-gradient(135deg, var(--glass-bg-primary), var(--glass-tint))',
          backdropFilter: 'blur(var(--glass-blur-button)) saturate(180%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-button)) saturate(180%)',
          border: '1px solid var(--glass-border-medium)',
          borderRadius: 'var(--glass-radius-small)',
          padding: 'var(--space-sm) var(--space-md)',
          boxShadow:
            '0 4px 16px var(--glass-shadow-light), inset 0 1px 0 var(--glass-inner-highlight)',
          transition: 'all var(--transition-glass-hover)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          fontWeight: '600',
        },
        '.glass-nav': {
          background:
            'linear-gradient(135deg, var(--glass-bg-secondary), var(--glass-tint))',
          backdropFilter: 'blur(var(--glass-blur-navigation)) saturate(200%)',
          '-webkit-backdrop-filter':
            'blur(var(--glass-blur-navigation)) saturate(200%)',
          borderBottom: '1px solid var(--glass-border-light)',
          boxShadow:
            '0 8px 32px var(--glass-shadow-light), inset 0 1px 0 var(--glass-inner-highlight)',
          transition: 'all var(--transition-glass)',
        },
      });
    },
  ],
};
