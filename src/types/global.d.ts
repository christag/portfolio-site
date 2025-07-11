/**
 * Global type declarations for glassmorphism performance utilities
 */

import type { GlassPerformanceManager } from '../components/utils/performance.js';

declare global {
  interface Window {
    glassPerformance?: GlassPerformanceManager;
    glassUtils?: {
      optimizeElement: (element: Element) => void;
      optimizeElements: (selector?: string) => void;
      analyzeElement: (element: Element) => string[];
    };
  }
}

export {};
