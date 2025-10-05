/**
 * Test Loader Page
 *
 * This page allows you to test the global loading system
 * to ensure it's working correctly.
 */

'use client';

import React, { useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { LoadingButton, AsyncButton } from '@/components/LoadingButton';
import { MinimalisticLoader } from '@/components/MinimalisticLoader';

export default function TestLoaderPage() {
  const { startLoading, stopLoading, withLoading, isLoading } = useLoading();
  const [testResult, setTestResult] = useState<string>('');

  // Test 1: Direct loading control
  const testDirectLoading = () => {
    console.log('Test 1: Starting direct loading test');
    startLoading('test-direct', 'Testing direct loading for 3 seconds...');

    setTimeout(() => {
      console.log('Test 1: Stopping direct loading');
      stopLoading('test-direct');
      setTestResult('Direct loading test completed!');
    }, 3000);
  };

  // Test 2: Using withLoading wrapper
  const testWithLoading = async () => {
    console.log('Test 2: Starting withLoading test');
    await withLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setTestResult('withLoading test completed!');
      },
      'test-with-loading',
      'Testing withLoading wrapper for 3 seconds...'
    );
  };

  // Test 3: Using useAsyncAction hook
  const { execute: testAsyncAction } = useAsyncAction(
    async () => {
      console.log('Test 3: Starting async action test');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return 'Async action completed!';
    },
    {
      loadingMessage: 'Testing useAsyncAction hook for 3 seconds...',
      onSuccess: (data) => {
        setTestResult(data);
      },
      useGlobalLoader: true,
    }
  );

  // Test 4: Simulate API call
  const testAPICall = async () => {
    console.log('Test 4: Starting API simulation');
    startLoading('api-call', 'Simulating API call...');

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate processing
      startLoading('api-process', 'Processing response...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      stopLoading('api-process');

      setTestResult('API call simulation completed!');
    } finally {
      stopLoading('api-call');
    }
  };

  // Test 5: Multiple concurrent operations
  const testConcurrent = async () => {
    console.log('Test 5: Starting concurrent operations');
    startLoading('op1', 'Operation 1 running...');
    startLoading('op2', 'Operation 2 running...');
    startLoading('op3', 'Operation 3 running...');

    // Stop them one by one
    setTimeout(() => {
      console.log('Stopping operation 1');
      stopLoading('op1');
    }, 1000);

    setTimeout(() => {
      console.log('Stopping operation 2');
      stopLoading('op2');
    }, 2000);

    setTimeout(() => {
      console.log('Stopping operation 3');
      stopLoading('op3');
      setTestResult('All concurrent operations completed!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Global Loader Test Page</h1>

        {/* Status Display */}
        <div className="mb-8 p-4 rounded-lg bg-muted">
          <h2 className="text-lg font-semibold mb-2">Current Status:</h2>
          <p className="text-sm">
            Global Loading: <span className="font-mono">{isLoading ? 'TRUE ✅' : 'FALSE ❌'}</span>
          </p>
          {testResult && (
            <p className="text-sm mt-2 text-green-600">
              Result: {testResult}
            </p>
          )}
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Test 1: Direct Control</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manually start and stop loading with custom message
            </p>
            <button
              onClick={testDirectLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test Direct Loading (3s)
            </button>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Test 2: withLoading</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use withLoading wrapper for automatic management
            </p>
            <button
              onClick={testWithLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test withLoading (3s)
            </button>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Test 3: useAsyncAction</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use the async action hook with loading
            </p>
            <button
              onClick={() => testAsyncAction()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test Async Hook (3s)
            </button>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Test 4: API Simulation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Simulate an API call with multiple stages
            </p>
            <button
              onClick={testAPICall}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test API Call (3s)
            </button>
          </div>

          <div className="p-6 border rounded-lg md:col-span-2">
            <h3 className="font-semibold mb-2">Test 5: Concurrent Operations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run multiple loading operations simultaneously
            </p>
            <button
              onClick={testConcurrent}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test Concurrent (3s total)
            </button>
          </div>
        </div>

        {/* Demo: Different Loader Variants */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h2 className="font-semibold mb-4">Loader Variants Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {(['spinner', 'dots', 'pulse', 'bars', 'orbit'] as const).map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-2 p-4 border rounded">
                <MinimalisticLoader
                  variant={variant}
                  size="md"
                  showOverlay={false}
                  speed="normal"
                />
                <span className="text-xs capitalize">{variant}</span>
              </div>
            ))}
          </div>

          {/* Loading Buttons Demo */}
          <h3 className="font-semibold mb-3">Loading Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <AsyncButton
              variant="primary"
              onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                setTestResult('Async button completed!');
              }}
              loadingMessage="Processing..."
            >
              Async Button
            </AsyncButton>

            <LoadingButton
              variant="secondary"
              isLoading={isLoading}
              loadingText="Loading..."
            >
              {isLoading ? 'Loading State' : 'Normal State'}
            </LoadingButton>

            <AsyncButton
              variant="outline"
              size="sm"
              onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 1500));
              }}
            >
              Small Button
            </AsyncButton>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h2 className="font-semibold mb-4">Debug Instructions:</h2>
          <ol className="space-y-2 text-sm">
            <li>1. Open browser console (F12)</li>
            <li>2. Click any test button above</li>
            <li>3. Watch for console logs starting with [Loading] and [GlobalLoader]</li>
            <li>4. The loader should appear as a full-screen overlay</li>
            <li>5. If loader doesn't appear, check console for errors</li>
          </ol>

          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded">
            <p className="text-sm font-medium">⚠️ Troubleshooting:</p>
            <p className="text-xs mt-1">If the loader isn't showing, check that:</p>
            <ul className="text-xs mt-1 ml-4 list-disc">
              <li>LoadingProvider wraps your app in layout.tsx</li>
              <li>GlobalLoader component is rendered in layout.tsx</li>
              <li>Console shows [Loading] Started messages</li>
              <li>No CSS is hiding the loader (z-index issues)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}