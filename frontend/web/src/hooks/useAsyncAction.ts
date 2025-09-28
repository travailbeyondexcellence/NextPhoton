/**
 * useAsyncAction Hook
 *
 * A custom hook that wraps async operations with automatic loading state management.
 * Provides error handling, success callbacks, and integrates with the global loading system.
 *
 * Features:
 * - Automatic loading state management
 * - Error handling with toast notifications
 * - Success callbacks
 * - Type-safe async function execution
 * - Integration with global loading context
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { toast } from 'sonner';

interface UseAsyncActionOptions<T> {
  // Optional loading message
  loadingMessage?: string;

  // Optional success message or callback
  onSuccess?: ((data: T) => void) | string;

  // Optional error handler
  onError?: ((error: Error) => void) | string;

  // Optional loading key for tracking specific operations
  loadingKey?: string;

  // Whether to show toast notifications
  showToast?: boolean;

  // Whether to use global loader
  useGlobalLoader?: boolean;
}

interface UseAsyncActionReturn<T> {
  // Execute the async action
  execute: (...args: any[]) => Promise<T | undefined>;

  // Local loading state
  isLoading: boolean;

  // Error state
  error: Error | null;

  // Result data
  data: T | null;

  // Reset states
  reset: () => void;
}

/**
 * useAsyncAction Hook
 *
 * Simplifies async operations by handling loading states, errors, and success cases.
 * Integrates with the global loading system for consistent UX.
 *
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns Object with execute function and state values
 *
 * @example
 * ```tsx
 * const { execute, isLoading } = useAsyncAction(
 *   async (userId: string) => {
 *     return await api.fetchUser(userId);
 *   },
 *   {
 *     loadingMessage: 'Fetching user data...',
 *     onSuccess: 'User data loaded successfully!',
 *     onError: 'Failed to fetch user data',
 *     useGlobalLoader: true
 *   }
 * );
 *
 * // In component
 * <button onClick={() => execute('user123')} disabled={isLoading}>
 *   Load User
 * </button>
 * ```
 */
export function useAsyncAction<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncActionOptions<T> = {}
): UseAsyncActionReturn<T> {
  const {
    loadingMessage = 'Processing...',
    onSuccess,
    onError,
    loadingKey,
    showToast = true,
    useGlobalLoader = true,
  } = options;

  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  /**
   * Execute the async action with automatic state management
   */
  const execute = useCallback(async (...args: any[]): Promise<T | undefined> => {
    // Reset error state
    setError(null);
    setIsLoading(true);

    // Start global loading if enabled
    let globalLoadingKey: string | undefined;
    if (useGlobalLoader) {
      globalLoadingKey = startLoading(loadingKey, loadingMessage) as string;
    }

    try {
      // Execute the async function
      const result = await asyncFunction(...args);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(result);

        // Handle success
        if (onSuccess) {
          if (typeof onSuccess === 'string') {
            if (showToast) {
              toast.success(onSuccess);
            }
          } else {
            onSuccess(result);
          }
        }
      }

      return result;
    } catch (err) {
      // Handle error
      const error = err instanceof Error ? err : new Error(String(err));

      if (isMountedRef.current) {
        setError(error);

        // Handle error callback
        if (onError) {
          if (typeof onError === 'string') {
            if (showToast) {
              toast.error(onError);
            }
          } else {
            onError(error);
          }
        } else if (showToast) {
          // Default error message if no custom handler
          toast.error(error.message || 'An error occurred');
        }
      }

      // Re-throw to allow handling in component
      throw error;
    } finally {
      // Clean up loading states
      if (isMountedRef.current) {
        setIsLoading(false);
      }

      // Stop global loading
      if (useGlobalLoader && globalLoadingKey) {
        stopLoading(globalLoadingKey);
      }
    }
  }, [
    asyncFunction,
    loadingMessage,
    onSuccess,
    onError,
    loadingKey,
    showToast,
    useGlobalLoader,
    startLoading,
    stopLoading,
  ]);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  // Cleanup on unmount
  useRef(() => {
    return () => {
      isMountedRef.current = false;
    };
  });

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

/**
 * useAsyncCallback Hook
 *
 * Simplified version of useAsyncAction for callbacks without return values.
 * Perfect for form submissions, delete operations, etc.
 *
 * @example
 * ```tsx
 * const handleDelete = useAsyncCallback(
 *   async () => {
 *     await api.deleteItem(itemId);
 *     router.push('/items');
 *   },
 *   {
 *     loadingMessage: 'Deleting item...',
 *     onSuccess: 'Item deleted successfully!',
 *   }
 * );
 *
 * <button onClick={handleDelete} disabled={isDeleting}>
 *   Delete Item
 * </button>
 * ```
 */
export function useAsyncCallback(
  callback: () => Promise<void>,
  options: Omit<UseAsyncActionOptions<void>, 'onSuccess'> & {
    onSuccess?: (() => void) | string;
  } = {}
) {
  const { execute, isLoading, error, reset } = useAsyncAction(callback, options);

  return {
    execute: useCallback(() => execute(), [execute]),
    isLoading,
    error,
    reset,
  };
}