'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ThemeSelector } from '@/components/ThemeSelector';

/**
 * GraphQL Test Interface
 * 
 * A comprehensive testing interface for GraphQL queries and mutations.
 * This page allows developers to test the GraphQL API without needing
 * to open the GraphQL playground.
 * 
 * Features:
 * - Pre-defined queries and mutations
 * - Token management for authenticated requests
 * - Response visualization
 * - Copy-to-clipboard functionality
 * - Error handling and display
 */

interface QueryTemplate {
  name: string;
  description: string;
  query: string;
  variables?: any;
  requiresAuth?: boolean;
}

// Pre-defined GraphQL queries and mutations for testing
const queryTemplates: QueryTemplate[] = [
  {
    name: '🏥 Health Check',
    description: 'Simple query to check if GraphQL is working',
    query: `query HealthCheck {
  health
}`,
    requiresAuth: false,
  },
  {
    name: '🔐 Login',
    description: 'Authenticate with email and password',
    query: `mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
    user {
      id
      email
      name
      roles
      emailVerified
    }
  }
}`,
    variables: {
      email: 'admin@nextphoton.com',
      password: 'Admin@123456'
    },
    requiresAuth: false,
  },
  {
    name: '👤 Current User',
    description: 'Get current authenticated user (requires token)',
    query: `query GetCurrentUser {
  currentUser {
    id
    email
    name
    roles
    emailVerified
  }
}`,
    requiresAuth: true,
  },
  {
    name: '📝 Register User',
    description: 'Create a new user account',
    query: `mutation RegisterUser($email: String!, $password: String!, $name: String!, $role: String!) {
  register(email: $email, password: $password, name: $name, role: $role) {
    access_token
    user {
      id
      email
      name
      roles
      emailVerified
    }
  }
}`,
    variables: {
      email: 'test.user@nextphoton.com',
      password: 'Test@12345',
      name: 'Test User',
      role: 'learner'
    },
    requiresAuth: false,
  },
  {
    name: '🚪 Logout',
    description: 'Logout current user (requires token)',
    query: `mutation Logout {
  logout {
    message
  }
}`,
    requiresAuth: true,
  },
];

export default function TestGraphQL() {
  const [selectedQuery, setSelectedQuery] = useState<QueryTemplate>(queryTemplates[0]);
  const [query, setQuery] = useState(queryTemplates[0].query);
  const [variables, setVariables] = useState(JSON.stringify(queryTemplates[0].variables || {}, null, 2));
  const [authToken, setAuthToken] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Execute GraphQL request
  const executeQuery = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Parse variables if provided
      let parsedVariables = {};
      if (variables.trim() && variables.trim() !== '{}') {
        try {
          parsedVariables = JSON.parse(variables);
        } catch (e) {
          toast.error('Invalid JSON in variables');
          setLoading(false);
          return;
        }
      }

      // Prepare headers
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Make the request to our GraphQL endpoint
      const res = await fetch('http://localhost:963/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables: parsedVariables,
        }),
      });

      const data = await res.json();
      setResponse(data);

      // If login was successful, automatically set the token
      if (data?.data?.login?.access_token) {
        setAuthToken(data.data.login.access_token);
        toast.success('Token automatically set from login response!');
      }

      if (data.errors) {
        toast.error('GraphQL returned errors');
      } else {
        toast.success('Query executed successfully!');
      }
    } catch (error: any) {
      setResponse({ error: error.message });
      toast.error(`Failed to execute query: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Select a template query
  const selectTemplate = (template: QueryTemplate) => {
    setSelectedQuery(template);
    setQuery(template.query);
    setVariables(JSON.stringify(template.variables || {}, null, 2));
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background-gradient-from)] via-[var(--background-gradient-via)] to-[var(--background-gradient-to)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Selector */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                GraphQL API Test Interface
              </h1>
              <p className="text-muted-foreground">
                Test GraphQL queries and mutations without opening the playground
              </p>
            </div>
            <ThemeSelector />
          </div>
          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg backdrop-blur-sm">
            <p className="text-warning text-sm">
              <strong>Backend URL:</strong> http://localhost:963/graphql
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Templates */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-foreground mb-4">Query Templates</h2>
              <div className="space-y-2">
                {queryTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => selectTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedQuery.name === template.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm opacity-80 mt-1">{template.description}</div>
                    {template.requiresAuth && (
                      <span className="inline-block mt-2 px-2 py-1 bg-warning/20 text-warning text-xs rounded">
                        Requires Auth
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Token */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-foreground mb-4">Authentication Token</h2>
              <textarea
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Paste your JWT token here (or it will be set automatically after login)"
                className="w-full h-24 p-3 bg-white/5 text-foreground placeholder-muted-foreground rounded-lg border border-white/10 focus:border-primary focus:outline-none"
              />
              {authToken && (
                <button
                  onClick={() => {
                    setAuthToken('');
                    toast.success('Token cleared');
                  }}
                  className="mt-2 px-3 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                >
                  Clear Token
                </button>
              )}
            </div>
          </div>

          {/* Middle Panel - Query Editor */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Query</h2>
                <button
                  onClick={() => copyToClipboard(query, 'Query')}
                  className="px-3 py-1 bg-white/10 text-foreground rounded hover:bg-white/20 transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-64 p-3 bg-white/5 text-foreground font-mono text-sm rounded-lg border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Variables</h2>
                <button
                  onClick={() => copyToClipboard(variables, 'Variables')}
                  className="px-3 py-1 bg-white/10 text-foreground rounded hover:bg-white/20 transition-colors"
                >
                  📋 Copy
                </button>
              </div>
              <textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder="{}"
                className="w-full h-32 p-3 bg-white/5 text-foreground font-mono text-sm rounded-lg border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={executeQuery}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90'
              }`}
            >
              {loading ? '⏳ Executing...' : '🚀 Execute Query'}
            </button>
          </div>

          {/* Right Panel - Response */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Response</h2>
                {response && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'Response')}
                    className="px-3 py-1 bg-white/10 text-foreground rounded hover:bg-white/20 transition-colors"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
              <div className="bg-black/30 rounded-lg p-4 h-[500px] overflow-auto">
                {response ? (
                  <pre className="text-success font-mono text-sm whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">Response will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-foreground mb-4">📚 Test Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { role: 'Admin', email: 'admin@nextphoton.com', password: 'Admin@123456' },
              { role: 'Educator', email: 'john.educator@nextphoton.com', password: 'Educator@123' },
              { role: 'Learner', email: 'mike.learner@nextphoton.com', password: 'Learner@123' },
              { role: 'Guardian', email: 'robert.guardian@nextphoton.com', password: 'Guardian@123' },
              { role: 'ECM', email: 'sarah.ecm@nextphoton.com', password: 'EcManager@123' },
              { role: 'Intern', email: 'jessica.intern@nextphoton.com', password: 'Intern@123' },
            ].map((cred) => (
              <div key={cred.email} className="bg-white/5 rounded-lg p-3">
                <div className="font-semibold text-primary">{cred.role}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <div>📧 {cred.email}</div>
                  <div>🔑 {cred.password}</div>
                </div>
                <button
                  onClick={() => {
                    const loginVars = {
                      email: cred.email,
                      password: cred.password
                    };
                    selectTemplate(queryTemplates[1]); // Select login template
                    setVariables(JSON.stringify(loginVars, null, 2));
                    toast.success(`${cred.role} credentials loaded!`);
                  }}
                  className="mt-2 px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm"
                >
                  Use Credentials
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}