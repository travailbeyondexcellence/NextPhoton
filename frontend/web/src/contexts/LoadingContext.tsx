/**
 * Global Loading Context
 *
 * Provides a centralized loading state management system for the entire application.
 * This context manages loading states for async operations and displays appropriate
 * loaders/shimmers during transition periods.
 *
 * Features:
 * - Global loading state management
 * - Multiple concurrent loading operations tracking
 * - Customizable loading messages
 * - Automatic loading overlay display
 * - Loading state persistence across components
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Define the shape of our loading context
interface LoadingContextType {
  // Check if any loading operation is active
  isLoading: boolean;

  // Get loading state for a specific key
  isLoadingKey: (key: string) => boolean;

  // Start a loading operation with optional message
  startLoading: (key?: string, message?: string) => void;

  // Stop a loading operation
  stopLoading: (key?: string) => void;

  // Execute an async function with automatic loading state management
  withLoading: <T>(fn: () => Promise<T>, key?: string, message?: string) => Promise<T>;

  // Get current loading message
  loadingMessage: string | null;

  // Get all active loading keys
  activeLoadingKeys: Set<string>;

  // Clear all loading states (emergency reset)
  clearAllLoading: () => void;
}

// Create the context with undefined default
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Custom hook to use the loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

/**
 * LoadingProvider Component
 *
 * Wraps the application and provides loading state management functionality
 * to all child components. Tracks multiple concurrent loading operations
 * and manages their states independently.
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // Track active loading operations by key
  const [loadingKeys, setLoadingKeys] = useState<Map<string, string>>(new Map());

  // Reference to track component mount state
  const mountedRef = useRef(true);

  // Counter for generating unique keys when none provided
  const keyCounterRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Start a loading operation
   *
   * @param key - Unique identifier for this loading operation (optional)
   * @param message - Message to display during loading (optional)
   */
  const startLoading = useCallback((key?: string, message?: string) => {
    const loadingKey = key || `loading_${++keyCounterRef.current}`;

    console.log('[Loading] Starting:', loadingKey, message); // Debug log

    setLoadingKeys(prev => {
      const newMap = new Map(prev);
      newMap.set(loadingKey, message || 'Loading...');
      console.log('[Loading] Active keys:', Array.from(newMap.keys())); // Debug log
      return newMap;
    });

    // Return the key for reference
    return loadingKey;
  }, []);

  /**
   * Stop a loading operation
   *
   * @param key - Identifier of the loading operation to stop
   */
  const stopLoading = useCallback((key?: string) => {
    console.log('[Loading] Stopping:', key); // Debug log

    if (!key) {
      // If no key provided, clear the most recent loading operation
      setLoadingKeys(prev => {
        if (prev.size === 0) return prev;
        const newMap = new Map(prev);
        const lastKey = Array.from(newMap.keys()).pop();
        if (lastKey) newMap.delete(lastKey);
        console.log('[Loading] Remaining keys:', Array.from(newMap.keys())); // Debug log
        return newMap;
      });
      return;
    }

    setLoadingKeys(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      console.log('[Loading] Remaining keys:', Array.from(newMap.keys())); // Debug log
      return newMap;
    });
  }, []);

  /**
   * Execute an async function with automatic loading state management
   *
   * @param fn - Async function to execute
   * @param key - Optional key for this loading operation
   * @param message - Optional loading message
   * @returns Promise resolving to the function's return value
   */
  const withLoading = useCallback(async <T,>(
    fn: () => Promise<T>,
    key?: string,
    message?: string
  ): Promise<T> => {
    const loadingKey = startLoading(key, message);

    try {
      const result = await fn();
      return result;
    } finally {
      // Always stop loading, even if the function throws
      if (mountedRef.current) {
        stopLoading(loadingKey);
      }
    }
  }, [startLoading, stopLoading]);

  /**
   * Check if a specific loading operation is active
   *
   * @param key - Key to check
   * @returns true if the loading operation is active
   */
  const isLoadingKey = useCallback((key: string): boolean => {
    return loadingKeys.has(key);
  }, [loadingKeys]);

  /**
   * Clear all loading states
   * Emergency reset function to clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    setLoadingKeys(new Map());
  }, []);

  // Compute derived values
  const isLoading = loadingKeys.size > 0;
  const loadingMessage = loadingKeys.size > 0
    ? Array.from(loadingKeys.values())[loadingKeys.size - 1]
    : null;
  const activeLoadingKeys = new Set(loadingKeys.keys());

  const contextValue: LoadingContextType = {
    isLoading,
    isLoadingKey,
    startLoading,
    stopLoading,
    withLoading,
    loadingMessage,
    activeLoadingKeys,
    clearAllLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Higher-order component to inject loading props into a component
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with loading props
 */
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P & { loading: LoadingContextType }>
) {
  return function WithLoadingComponent(props: P) {
    const loading = useLoading();
    return <Component {...props} loading={loading} />;
  };
}