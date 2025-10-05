/**
 * Loading Example Component
 *
 * This component demonstrates various ways to use the global loading system
 * in your application. Reference this when implementing loading states.
 */

'use client';

import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { toast } from 'sonner';

export const LoadingExamples: React.FC = () => {
  const { startLoading, stopLoading, withLoading, isLoading } = useLoading();

  // Example 1: Manual loading control
  const handleManualLoading = async () => {
    // Start loading with a custom message
    startLoading('manual-operation', 'Processing your request...');

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Operation completed!');
    } catch (error) {
      toast.error('Operation failed!');
    } finally {
      // Always stop loading in finally block
      stopLoading('manual-operation');
    }
  };

  // Example 2: Using withLoading wrapper
  const handleWithLoading = async () => {
    await withLoading(
      async () => {
        // Your async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Data fetched successfully!');
      },
      'fetch-data', // Loading key
      'Fetching data...' // Loading message
    );
  };

  // Example 3: Using useAsyncAction hook
  const { execute: fetchUserData } = useAsyncAction(
    async (userId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: userId, name: 'John Doe', email: 'john@example.com' };
    },
    {
      loadingMessage: 'Loading user profile...',
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.name}!`);
      },
      onError: (error) => {
        toast.error('Failed to load user data');
      },
      useGlobalLoader: true,
    }
  );

  // Example 4: Form submission with loading
  const { execute: submitForm } = useAsyncAction(
    async (formData: any) => {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Process form data
      console.log('Form submitted:', formData);
    },
    {
      loadingMessage: 'Submitting form...',
      onSuccess: 'Form submitted successfully!',
      onError: 'Failed to submit form',
    }
  );

  // Example 5: Multiple concurrent operations
  const handleMultipleOperations = async () => {
    // Start multiple loading operations
    const loadingKeys = ['op1', 'op2', 'op3'];
    loadingKeys.forEach(key => startLoading(key, `Loading data set ${key}...`));

    try {
      // Simulate multiple async operations
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 1000)),
        new Promise(resolve => setTimeout(resolve, 1500)),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);

      toast.success('All operations completed!');
    } finally {
      // Stop all loading operations
      loadingKeys.forEach(key => stopLoading(key));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Loading System Examples</h2>

      {/* Display current loading state */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm">
          Global Loading State: {isLoading ? 'Loading...' : 'Idle'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Example 1: Manual Control */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Manual Loading Control</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manually start and stop loading states
          </p>
          <button
            onClick={handleManualLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Start Manual Loading
          </button>
        </div>

        {/* Example 2: With Loading Wrapper */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">withLoading Wrapper</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wrap async operations with automatic loading
          </p>
          <button
            onClick={handleWithLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Fetch with Loading
          </button>
        </div>

        {/* Example 3: useAsyncAction Hook */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">useAsyncAction Hook</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hook with built-in loading and error handling
          </p>
          <button
            onClick={() => fetchUserData('user123')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Load User Data
          </button>
        </div>

        {/* Example 4: Form Submission */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Form Submission</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Submit forms with loading state
          </p>
          <button
            onClick={() => submitForm({ name: 'Test', email: 'test@example.com' })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Submit Form
          </button>
        </div>

        {/* Example 5: Multiple Operations */}
        <div className="p-4 border rounded-lg md:col-span-2">
          <h3 className="font-semibold mb-2">Multiple Concurrent Operations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Handle multiple loading states simultaneously
          </p>
          <button
            onClick={handleMultipleOperations}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Run Multiple Operations
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-4">How to Use the Loading System</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">1.</span>
            <span>Import <code className="bg-background px-1 rounded">useLoading</code> or <code className="bg-background px-1 rounded">useAsyncAction</code> in your component</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">2.</span>
            <span>Use <code className="bg-background px-1 rounded">withLoading</code> to wrap any async operation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">3.</span>
            <span>The global loader will automatically appear during operations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">4.</span>
            <span>Use loading keys to track specific operations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">5.</span>
            <span>Always stop loading in finally blocks to prevent stuck states</span>
          </li>
        </ul>
      </div>
    </div>
  );
};