// View Transitions API utility with feature detection and accessibility support
// Provides smooth page transitions with fallbacks for unsupported browsers

interface ViewTransitionOptions {
  skipTransition?: boolean;
  transitionName?: string;
  duration?: number;
  respectReducedMotion?: boolean;
}

interface ViewTransitionConfig {
  element?: Element;
  className?: string;
  duration?: number;
  easing?: string;
}

class ViewTransitionsManager {
  private static instance: ViewTransitionsManager;
  private isTransitioning = false;
  private prefersReducedMotion = false;

  public static getInstance(): ViewTransitionsManager {
    if (!ViewTransitionsManager.instance) {
      ViewTransitionsManager.instance = new ViewTransitionsManager();
    }
    return ViewTransitionsManager.instance;
  }

  constructor() {
    this.initializeReducedMotionDetection();
    this.setupGlobalStyles();
  }

  /**
   * Check if View Transitions API is supported
   */
  public isSupported(): boolean {
    return (
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    );
  }

  /**
   * Initialize reduced motion detection
   */
  private initializeReducedMotionDetection(): void {
    // Check initial preference
    this.updateReducedMotionPreference();

    // Listen for changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', () => {
        this.updateReducedMotionPreference();
      });
    }
  }

  /**
   * Update reduced motion preference
   */
  private updateReducedMotionPreference(): void {
    if (window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }
  }

  /**
   * Setup global CSS for view transitions
   */
  private setupGlobalStyles(): void {
    if (typeof document === 'undefined') return;

    const styleId = 'view-transitions-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* View Transitions API styles */
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 0.3s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.01s !important;
        }
      }

      /* Custom transition for page navigation */
      ::view-transition-old(main-content) {
        animation: slide-out-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      ::view-transition-new(main-content) {
        animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Slide animations */
      @keyframes slide-out-left {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(-30px);
          opacity: 0;
        }
      }

      @keyframes slide-in-right {
        from {
          transform: translateX(30px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Fallback transitions for unsupported browsers */
      .view-transition-fallback {
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .view-transition-fallback.transitioning-out {
        opacity: 0;
        transform: translateX(-30px);
      }

      .view-transition-fallback.transitioning-in {
        opacity: 0;
        transform: translateX(30px);
      }

      /* Reduced motion fallback */
      @media (prefers-reduced-motion: reduce) {
        .view-transition-fallback {
          transition: opacity 0.01s !important;
        }
        
        .view-transition-fallback.transitioning-out,
        .view-transition-fallback.transitioning-in {
          transform: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Start a view transition with callback
   */
  public async startTransition(
    updateCallback: () => void | Promise<void>,
    options: ViewTransitionOptions = {}
  ): Promise<void> {
    const { skipTransition = false, respectReducedMotion = true } = options;

    // Skip if already transitioning
    if (this.isTransitioning) {
      console.warn('View transition already in progress');
      return;
    }

    // Skip if reduced motion is preferred and respected
    if (respectReducedMotion && this.prefersReducedMotion) {
      await updateCallback();
      return;
    }

    // Skip if explicitly disabled
    if (skipTransition) {
      await updateCallback();
      return;
    }

    this.isTransitioning = true;

    try {
      if (this.isSupported()) {
        // Use native View Transitions API
        const transition = (document as any).startViewTransition(async () => {
          await updateCallback();
        });

        // Wait for transition to complete
        await transition.finished;
      } else {
        // Fallback for unsupported browsers
        await this.fallbackTransition(updateCallback, options);
      }
    } catch (error) {
      console.warn('View transition error:', error);
      // Ensure callback runs even if transition fails
      await updateCallback();
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Navigate with view transition
   */
  public async navigateWithTransition(
    url: string,
    _options: ViewTransitionOptions = {}
  ): Promise<void> {
    // Don't use transitions for external links
    if (url.startsWith('http') && !url.includes(window.location.origin)) {
      window.location.href = url;
      return;
    }

    // For static sites, always use standard navigation
    // View transitions can cause routing issues with static site generators
    window.location.href = url;
  }

  /**
   * Fallback transition for unsupported browsers
   */
  private async fallbackTransition(
    updateCallback: () => void | Promise<void>,
    options: ViewTransitionOptions = {}
  ): Promise<void> {
    const mainContent = document.querySelector('main') || document.body;

    if (!mainContent) {
      await updateCallback();
      return;
    }

    const duration = this.prefersReducedMotion ? 10 : options.duration || 300;

    // Add fallback class
    mainContent.classList.add('view-transition-fallback');

    // Transition out
    mainContent.classList.add('transitioning-out');

    // Wait for transition
    await this.wait(duration / 2);

    // Update content
    await updateCallback();

    // Transition in
    mainContent.classList.remove('transitioning-out');
    mainContent.classList.add('transitioning-in');

    // Wait for transition to complete
    await this.wait(duration / 2);

    // Clean up
    mainContent.classList.remove(
      'transitioning-in',
      'view-transition-fallback'
    );
  }

  /**
   * Set up view transition name for an element
   */
  public setTransitionName(element: Element, name: string): void {
    if (this.isSupported()) {
      (element as any).style.viewTransitionName = name;
    } else {
      // Store name for fallback handling
      element.setAttribute('data-transition-name', name);
    }
  }

  /**
   * Remove view transition name from an element
   */
  public removeTransitionName(element: Element): void {
    if (this.isSupported()) {
      (element as any).style.viewTransitionName = '';
    } else {
      element.removeAttribute('data-transition-name');
    }
  }

  /**
   * Create a smooth element transition
   */
  public async transitionElement(
    element: Element,
    updateCallback: () => void | Promise<void>,
    config: ViewTransitionConfig = {}
  ): Promise<void> {
    const { className, duration = 300 } = config;

    if (className) {
      this.setTransitionName(element, className);
    }

    await this.startTransition(updateCallback, { duration });

    if (className) {
      // Clean up after a delay to ensure transition completes
      setTimeout(() => {
        this.removeTransitionName(element);
      }, duration + 100);
    }
  }

  /**
   * Check if currently transitioning
   */
  public isCurrentlyTransitioning(): boolean {
    return this.isTransitioning;
  }

  /**
   * Utility to wait for a specified time
   */
  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Setup automatic transitions for links
   * Disabled for static sites to prevent routing issues
   */
  public setupAutoTransitions(_selector: string = 'a[href^="/"]'): void {
    if (typeof document === 'undefined') return;

    // Remove existing listeners to prevent interference
    document.removeEventListener('click', this.handleLinkClick);

    // Don't add new listener for static sites - let browser handle navigation naturally
    console.log(
      'View transitions auto-setup disabled for static site compatibility'
    );
  }

  /**
   * Handle link clicks for automatic transitions
   */
  private handleLinkClick(event: Event): void {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;

    if (!link) return;

    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    // Check if it's an internal link
    if (href.startsWith('/') || href.includes(window.location.origin)) {
      event.preventDefault();

      this.navigateWithTransition(href, {
        respectReducedMotion: true,
      });
    }
  }
}

// Export singleton instance
export const viewTransitions = ViewTransitionsManager.getInstance();

// Convenience functions
export const startViewTransition = (
  updateCallback: () => void | Promise<void>,
  options?: ViewTransitionOptions
) => viewTransitions.startTransition(updateCallback, options);

export const navigateWithTransition = (
  url: string,
  options?: ViewTransitionOptions
) => viewTransitions.navigateWithTransition(url, options);

export const setTransitionName = (element: Element, name: string) =>
  viewTransitions.setTransitionName(element, name);

export const removeTransitionName = (element: Element) =>
  viewTransitions.removeTransitionName(element);

export const transitionElement = (
  element: Element,
  updateCallback: () => void | Promise<void>,
  config?: ViewTransitionConfig
) => viewTransitions.transitionElement(element, updateCallback, config);

export const isViewTransitionsSupported = () => viewTransitions.isSupported();

export const setupAutoTransitions = (selector?: string) =>
  viewTransitions.setupAutoTransitions(selector);

// Auto-setup on load (if in browser environment)
if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    viewTransitions.setupAutoTransitions();
  });
} else if (typeof document !== 'undefined') {
  viewTransitions.setupAutoTransitions();
}
