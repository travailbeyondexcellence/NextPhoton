/**
 * Apollo Demo Page
 *
 * This page demonstrates the Apollo Client integration with local resolvers.
 * It serves as a reference for how to use GraphQL operations in the application.
 * The same patterns shown here can be applied throughout the codebase.
 */

import { ApolloExample } from '@/components/examples/ApolloExample';

export default function ApolloDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Apollo Client Demo</h1>
        <p className="text-gray-600">
          This page demonstrates Apollo Client with local resolvers reading from mock JSON files.
          The same code will work seamlessly when connected to the NestJS GraphQL backend.
        </p>
      </div>

      <ApolloExample />

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Key Features Demonstrated:</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>useQuery:</strong> Fetch data with automatic caching</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>useMutation:</strong> Create, update, and delete operations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>Optimistic Updates:</strong> Instant UI feedback before server response</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>Cache Management:</strong> Automatic cache updates after mutations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>Loading States:</strong> Built-in loading and error handling</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span><strong>Related Data:</strong> Fetch educator with batches, sessions, and assignments</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 p-6 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Migration to Backend:</h2>
        <p className="text-sm mb-3">
          When the NestJS GraphQL backend is ready, the only change needed is in
          <code className="px-2 py-1 bg-white rounded mx-1">/lib/apollo/client.ts</code>
        </p>
        <div className="bg-white p-4 rounded border border-green-200">
          <p className="text-xs font-mono text-gray-700">
            {`// Current (Local):`}<br/>
            {`typeDefs, resolvers`}<br/><br/>
            {`// Future (Backend):`}<br/>
            {`link: createHttpLink({ uri: 'http://localhost:4000/graphql' })`}
          </p>
        </div>
      </div>
    </div>
  );
}