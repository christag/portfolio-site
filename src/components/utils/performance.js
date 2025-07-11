/**
 * Glassmorphism Performance Optimization Utilities
 * Based on 2025 research for optimal backdrop-filter performance
 */

// Device capability detection
export class GlassPerformanceManager {
  constructor() {
    this.isLowEndDevice = this.detectLowEndDevice();
    this.supportsBackdropFilter = this.checkBackdropFilterSupport();
    this.performanceMode = this.determinePerformanceMode();

    // Initialize optimizations
    this.init();
  }

  /**
   * Detect if device is low-end based on multiple factors
   */
  detectLowEndDevice() {
    const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    // Low-end indicators
    const hasLowMemory = deviceMemory <= 2;
    const hasLowCores = hardwareConcurrency <= 2;
    const hasSlowConnection =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g');
    const isMobileDevice =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const hasLowPixelRatio = window.devicePixelRatio <= 1;

    return (
      hasLowMemory ||
      (hasLowCores && isMobileDevice) ||
      hasSlowConnection ||
      hasLowPixelRatio
    );
  }

  /**
   * Check if browser supports backdrop-filter
   */
  checkBackdropFilterSupport() {
    const testEl = document.createElement('div');
    testEl.style.backdropFilter = 'blur(1px)';
    const supported = testEl.style.backdropFilter !== '';

    // Also check for webkit prefix
    if (!supported) {
      testEl.style.webkitBackdropFilter = 'blur(1px)';
      return testEl.style.webkitBackdropFilter !== '';
    }

    return supported;
  }

  /**
   * Determine optimal performance mode
   */
  determinePerformanceMode() {
    if (!this.supportsBackdropFilter) return 'fallback';
    if (this.isLowEndDevice) return 'performance';
    return 'full';
  }

  /**
   * Initialize performance optimizations
   */
  init() {
    // Apply performance mode class to document
    document.documentElement.classList.add(
      `glass-${this.performanceMode}-mode`
    );

    // Set up intersection observer for lazy loading
    this.setupLazyLoading();

    // Monitor performance in development
    if (process.env.NODE_ENV === 'development') {
      this.setupPerformanceMonitoring();
    }

    // Apply device-specific optimizations
    this.applyDeviceOptimizations();
  }

  /**
   * Set up lazy loading for glass elements
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('loaded');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      // Observe all lazy glass elements
      document.querySelectorAll('.glass-lazy').forEach((el) => {
        observer.observe(el);
      });
    } else {
      // Fallback: immediately load all glass elements
      document.querySelectorAll('.glass-lazy').forEach((el) => {
        el.classList.add('loaded');
      });
    }
  }

  /**
   * Performance monitoring for development
   */
  setupPerformanceMonitoring() {
    // Mark development mode
    document.documentElement.classList.add('development');

    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`Glass FPS: ${fps}`);

        // Warn if FPS is low
        if (fps < 30) {
          console.warn('Low FPS detected. Consider reducing glass effects.');
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Apply device-specific optimizations
   */
  applyDeviceOptimizations() {
    const root = document.documentElement;

    if (this.isLowEndDevice) {
      // Reduce blur values
      root.style.setProperty('--glass-blur-button', '8px');
      root.style.setProperty('--glass-blur-container', '12px');
      root.style.setProperty('--glass-blur-navigation', '16px');

      // Faster transitions
      root.style.setProperty('--transition-glass', '0.15s ease-out');
      root.style.setProperty('--transition-glass-hover', '0.1s ease-out');

      // Disable complex animations
      this.disableComplexAnimations();
    }

    if (!this.supportsBackdropFilter) {
      // Apply fallback styles
      root.classList.add('no-backdrop-filter');
    }
  }

  /**
   * Disable complex animations on low-end devices
   */
  disableComplexAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .glassmorphism-background {
        animation: none !important;
        background: linear-gradient(135deg, #667eea 0%, #4facfe 100%) !important;
      }
      
      .glass-float,
      .glass-shimmer,
      .glass-pulse {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Get performance recommendations
   */
  getRecommendations() {
    const recommendations = [];

    if (this.isLowEndDevice) {
      recommendations.push(
        'Device detected as low-end. Glass effects are simplified.'
      );
    }

    if (!this.supportsBackdropFilter) {
      recommendations.push(
        'backdrop-filter not supported. Using fallback styles.'
      );
    }

    const glassElements = document.querySelectorAll('[class*="glass-"]').length;
    if (glassElements > 10) {
      recommendations.push(
        `${glassElements} glass elements detected. Consider reducing for better performance.`
      );
    }

    return recommendations;
  }

  /**
   * Force performance mode (for testing)
   */
  setPerformanceMode(mode) {
    document.documentElement.className =
      document.documentElement.className.replace(/glass-\w+-mode/g, '');
    document.documentElement.classList.add(`glass-${mode}-mode`);
    this.performanceMode = mode;
  }
}

// Initialize performance manager when DOM is ready
let performanceManager;

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceManager = new GlassPerformanceManager();
    });
  } else {
    performanceManager = new GlassPerformanceManager();
  }
}

export { performanceManager };

// Utility functions for manual optimization
export const glassUtils = {
  /**
   * Optimize a glass element for performance
   */
  optimizeElement(element) {
    if (!element) return;

    // Skip elements that need fixed positioning (nav, footer)
    const isFixedElement =
      element.closest('nav, footer') ||
      element.matches('nav, footer') ||
      element.id === 'main-nav' ||
      element.id === 'main-footer' ||
      element.classList.contains('nav-bar') ||
      element.classList.contains('glassmorphism-footer');

    if (isFixedElement) {
      // For fixed elements, only add isolation without transforms
      element.style.isolation = 'isolate';
      return;
    }

    // Add performance hints for non-fixed elements only
    element.style.willChange = 'transform';
    element.style.transform = 'translateZ(0)';
    element.style.isolation = 'isolate';

    // Add lazy loading if not visible
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) {
      element.classList.add('glass-lazy');
    }
  },

  /**
   * Batch optimize multiple elements
   */
  optimizeElements(selector = '[class*="glass-"]') {
    document.querySelectorAll(selector).forEach(this.optimizeElement);
  },

  /**
   * Check if element is causing performance issues
   */
  analyzeElement(element) {
    const computedStyle = getComputedStyle(element);
    const issues = [];

    // Check blur value
    const backdropFilter =
      computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;
    if (backdropFilter && backdropFilter.includes('blur(')) {
      const blurValue = parseFloat(
        backdropFilter.match(/blur\((\d+)px\)/)?.[1] || 0
      );
      if (blurValue > 32) {
        issues.push(`High blur value: ${blurValue}px`);
      }
    }

    // Check for stacking
    const zIndex = parseInt(computedStyle.zIndex) || 0;
    if (zIndex > 100) {
      issues.push(`High z-index: ${zIndex}`);
    }

    // Check for transforms
    if (computedStyle.transform === 'none') {
      issues.push('Missing GPU acceleration hint');
    }

    return issues;
  },
};
