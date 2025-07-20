// Web Share API Level 2+ utility with feature detection and fallbacks
// Supports sharing files, URLs, and text with graceful degradation

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface ShareOptions {
  fallbackMessage?: string;
  copyToClipboard?: boolean;
  showToast?: boolean;
}

class WebShareManager {
  private static instance: WebShareManager;

  public static getInstance(): WebShareManager {
    if (!WebShareManager.instance) {
      WebShareManager.instance = new WebShareManager();
    }
    return WebShareManager.instance;
  }

  /**
   * Check if Web Share API is supported
   */
  public isSupported(): boolean {
    return 'share' in navigator;
  }

  /**
   * Check if specific share data can be shared
   */
  public canShare(data: ShareData): boolean {
    if (!this.isSupported()) return false;

    try {
      // Use canShare if available (Level 2+)
      if ('canShare' in navigator) {
        return (navigator as any).canShare(data);
      }

      // Fallback for Level 1 - basic validation
      return !!(data.title || data.text || data.url);
    } catch (error) {
      console.warn('Error checking share capability:', error);
      return false;
    }
  }

  /**
   * Share content using Web Share API with fallbacks
   */
  public async share(
    data: ShareData,
    options: ShareOptions = {}
  ): Promise<boolean> {
    const {
      fallbackMessage,
      copyToClipboard = true,
      showToast = true,
    } = options;

    // Try Web Share API first
    if (this.canShare(data)) {
      try {
        await navigator.share(data);
        if (showToast) {
          this.showToast('Content shared successfully!', 'success');
        }
        return true;
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name === 'AbortError') {
          // User cancelled - this is normal behavior
          return false;
        }
        console.warn('Web Share API error:', error);
        // Fall through to fallback
      }
    }

    // Fallback: Copy to clipboard and show instructions
    return this.handleFallback(data, {
      fallbackMessage,
      copyToClipboard,
      showToast,
    });
  }

  /**
   * Share a file using Web Share API Level 2+
   */
  public async shareFile(
    file: File,
    additionalData: Omit<ShareData, 'files'> = {}
  ): Promise<boolean> {
    const shareData: ShareData = {
      ...additionalData,
      files: [file],
    };

    return this.share(shareData, {
      fallbackMessage:
        'File sharing not supported. The content has been copied to your clipboard.',
      copyToClipboard: true,
      showToast: true,
    });
  }

  /**
   * Share current page
   */
  public async shareCurrentPage(
    customTitle?: string,
    customText?: string
  ): Promise<boolean> {
    const shareData: ShareData = {
      title: customTitle || document.title,
      text: customText || 'Check out this page',
      url: window.location.href,
    };

    return this.share(shareData, {
      fallbackMessage:
        'Sharing not supported. The page URL has been copied to your clipboard.',
      copyToClipboard: true,
      showToast: true,
    });
  }

  /**
   * Fallback handler for unsupported browsers
   */
  private async handleFallback(
    data: ShareData,
    options: ShareOptions
  ): Promise<boolean> {
    const { fallbackMessage, copyToClipboard, showToast } = options;

    if (copyToClipboard) {
      const textToShare = this.formatShareText(data);
      const copied = await this.copyToClipboard(textToShare);

      if (copied && showToast) {
        const message = fallbackMessage || 'Content copied to clipboard!';
        this.showToast(message, 'info');
      }

      return copied;
    }

    // Show fallback UI if no clipboard
    this.showFallbackUI(data);
    return false;
  }

  /**
   * Copy text to clipboard
   */
  private async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Format share data into readable text
   */
  private formatShareText(data: ShareData): string {
    const parts: string[] = [];

    if (data.title) parts.push(data.title);
    if (data.text) parts.push(data.text);
    if (data.url) parts.push(data.url);

    return parts.join('\n\n');
  }

  /**
   * Show a toast notification
   */
  private showToast(
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `share-toast share-toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    // Add styles
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      backgroundColor:
        type === 'success'
          ? '#10b981'
          : type === 'error'
            ? '#ef4444'
            : type === 'warning'
              ? '#f59e0b'
              : '#3b82f6',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: '10000',
      maxWidth: '300px',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease-in-out',
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Show fallback UI for sharing
   */
  private showFallbackUI(data: ShareData): void {
    const shareText = this.formatShareText(data);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'share-fallback-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'share-modal-title');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="share-modal-backdrop" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div class="share-modal-content" style="
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          margin: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        ">
          <h3 id="share-modal-title" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
            Share this content
          </h3>
          <textarea readonly style="
            width: 100%;
            height: 120px;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-family: inherit;
            font-size: 14px;
            resize: none;
            margin-bottom: 16px;
          ">${shareText}</textarea>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="share-copy-btn" style="
              padding: 8px 16px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Copy</button>
            <button class="share-close-btn" style="
              padding: 8px 16px;
              background: #6b7280;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const copyBtn = modal.querySelector('.share-copy-btn');
    const closeBtn = modal.querySelector('.share-close-btn');
    const backdrop = modal.querySelector('.share-modal-backdrop');
    const textarea = modal.querySelector('textarea');

    const closeModal = () => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    };

    copyBtn?.addEventListener('click', async () => {
      if (textarea) {
        const success = await this.copyToClipboard(
          (textarea as HTMLTextAreaElement).value
        );
        if (success) {
          this.showToast('Copied to clipboard!', 'success');
          closeModal();
        }
      }
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    // Focus management
    const firstButton = modal.querySelector('button');
    firstButton?.focus();

    // Escape key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
}

// Export singleton instance
export const webShare = WebShareManager.getInstance();

// Convenience functions
export const shareCurrentPage = (title?: string, text?: string) =>
  webShare.shareCurrentPage(title, text);

export const shareFile = (
  file: File,
  additionalData?: Omit<ShareData, 'files'>
) => webShare.shareFile(file, additionalData);

export const shareContent = (data: ShareData, options?: ShareOptions) =>
  webShare.share(data, options);

export const isWebShareSupported = () => webShare.isSupported();

export const canShareContent = (data: ShareData) => webShare.canShare(data);
