/**
 * GraphQL API Route for Next.js
 *
 * This API route handles GraphQL queries and mutations server-side,
 * allowing safe access to the file system through mockDb.
 *
 * Flow:
 * 1. Client makes GraphQL request to /api/graphql
 * 2. This route receives the request
 * 3. Executes the query using server-side Apollo with mockDb resolvers
 * 4. Returns the result to the client
 *
 * This architecture prevents the "Module not found: fs" error by keeping
 * all file system operations on the server.
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@/lib/apollo/typeDefs';
import { resolvers } from '@/lib/apollo/resolvers';
import { NextRequest } from 'next/server';

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Server instance
const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV === 'development',
});

// Create Next.js handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    return { req };
  },
});

// Export handlers for both GET and POST
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}