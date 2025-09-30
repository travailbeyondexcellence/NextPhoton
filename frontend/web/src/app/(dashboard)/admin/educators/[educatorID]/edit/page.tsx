"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_EDUCATOR } from '@/lib/apollo';
import EditEducatorForm from '@/components/EditEducatorForm';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function EditEducatorPage() {
  const params = useParams();
  const router = useRouter();
  const educatorId = params.educatorID as string;

  // Fetch the educator data
  const { data, loading, error } = useQuery(GET_EDUCATOR, {
    variables: { id: educatorId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.educator) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">Error loading educator: {error?.message || 'Educator not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Educator</h1>
          <p className="text-sm text-muted-foreground">
            Update information for {data.educator.firstName} {data.educator.lastName}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <EditEducatorForm educator={data.educator} />
      </div>
    </div>
  );
}