/**
 * Apollo Client Configuration for Server-Side Only
 *
 * This file contains the Apollo setup that includes server-side resolvers
 * with file system access. It should ONLY be imported in:
 * - API routes (pages/api/*)
 * - Server Components
 * - Server Actions
 *
 * DO NOT import this in client components!
 */

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// Create executable schema from type definitions and resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Server-side Apollo Client with SchemaLink (for local resolvers)
export const serverApolloClient = new ApolloClient({
  ssrMode: true,
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache({
    typePolicies: {
      Educator: { keyFields: ['id'] },
      Learner: { keyFields: ['id'] },
      Guardian: { keyFields: ['id'] },
      Batch: { keyFields: ['id'] },
      ClassSession: { keyFields: ['id'] },
      Attendance: { keyFields: ['id'] },
      Assignment: { keyFields: ['id'] },
      TestResult: { keyFields: ['id'] },
      Communication: { keyFields: ['id'] },
      Employee: { keyFields: ['id'] },
      Intern: { keyFields: ['id'] },
      AcademicPlan: { keyFields: ['id'] },
    },
  }),
});