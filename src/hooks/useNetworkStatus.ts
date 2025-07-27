'use client';

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

/**
 * Hook untuk monitoring network status dan connection quality
 */
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false
  });

  const updateNetworkStatus = useCallback(() => {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const status: NetworkStatus = {
      isOnline: navigator.onLine,
      isSlowConnection: false
    };

    if (connection) {
      status.connectionType = connection.type;
      status.effectiveType = connection.effectiveType;
      status.downlink = connection.downlink;
      status.rtt = connection.rtt;

      // Deteksi slow connection
      status.isSlowConnection = 
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        (connection.downlink && connection.downlink < 0.5) ||
        (connection.rtt && connection.rtt > 2000);
    }

    setNetworkStatus(status);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial check
    updateNetworkStatus();

    // Event listeners
    const handleOnline = () => {
      updateNetworkStatus();
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false
      }));
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateNetworkStatus]);

  return networkStatus;
}

/**
 * Hook untuk retry ketika network kembali online
 */
export function useOnlineRetry(callback: () => void | Promise<void>) {
  const { isOnline } = useNetworkStatus();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      // Network kembali online, jalankan callback
      callback();
      setWasOffline(false);
    }
  }, [isOnline, wasOffline, callback]);

  return { isOnline, wasOffline };
}

/**
 * Hook untuk adaptive loading berdasarkan connection quality
 */
export function useAdaptiveLoading() {
  const { isSlowConnection, effectiveType } = useNetworkStatus();

  const getImageQuality = useCallback(() => {
    if (isSlowConnection || effectiveType === '2g' || effectiveType === 'slow-2g') {
      return 'low';
    }
    if (effectiveType === '3g') {
      return 'medium';
    }
    return 'high';
  }, [isSlowConnection, effectiveType]);

  const shouldPreload = useCallback(() => {
    return !isSlowConnection && effectiveType !== '2g' && effectiveType !== 'slow-2g';
  }, [isSlowConnection, effectiveType]);

  const getOptimalPageSize = useCallback(() => {
    if (isSlowConnection || effectiveType === '2g' || effectiveType === 'slow-2g') {
      return 5; // Load fewer items
    }
    if (effectiveType === '3g') {
      return 10;
    }
    return 20; // Load more items for fast connections
  }, [isSlowConnection, effectiveType]);

  return {
    imageQuality: getImageQuality(),
    shouldPreload: shouldPreload(),
    optimalPageSize: getOptimalPageSize(),
    isSlowConnection
  };
}