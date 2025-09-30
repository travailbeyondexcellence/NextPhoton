/**
 * Apollo Provider Component
 *
 * This component wraps the application with Apollo Client provider,
 * making GraphQL operations available throughout the app.
 * It handles client-side initialization and prevents SSR issues.
 */

'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { apolloClient } from './client';
import { ReactNode, useEffect, useState } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure client-side only initialization
    setMounted(true);
  }, []);

  // Prevent SSR hydration issues by rendering null on server
  if (!mounted) {
    return null;
  }

  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
}