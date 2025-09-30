/**
 * Apollo Provider Component
 *
 * This component wraps the application with Apollo Client provider,
 * making GraphQL operations available throughout the app.
 * It handles client-side initialization and prevents SSR issues.
 * It also warms up the GraphQL endpoint to prevent cold start delays.
 */

'use client';

import { ApolloProvider as BaseApolloProvider, gql } from '@apollo/client';
import { apolloClient } from './client';
import { ReactNode, useEffect, useState } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

// Simple health check query to warm up the GraphQL endpoint
const WARMUP_QUERY = gql`
  query WarmupQuery {
    __typename
  }
`;

export function ApolloProvider({ children }: ApolloProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [warmedUp, setWarmedUp] = useState(false);

  useEffect(() => {
    // Ensure client-side only initialization
    setMounted(true);

    // Warm up the GraphQL endpoint on mount
    const warmupEndpoint = async () => {
      try {
        console.log('[ApolloProvider] Warming up GraphQL endpoint...');
        await apolloClient.query({
          query: WARMUP_QUERY,
          fetchPolicy: 'network-only',
        });
        console.log('[ApolloProvider] GraphQL endpoint ready');
        setWarmedUp(true);
      } catch (error) {
        console.error('[ApolloProvider] Warmup failed:', error);
        // Continue anyway - queries will handle their own errors
        setWarmedUp(true);
      }
    };

    warmupEndpoint();
  }, []);

  // Show children immediately but wrapped in provider
  // This prevents blank screens during mounting
  return (
    <BaseApolloProvider client={apolloClient}>
      <div className="min-h-screen">
        {children}
      </div>
    </BaseApolloProvider>
  );
}