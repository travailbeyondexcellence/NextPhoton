'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { useQuery, useMutation, GET_EDUCATORS, DELETE_EDUCATOR } from '@/lib/apollo';

// Type for educator data
interface Educator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  qualifications: string[];
  experience?: number;
  bio?: string;
  availability?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// const educators: Educator[] = [
//   singleEducator,
//   {
//     ...singleEducator,
//     id: '67890',
//     name: 'Prof. Anand Iyer',
//     username: '@anand.chem',
//     emailFallback: 'anandiyer@nextphoton.com',
//     intro: 'Chemistry enthusiast & Olympiad mentor. 15+ years of experience helping students achieve top ranks.',
//     qualification: 'M.Sc. in Organic Chemistry, IISc Bangalore',
//     subjects: ['Chemistry'],
//     levels: ['Junior College', 'JEE Advanced'],
//     exams: ['JEE Main', 'Olympiads'],
//     priceTier: 'advanced-1',
//     yearsWithNextPhoton: 3,
//     studentsTaught: 1200,
//     hoursTaught: 2400,
//     profileImage: '/educators/eduanandiyer.png',
//   },
// ];

const EducatorsList_forAdmin = () => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch educators using Apollo
  const { data, loading, error, refetch } = useQuery(GET_EDUCATORS, {
    fetchPolicy: 'cache-and-network',
  });

  // Delete educator mutation
  const [deleteEducator] = useMutation(DELETE_EDUCATOR, {
    update(cache, { data: { deleteEducator } }, { variables }) {
      if (deleteEducator && variables) {
        // Remove the deleted educator from cache
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
    onCompleted: () => {
      alert('Educator deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting educator:', error);
      alert('Failed to delete educator. Please try again.');
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteEducator({
        variables: { id },
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading educators...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">Error loading educators: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const educators = data?.educators || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="border-b border-white/20">
          <tr>
            <th className="text-left p-4 font-medium text-muted-foreground">Photo</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Subjects</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Exams</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Experience</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Students</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Hours</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {educators.map((edu: Educator) => {
            const fullName = `${edu.firstName} ${edu.lastName}`;
            const availability = edu.availability || {};
            const profileImage = availability.profileImage;
            const username = availability.username || edu.email;
            const subjects = edu.subject ? [edu.subject] : [];
            const exams = availability.exams || [];
            const studentsTaught = availability.studentsTaught || 0;
            const hoursTaught = availability.hoursTaught || 0;

            return (
              <tr key={edu.id} className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                <td className="p-4">
                  {profileImage && !imageErrors.has(edu.id) ? (
                    <Image
                      src={profileImage}
                      alt={fullName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-white/10"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(edu.id));
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {getInitials(fullName)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{fullName}</div>
                  <div className="text-muted-foreground text-xs">{username}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{subjects.join(', ') || 'N/A'}</td>
                <td className="px-4 py-3 text-foreground">{exams.join(', ') || 'N/A'}</td>
                <td className="px-4 py-3 text-foreground">{edu.experience || 0} yrs</td>
                <td className="px-4 py-3 text-foreground">{studentsTaught}</td>
                <td className="px-4 py-3 text-foreground">{hoursTaught}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Edit functionality coming soon!');
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(edu.id, fullName);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EducatorsList_forAdmin;
