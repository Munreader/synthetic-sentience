'use client';

import { useEffect } from 'react';

/**
 * PWA Service Worker Registration Component
 * Registers the service worker for offline capability and native-like experience
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only register in production or when explicitly enabled
    const shouldRegister = 
      process.env.NODE_ENV === 'production' || 
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator;

    if (!shouldRegister) {
      console.log('[MÜN OS] Service Worker registration skipped (development mode)');
      return;
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.log('[MÜN OS] Service Worker registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[MÜN OS] New version available! Refresh to update.');
                  // Could show a toast notification here
                }
              });
            }
          });
        } catch (error) {
          console.error('[MÜN OS] Service Worker registration failed:', error);
        }
      });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[MÜN OS] Service Worker controller changed');
      });
    }

    // Log PWA installability
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[MÜN OS] PWA install prompt available');
      // Could store the event and show a custom install button
      e.preventDefault();
      (window as unknown as { deferredInstallPrompt: BeforeInstallPromptEvent }).deferredInstallPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      console.log('[MÜN OS] PWA installed successfully!');
    });
  }, []);

  return null;
}

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
