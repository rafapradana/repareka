'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  type?: 'general' | 'network' | 'auth' | 'notFound';
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
}

/**
 * Komponen fallback UI untuk berbagai jenis error
 * Dapat dikustomisasi berdasarkan tipe error yang terjadi
 */
export function ErrorFallback({
  error,
  resetError,
  type = 'general',
  title,
  message,
  showRetry = true,
  showHome = true
}: ErrorFallbackProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          defaultTitle: 'Koneksi Bermasalah',
          defaultMessage: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.',
          iconColor: 'text-orange-500'
        };
      case 'auth':
        return {
          icon: AlertTriangle,
          defaultTitle: 'Masalah Autentikasi',
          defaultMessage: 'Sesi Anda telah berakhir atau terjadi masalah autentikasi. Silakan login kembali.',
          iconColor: 'text-yellow-500'
        };
      case 'notFound':
        return {
          icon: AlertTriangle,
          defaultTitle: 'Halaman Tidak Ditemukan',
          defaultMessage: 'Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.',
          iconColor: 'text-blue-500'
        };
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: 'Terjadi Kesalahan',
          defaultMessage: 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi dukungan.',
          iconColor: 'text-destructive'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <Icon className={`h-12 w-12 ${config.iconColor}`} />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {title || config.defaultTitle}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {message || config.defaultMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && resetError && (
            <button
              onClick={resetError}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          )}
          
          {showHome && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          )}
        </div>

        {/* Network status indicator untuk network errors */}
        {type === 'network' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>Offline</span>
            </div>
          </div>
        )}

        {/* Detail error untuk development */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Detail Error (Development)
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
              {error.toString()}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Komponen khusus untuk network error
 */
export function NetworkErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      type="network"
      resetError={resetError}
      showHome={false}
    />
  );
}

/**
 * Komponen khusus untuk auth error
 */
export function AuthErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      type="auth"
      resetError={resetError}
      showRetry={false}
    />
  );
}

/**
 * Komponen khusus untuk 404 error
 */
export function NotFoundErrorFallback() {
  return (
    <ErrorFallback
      type="notFound"
      showRetry={false}
    />
  );
}