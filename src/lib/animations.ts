/**
 * Animation System - Punk-meets-Professional Aesthetic
 *
 * This module provides a comprehensive animation system that combines:
 * - Smooth, professional transitions
 * - Punk-inspired glitch effects and micro-interactions
 * - Performance-optimized CSS animations
 * - Accessibility-first approach with reduced motion support
 */

// Utility to convert iterations
const toIterations = (
  value: number | 'infinite' | undefined
): number | undefined => (value === 'infinite' ? Infinity : value);

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  /** Number of iterations or the keyword 'infinite' */
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface GlitchConfig extends AnimationConfig {
  intensity?: 'subtle' | 'medium' | 'intense';
  colors?: readonly string[];
  frequency?: number;
}

/**
 * Animation presets for consistent design system
 */
export const ANIMATION_PRESETS = {
  // Professional transitions
  smooth: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  elastic: {
    duration: 800,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Punk-inspired effects
  glitch: {
    duration: 150,
    easing: 'steps(2, end)',
    iterations: 3,
  },

  jitter: {
    duration: 100,
    easing: 'linear',
    iterations: 'infinite',
    direction: 'alternate',
  },

  pulse: {
    duration: 1000,
    easing: 'ease-in-out',
    iterations: 'infinite',
    direction: 'alternate',
  },

  // Micro-interactions
  tap: {
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  hover: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  focus: {
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * Glitch effect configurations
 */
export const GLITCH_PRESETS = {
  subtle: {
    intensity: 'subtle' as const,
    colors: ['#ff0000', '#00ff00', '#0000ff'] as string[],
    frequency: 0.1,
    duration: 100,
  },

  medium: {
    intensity: 'medium' as const,
    colors: ['#ff0040', '#00ff40', '#4000ff'] as string[],
    frequency: 0.3,
    duration: 150,
  },

  intense: {
    intensity: 'intense' as const,
    colors: ['#ff0080', '#80ff00', '#8000ff'] as string[],
    frequency: 0.5,
    duration: 200,
  },
} as const;

/**
 * Animation utility class for managing animations
 */
export class AnimationManager {
  private static instance: AnimationManager;
  private animations = new Map<string, Animation>();
  private reducedMotion = false;

  constructor() {
    this.checkReducedMotion();
    this.setupEventListeners();
  }

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  private checkReducedMotion(): void {
    if (typeof window !== 'undefined') {
      this.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      window
        .matchMedia('(prefers-reduced-motion: reduce)')
        .addEventListener('change', (e) => {
          this.reducedMotion = e.matches;
          if (this.reducedMotion) {
            this.stopAllAnimations();
          }
        });
    }
  }

  /**
   * Create a smooth transition animation
   */
  createTransition(
    element: HTMLElement,
    properties: Record<string, string>,
    config: AnimationConfig = ANIMATION_PRESETS.smooth
  ): Animation | null {
    if (this.reducedMotion) return null;

    const keyframes = [
      this.getCurrentStyles(element, Object.keys(properties)),
      properties,
    ];

    const animation = element.animate(keyframes, {
      duration: config.duration,
      easing: config.easing,
      delay: config.delay,
      iterations: toIterations(config.iterations),
      direction: config.direction,
      fill: config.fillMode || 'forwards',
    });

    const id = this.generateAnimationId();
    this.animations.set(id, animation);

    animation.addEventListener('finish', () => {
      this.animations.delete(id);
    });

    return animation;
  }

  /**
   * Create a glitch effect animation
   */
  createGlitchEffect(
    element: HTMLElement,
    config: GlitchConfig = GLITCH_PRESETS.medium
  ): Animation | null {
    if (this.reducedMotion) return null;

    const intensity = this.getGlitchIntensity(config.intensity || 'medium');

    const keyframes = [
      { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
      {
        transform: `translate(${intensity.x}px, ${intensity.y}px) skew(${intensity.skew}deg)`,
        filter: `hue-rotate(${intensity.hue}deg) saturate(${intensity.saturate}%)`,
      },
      {
        transform: `translate(${-intensity.x}px, ${intensity.y}px) skew(${-intensity.skew}deg)`,
        filter: `hue-rotate(${-intensity.hue}deg) saturate(${intensity.saturate}%)`,
      },
      { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
    ];

    const animation = element.animate(keyframes, {
      duration: config.duration || 150,
      easing: 'steps(2, end)',
      iterations: toIterations(config.iterations) || 3,
    });

    const id = this.generateAnimationId();
    this.animations.set(id, animation);

    animation.addEventListener('finish', () => {
      this.animations.delete(id);
    });

    return animation;
  }

  /**
   * Create a hover animation
   */
  createHoverAnimation(
    element: HTMLElement,
    hoverStyles: Record<string, string>,
    config: AnimationConfig = ANIMATION_PRESETS.hover
  ): void {
    if (this.reducedMotion) return;

    const originalStyles = this.getCurrentStyles(
      element,
      Object.keys(hoverStyles)
    );
    let isHovering = false;

    const handleMouseEnter = () => {
      if (isHovering) return;
      isHovering = true;
      this.createTransition(element, hoverStyles, config);
    };

    const handleMouseLeave = () => {
      if (!isHovering) return;
      isHovering = false;
      this.createTransition(element, originalStyles, config);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('focusin', handleMouseEnter);
    element.addEventListener('focusout', handleMouseLeave);
  }

  /**
   * Create a staggered animation for multiple elements
   */
  createStaggeredAnimation(
    elements: NodeListOf<HTMLElement> | HTMLElement[],
    keyframes: Keyframe[],
    config: AnimationConfig & { stagger?: number } = {}
  ): Animation[] {
    if (this.reducedMotion) return [];

    const animations: Animation[] = [];
    const stagger = config.stagger || 100;

    Array.from(elements).forEach((element, index) => {
      const animation = element.animate(keyframes, {
        duration: config.duration || 300,
        easing: config.easing || 'ease-out',
        delay: (config.delay || 0) + index * stagger,
        iterations: toIterations(config.iterations),
        fill: config.fillMode || 'forwards',
      });

      animations.push(animation);
    });

    return animations;
  }

  /**
   * Create a particle burst effect
   */
  createParticleBurst(
    element: HTMLElement,
    particleCount: number = 8,
    config: AnimationConfig = {}
  ): void {
    if (this.reducedMotion) return;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-burst';

      const angle = (360 / particleCount) * i;
      const distance = 50 + Math.random() * 30;
      const size = 2 + Math.random() * 4;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--color-accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(particle);

      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance;

      const animation = particle.animate(
        [
          {
            transform: 'translate(0, 0) scale(1)',
            opacity: 1,
          },
          {
            transform: `translate(${x}px, ${y}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: config.duration || 600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      );

      animation.addEventListener('finish', () => {
        particle.remove();
      });
    }
  }

  private getCurrentStyles(
    element: HTMLElement,
    properties: string[]
  ): Record<string, string> {
    const computed = window.getComputedStyle(element);
    const styles: Record<string, string> = {};

    properties.forEach((prop) => {
      styles[prop] = computed.getPropertyValue(prop);
    });

    return styles;
  }

  private getGlitchIntensity(intensity: 'subtle' | 'medium' | 'intense') {
    const intensities = {
      subtle: { x: 1, y: 1, skew: 0.5, hue: 10, saturate: 120 },
      medium: { x: 3, y: 2, skew: 1, hue: 30, saturate: 150 },
      intense: { x: 5, y: 4, skew: 2, hue: 60, saturate: 200 },
    };

    return intensities[intensity];
  }

  private generateAnimationId(): string {
    return `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private stopAllAnimations(): void {
    this.animations.forEach((animation) => {
      animation.cancel();
    });
    this.animations.clear();
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this.stopAllAnimations();
  }
}

/**
 * Utility functions for common animations
 */
export const AnimationUtils = {
  /**
   * Animate element entrance
   */
  animateIn(
    element: HTMLElement,
    type: 'fade' | 'slide' | 'scale' | 'glitch' = 'fade',
    config: AnimationConfig = {}
  ): Animation | null {
    const manager = AnimationManager.getInstance();

    const animations = {
      fade: () => manager.createTransition(element, { opacity: '1' }, config),
      slide: () =>
        manager.createTransition(
          element,
          {
            transform: 'translateY(0)',
            opacity: '1',
          },
          config
        ),
      scale: () =>
        manager.createTransition(
          element,
          {
            transform: 'scale(1)',
            opacity: '1',
          },
          config
        ),
      glitch: () => manager.createGlitchEffect(element, config as GlitchConfig),
    };

    return animations[type]();
  },

  /**
   * Animate element exit
   */
  animateOut(
    element: HTMLElement,
    type: 'fade' | 'slide' | 'scale' = 'fade',
    config: AnimationConfig = {}
  ): Animation | null {
    const manager = AnimationManager.getInstance();

    const animations = {
      fade: () => manager.createTransition(element, { opacity: '0' }, config),
      slide: () =>
        manager.createTransition(
          element,
          {
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          config
        ),
      scale: () =>
        manager.createTransition(
          element,
          {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          config
        ),
    };

    return animations[type]();
  },

  /**
   * Create a typing animation effect
   */
  typeWriter(
    element: HTMLElement,
    text: string,
    speed: number = 50
  ): Promise<void> {
    return new Promise((resolve) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = text;
        resolve();
        return;
      }

      let i = 0;
      element.textContent = '';

      const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;

        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  },

  /**
   * Create a shake animation
   */
  shake(
    element: HTMLElement,
    intensity: 'subtle' | 'medium' | 'intense' = 'medium'
  ): Animation | null {
    const intensities = {
      subtle: 2,
      medium: 4,
      intense: 8,
    };

    const distance = intensities[intensity];

    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${distance}px)` },
      { transform: `translateX(${distance}px)` },
      { transform: `translateX(-${distance}px)` },
      { transform: 'translateX(0)' },
    ];

    return element.animate(keyframes, {
      duration: 300,
      easing: 'ease-in-out',
    });
  },
};

/**
 * Initialize animations when DOM is ready
 */
export function initializeAnimations(): void {
  if (typeof window === 'undefined') return;

  // Initialize the animation manager
  AnimationManager.getInstance();

  // Add global animation classes
  if (!document.head.querySelector('#animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      .animate-fade-in {
        opacity: 0;
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      .animate-slide-up {
        transform: translateY(20px);
        opacity: 0;
        animation: slideUp 0.4s ease-out forwards;
      }
      
      .animate-scale-in {
        transform: scale(0.9);
        opacity: 0;
        animation: scaleIn 0.3s ease-out forwards;
      }
      
      .animate-glitch {
        animation: glitch 0.3s ease-in-out;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        to { 
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .animate-fade-in,
        .animate-slide-up,
        .animate-scale-in,
        .animate-glitch {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  console.log('🎭 Animation system initialized');
}
