/**
 * Apollo Client Configuration for Client-Side
 *
 * This client connects to the Next.js API route which handles
 * the GraphQL operations server-side using the local mock database.
 *
 * Architecture:
 * - Client components use this Apollo Client
 * - Queries/mutations go to /api/graphql
 * - API route uses server-side Apollo with mockDb resolvers
 * - mockDb performs file operations safely on the server
 *
 * Future migration to backend:
 * When the NestJS backend is ready, simply change the uri to point
 * to the NestJS GraphQL endpoint instead of the local API route.
 */

import { ApolloClient, InMemoryCache, makeVar, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 2000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors but not on GraphQL errors
      return !!error && !error.message.includes('GraphQL');
    },
  },
});

// Create HTTP link pointing to our Next.js API route
const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
  fetchOptions: {
    timeout: 10000, // 10 second timeout
  },
});

// Create reactive variables for global state management
// These can be used alongside the GraphQL cache for local state
export const isAuthenticatedVar = makeVar<boolean>(false);
export const currentUserVar = makeVar<any>(null);
export const selectedBatchVar = makeVar<string | null>(null);

// Configure the Apollo Client cache
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Define local-only fields that don't come from the server
        isAuthenticated: {
          read() {
            return isAuthenticatedVar();
          },
        },
        currentUser: {
          read() {
            return currentUserVar();
          },
        },
        selectedBatch: {
          read() {
            return selectedBatchVar();
          },
        },
        // Custom merge functions for array fields to handle pagination
        educators: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        learners: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        batches: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    // Define how to identify entities for caching
    Educator: {
      keyFields: ['id'],
    },
    Learner: {
      keyFields: ['id'],
    },
    Guardian: {
      keyFields: ['id'],
    },
    Batch: {
      keyFields: ['id'],
    },
    ClassSession: {
      keyFields: ['id'],
    },
    Attendance: {
      keyFields: ['id'],
    },
    Assignment: {
      keyFields: ['id'],
    },
    TestResult: {
      keyFields: ['id'],
    },
    Communication: {
      keyFields: ['id'],
    },
    Employee: {
      keyFields: ['id'],
    },
    Intern: {
      keyFields: ['id'],
    },
    AcademicPlan: {
      keyFields: ['id'],
    },
  },
});

// Chain links: errorLink -> retryLink -> httpLink
const link = from([errorLink, retryLink, httpLink]);

// Create the Apollo Client instance
export const apolloClient = new ApolloClient({
  link,
  cache,
  // Enable Apollo DevTools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
  // Default options for queries and mutations
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

/**
 * Future Backend Integration Notes:
 *
 * When ready to connect to the NestJS GraphQL backend:
 *
 * 1. Install additional dependencies:
 *    npm install @apollo/client graphql
 *
 * 2. Replace the local configuration above with:
 *
 * import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
 * import { setContext } from '@apollo/client/link/context';
 *
 * const httpLink = createHttpLink({
 *   uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
 * });
 *
 * const authLink = setContext((_, { headers }) => {
 *   const token = localStorage.getItem('auth-token');
 *   return {
 *     headers: {
 *       ...headers,
 *       authorization: token ? `Bearer ${token}` : "",
 *     }
 *   }
 * });
 *
 * export const apolloClient = new ApolloClient({
 *   link: authLink.concat(httpLink),
 *   cache,
 *   connectToDevTools: process.env.NODE_ENV === 'development',
 * });
 *
 * 3. Remove the typeDefs and resolvers imports and configuration
 * 4. All existing queries and mutations will work without modification
 */

// Export helper functions for local state management
export const authHelpers = {
  setAuthenticated: (isAuth: boolean) => {
    isAuthenticatedVar(isAuth);
  },
  setCurrentUser: (user: any) => {
    currentUserVar(user);
  },
  logout: () => {
    isAuthenticatedVar(false);
    currentUserVar(null);
    // Clear the Apollo cache on logout
    apolloClient.clearStore();
  },
};

// Export cache manipulation helpers
export const cacheHelpers = {
  // Helper to update a single entity in the cache
  updateEntity: (typename: string, id: string, updates: any) => {
    apolloClient.cache.modify({
      id: apolloClient.cache.identify({ __typename: typename, id }),
      fields: updates,
    });
  },

  // Helper to evict an entity from the cache
  evictEntity: (typename: string, id: string) => {
    apolloClient.cache.evict({
      id: apolloClient.cache.identify({ __typename: typename, id }),
    });
    apolloClient.cache.gc();
  },

  // Helper to refetch specific queries
  refetchQueries: (queryNames: string[]) => {
    return apolloClient.refetchQueries({
      include: queryNames,
    });
  },
};