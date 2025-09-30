/**
 * Apollo Client Example Component
 *
 * This component demonstrates how to use Apollo Client with local resolvers.
 * It shows examples of:
 * - useQuery hook for fetching data
 * - useMutation hook for modifying data
 * - Optimistic updates
 * - Cache manipulation
 * - Loading and error states
 *
 * This exact same code will work when connected to the backend GraphQL server,
 * with no changes needed to the component logic.
 */

'use client';

import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  GET_EDUCATORS,
  GET_EDUCATOR,
  CREATE_EDUCATOR,
  UPDATE_EDUCATOR,
  DELETE_EDUCATOR,
} from '@/lib/apollo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Edit, Trash2, Check, X } from 'lucide-react';

export function ApolloExample() {
  const [selectedEducatorId, setSelectedEducatorId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
  });

  // Query all educators
  const { data, loading, error, refetch } = useQuery(GET_EDUCATORS, {
    fetchPolicy: 'cache-and-network',
  });

  // Query single educator (only runs when selectedEducatorId is set)
  const { data: selectedEducator } = useQuery(GET_EDUCATOR, {
    variables: { id: selectedEducatorId },
    skip: !selectedEducatorId,
  });

  // Create educator mutation
  const [createEducator, { loading: creating }] = useMutation(CREATE_EDUCATOR, {
    // Optimistically update the cache
    update(cache, { data: { createEducator } }) {
      const existing = cache.readQuery({ query: GET_EDUCATORS });
      if (existing) {
        cache.writeQuery({
          query: GET_EDUCATORS,
          data: {
            educators: [...existing.educators, createEducator],
          },
        });
      }
    },
    onCompleted: () => {
      setIsCreating(false);
      setFormData({ firstName: '', lastName: '', email: '', subject: '' });
    },
  });

  // Update educator mutation
  const [updateEducator, { loading: updating }] = useMutation(UPDATE_EDUCATOR, {
    onCompleted: () => {
      setEditingId(null);
    },
  });

  // Delete educator mutation
  const [deleteEducator] = useMutation(DELETE_EDUCATOR, {
    update(cache, { data: { deleteEducator } }, { variables }) {
      if (deleteEducator && variables) {
        // Remove the deleted educator from the cache
        cache.modify({
          fields: {
            educators(existingEducators = [], { readField }) {
              return existingEducators.filter(
                (educatorRef: any) => variables.id !== readField('id', educatorRef)
              );
            },
          },
        });
      }
    },
  });

  // Handle form submission for creating educator
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEducator({
      variables: {
        input: {
          ...formData,
          qualifications: ['Bachelor of Education'],
          experience: 0,
        },
      },
    });
  };

  // Handle update
  const handleUpdate = async (id: string, updates: any) => {
    await updateEducator({
      variables: {
        id,
        input: updates,
      },
    });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this educator?')) {
      await deleteEducator({
        variables: { id },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading data: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Apollo Client Example - Educators</span>
            <Button
              onClick={() => setIsCreating(!isCreating)}
              variant={isCreating ? "secondary" : "default"}
              size="sm"
            >
              {isCreating ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {isCreating ? 'Cancel' : 'Add Educator'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Create form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Educator'
                )}
              </Button>
            </form>
          )}

          {/* Educators list */}
          <div className="space-y-2">
            {data?.educators?.map((educator: any) => (
              <div
                key={educator.id}
                className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEducatorId === educator.id ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => setSelectedEducatorId(educator.id)}
              >
                {editingId === educator.id ? (
                  // Edit mode
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        defaultValue={educator.firstName}
                        onBlur={(e) => {
                          if (e.target.value !== educator.firstName) {
                            handleUpdate(educator.id, { firstName: e.target.value });
                          }
                        }}
                      />
                      <Input
                        defaultValue={educator.lastName}
                        onBlur={(e) => {
                          if (e.target.value !== educator.lastName) {
                            handleUpdate(educator.id, { lastName: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        disabled={updating}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {educator.firstName} {educator.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {educator.email} • {educator.subject}
                      </p>
                      {educator.experience > 0 && (
                        <p className="text-xs text-gray-500">
                          {educator.experience} years experience
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(educator.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(educator.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected educator details */}
          {selectedEducator?.educator && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Selected Educator Details</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {selectedEducator.educator.firstName}{' '}
                  {selectedEducator.educator.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEducator.educator.email}
                </p>
                <p>
                  <strong>Subject:</strong> {selectedEducator.educator.subject}
                </p>
                <p>
                  <strong>Batches:</strong> {selectedEducator.educator.batches?.length || 0}
                </p>
                <p>
                  <strong>Sessions:</strong> {selectedEducator.educator.classSessions?.length || 0}
                </p>
                <p>
                  <strong>Assignments:</strong> {selectedEducator.educator.assignments?.length || 0}
                </p>
              </div>
            </div>
          )}

          {/* Apollo Cache Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Apollo Client Info</h3>
            <p className="text-xs text-gray-600">
              This component uses Apollo Client with local resolvers reading from mockDb.
              The same queries and mutations will work with the GraphQL backend without any changes.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Total educators in cache: {data?.educators?.length || 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}