'use client';

import React from 'react';
import CreateEducatorForm from '@/components/CreateEducatorForm';
import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreateNewEducator = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Educators</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-primary border border-white/20">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add New Educator</h1>
              <p className="text-sm text-muted-foreground">Create a new educator profile</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <CreateEducatorForm />
        </div>
      </div>
    </div>
  );
};

export default CreateNewEducator;