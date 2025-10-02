/**
 * Apollo Module Index
 *
 * Central export point for all Apollo Client related functionality.
 * This includes the client instance, provider component, queries, mutations,
 * and helper functions for state management and cache manipulation.
 */

// Export Apollo Client instance and helpers
export {
  apolloClient,
  authHelpers,
  cacheHelpers,
  isAuthenticatedVar,
  currentUserVar,
  selectedBatchVar
} from './client';

// Export Apollo Provider component
export { ApolloProvider } from './ApolloProvider';

// Export all GraphQL queries
export * from './queries';

// Export all GraphQL mutations
export * from './mutations';

// Re-export commonly used Apollo hooks for convenience
export {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
  useApolloClient,
  useReactiveVar,
} from '@apollo/client';