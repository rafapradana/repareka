'use client';

import { useState, useCallback, useRef } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

interface RetryState {
  isLoading: boolean;
  error: Error | null;
  attempt: number;
  canRetry: boolean;
}

/**
 * Hook untuk retry mechanism dengan exponential backoff
 * Berguna untuk API calls yang mungkin gagal karena network issues
 */
export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    onRetry,
    shouldRetry = (error, attempt) => {
      // Default: retry untuk network errors dan server errors
      if (error.name === 'NetworkError' || error.name === 'TypeError') return true;
      if ('status' in error && typeof error.status === 'number') {
        return error.status >= 500 || error.status === 408 || error.status === 429;
      }
      return attempt < maxAttempts;
    }
  } = options;

  const [state, setState] = useState<RetryState>({
    isLoading: false,
    error: null,
    attempt: 0,
    canRetry: true
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    const attemptExecution = async (currentAttempt: number): Promise<T | null> => {
      try {
        const result = await asyncFunction();
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          attempt: currentAttempt,
          canRetry: true
        }));
        return result;
      } catch (error) {
        const err = error as Error;
        const nextAttempt = currentAttempt + 1;
        const canRetryAgain = nextAttempt < maxAttempts && shouldRetry(err, nextAttempt);

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err,
          attempt: nextAttempt,
          canRetry: canRetryAgain
        }));

        if (canRetryAgain) {
          onRetry?.(nextAttempt, err);
          
          // Calculate delay dengan exponential backoff
          const currentDelay = Math.min(
            delay * Math.pow(backoffMultiplier, currentAttempt),
            maxDelay
          );

          // Wait sebelum retry
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, currentDelay);
          });

          return attemptExecution(nextAttempt);
        } else {
          throw err;
        }
      }
    };

    try {
      return await attemptExecution(0);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
        canRetry: false
      }));
      return null;
    }
  }, [asyncFunction, maxAttempts, delay, backoffMultiplier, maxDelay, onRetry, shouldRetry]);

  const retry = useCallback(() => {
    if (state.canRetry) {
      return execute();
    }
    return Promise.resolve(null);
  }, [execute, state.canRetry]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState(prev => ({
      ...prev,
      isLoading: false,
      canRetry: false
    }));
  }, []);

  return {
    ...state,
    execute,
    retry,
    cancel
  };
}

/**
 * Hook khusus untuk API calls dengan retry
 */
export function useApiRetry<T>(
  apiCall: () => Promise<T>,
  options: RetryOptions = {}
) {
  return useRetry(apiCall, {
    maxAttempts: 3,
    delay: 1000,
    shouldRetry: (error, attempt) => {
      // Retry untuk network errors
      if (error.name === 'NetworkError' || error.name === 'TypeError') return true;
      
      // Retry untuk specific HTTP status codes
      if ('status' in error && typeof error.status === 'number') {
        const status = error.status;
        return status >= 500 || status === 408 || status === 429 || status === 0;
      }
      
      return attempt < 3;
    },
    ...options
  });
}

/**
 * Utility function untuk membuat retry wrapper
 */
export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) {
  return async (...args: T): Promise<R> => {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoffMultiplier = 2,
      maxDelay = 10000,
      shouldRetry = (error, attempt) => attempt < maxAttempts
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts - 1 || !shouldRetry(lastError, attempt + 1)) {
          throw lastError;
        }

        // Calculate delay dengan exponential backoff
        const currentDelay = Math.min(
          delay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    throw lastError!;
  };
}

/**
 * Hook untuk retry dengan manual trigger
 */
export function useManualRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const retry = useCallback(async () => {
    if (isRetrying) return null;

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      const result = await asyncFunction();
      setLastError(null);
      return result;
    } catch (error) {
      setLastError(error as Error);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [asyncFunction, isRetrying]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    isRetrying,
    retryCount,
    lastError,
    canRetry: !isRetrying && retryCount < (options.maxAttempts ?? 3)
  };
}