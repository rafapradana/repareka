'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, Shield, Search } from 'lucide-react';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { classifyError } from '@/lib/utils/errorHandler';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: Error | any;
  onRetry?: () => void | Promise<void>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

/**
 * Komponen untuk menampilkan error state dengan retry functionality
 */
export function ErrorState({ 
  error, 
  onRetry, 
  className,
  size = 'md',
  showDetails = false
}: ErrorStateProps) {
  const { isOnline } = useNetworkStatus();
  const classified = classifyError(error);
  
  const { execute: executeRetry, isLoading: isRetrying } = useRetry(
    async () => {
      if (onRetry) {
        await onRetry();
      }
    },
    {
      maxAttempts: 3,
      delay: 1000
    }
  );

  const getErrorIcon = () => {
    switch (classified.type) {
      case 'network':
        return WifiOff;
      case 'auth':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const getErrorColor = () => {
    switch (classified.type) {
      case 'network':
        return 'text-orange-500';
      case 'auth':
        return 'text-yellow-500';
      default:
        return 'text-destructive';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'min-h-[200px] p-4',
          icon: 'h-8 w-8',
          title: 'text-lg',
          message: 'text-sm',
          button: 'px-3 py-1.5 text-sm'
        };
      case 'lg':
        return {
          container: 'min-h-[600px] p-8',
          icon: 'h-16 w-16',
          title: 'text-2xl',
          message: 'text-base',
          button: 'px-6 py-3 text-base'
        };
      default:
        return {
          container: 'min-h-[400px] p-6',
          icon: 'h-12 w-12',
          title: 'text-xl',
          message: 'text-sm',
          button: 'px-4 py-2 text-sm'
        };
    }
  };

  const Icon = getErrorIcon();
  const sizeClasses = getSizeClasses();

  return (
    <div className={cn(
      'flex items-center justify-center',
      sizeClasses.container,
      className
    )}>
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <Icon className={cn(sizeClasses.icon, getErrorColor())} />
        </div>
        
        <h3 className={cn('font-semibold text-foreground mb-2', sizeClasses.title)}>
          {classified.type === 'network' && !isOnline ? 'Tidak Ada Koneksi' : 'Terjadi Kesalahan'}
        </h3>
        
        <p className={cn('text-muted-foreground mb-6', sizeClasses.message)}>
          {classified.message}
        </p>

        {/* Network status indicator */}
        {classified.type === 'network' && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className={cn(
              'w-2 h-2 rounded-full',
              isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'
            )}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        )}

        {/* Retry button */}
        {onRetry && classified.isRetryable && (
          <button
            onClick={() => executeRetry()}
            disabled={isRetrying}
            className={cn(
              'inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses.button
            )}
          >
            <RefreshCw className={cn('h-4 w-4', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Mencoba Lagi...' : 'Coba Lagi'}
          </button>
        )}

        {/* Error details untuk development */}
        {showDetails && process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Detail Error (Development)
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
              {JSON.stringify({
                type: classified.type,
                message: classified.message,
                statusCode: classified.statusCode,
                isRetryable: classified.isRetryable,
                stack: error.stack
              }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * Komponen khusus untuk empty state
 */
export function EmptyState({
  title = 'Tidak Ada Data',
  message = 'Belum ada data untuk ditampilkan.',
  icon: Icon = Search,
  action,
  className
}: {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}) {
  return (
    <div className={cn('min-h-[300px] flex items-center justify-center p-6', className)}>
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          {message}
        </p>

        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Komponen untuk loading state dengan error fallback
 */
export function LoadingWithError({
  isLoading,
  error,
  onRetry,
  children,
  loadingComponent,
  className
}: {
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}) {
  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}