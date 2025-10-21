"use client";

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { UPDATE_EDUCATOR, GET_EDUCATORS } from '@/lib/apollo';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  AtSign,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Users,
  Clock,
  Image as ImageIcon,
  FileText,
  Loader2,
  Save
} from 'lucide-react';

const educatorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  username: z.string().min(2, 'Username is required'),
  emailFallback: z.string().email('Invalid email'),
  intro: z.string().min(5, 'Intro is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  subjects: z.array(z.string()).min(1, 'At least one subject'),
  levels: z.array(z.string()).min(1, 'At least one level'),
  exams: z.array(z.string()).min(1, 'At least one exam'),
  priceTier: z.string().min(2, 'Price tier is required'),
  yearsWithNextPhoton: z.coerce.number().min(0),
  studentsTaught: z.coerce.number().min(0),
  hoursTaught: z.coerce.number().min(0),
  profileImage: z.string().url('Profile image URL required').or(z.literal('')).refine(
    (url) => {
      // Allow empty strings
      if (!url) return true;
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        // Reject URLs with invalid hostnames or example/placeholder domains
        if (!hostname || !hostname.includes('.') || hostname.startsWith('example')) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Please provide a valid image URL with a proper domain (e.g., https://domain.com/image.jpg)' }
  ),
});

type EducatorFormData = z.infer<typeof educatorSchema>;

const subjectOptions = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'];
const levelOptions = ['Senior School', 'Junior College', 'JEE Advanced', 'NEET', 'Boards', 'Olympiads'];
const examOptions = ['JEE Main', 'JEE Advanced', 'NEET', 'Boards', 'Olympiads', 'NTSE', 'KVPY'];
const priceTiers = [
  { value: 'beginner-1', label: 'Beginner 1', color: 'bg-[#F3E090FF]' },
  { value: 'beginner-2', label: 'Beginner 2', color: 'bg-[#F8DD65FF]' },
  { value: 'beginner-3', label: 'Beginner 3', color: 'bg-[#FFB303FF]' },
  { value: 'intermediate-1', label: 'Intermediate 1', color: 'bg-[#51D9EBFF]' },
  { value: 'intermediate-2', label: 'Intermediate 2', color: 'bg-[#0477FAFF]' },
  { value: 'intermediate-3', label: 'Intermediate 3', color: 'bg-[#024EA6FF]' },
  { value: 'premium-1', label: 'Premium 1', color: 'bg-[#F9618CFF]' },
  { value: 'premium-2', label: 'Premium 2', color: 'bg-[#ff1e37]' },
  { value: 'premium-3', label: 'Premium 3', color: 'bg-[#BA0419FF]' },
];

interface EditEducatorFormProps {
  educator: any;
}

const defaultValues: EducatorFormData = {
  name: '',
  username: '',
  emailFallback: '',
  intro: '',
  qualification: '',
  subjects: [],
  levels: [],
  exams: [],
  priceTier: '',
  yearsWithNextPhoton: 0,
  studentsTaught: 0,
  hoursTaught: 0,
  profileImage: '',
};

export default function EditEducatorForm({ educator }: EditEducatorFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EducatorFormData>({
    resolver: zodResolver(educatorSchema),
    defaultValues,
  });

  // Pre-populate form with existing educator data
  useEffect(() => {
    if (educator) {
      // Extract data from availability JSON if present
      const availability = typeof educator.availability === 'object' ? educator.availability : {};

      // Parse subjects - handle both string and array
      const subjectsArray = educator.subject
        ? (Array.isArray(educator.subject) ? educator.subject : educator.subject.split(',').map((s: string) => s.trim()))
        : [];

      setValue('name', `${educator.firstName || ''} ${educator.lastName || ''}`.trim());
      setValue('username', availability.username || '');
      setValue('emailFallback', educator.email || '');
      setValue('intro', educator.bio || '');
      setValue('qualification', Array.isArray(educator.qualifications) && educator.qualifications[0]
        ? educator.qualifications[0]
        : (typeof educator.qualifications === 'string' ? educator.qualifications : ''));
      setValue('subjects', subjectsArray);
      setValue('levels', availability.levels || []);
      setValue('exams', availability.exams || []);
      setValue('priceTier', availability.priceTier || '');
      setValue('yearsWithNextPhoton', educator.experience || 0);
      setValue('studentsTaught', availability.studentsTaught || 0);
      setValue('hoursTaught', availability.hoursTaught || 0);
      setValue('profileImage', availability.profileImage || '');
    }
  }, [educator, setValue]);

  // Apollo mutation for updating educator
  const [updateEducator, { loading: updating }] = useMutation(UPDATE_EDUCATOR, {
    onCompleted: () => {
      alert('Educator updated successfully!');
      router.push('/admin/educators');
    },
    onError: (error) => {
      console.error('Error updating educator:', error);
      alert('Failed to update educator. Please try again.');
    },
    refetchQueries: [{ query: GET_EDUCATORS }],
  });

  const onSubmit = async (data: EducatorFormData) => {
    try {
      // Transform form data to match GraphQL input
      await updateEducator({
        variables: {
          id: educator.id,
          input: {
            firstName: data.name.split(' ')[0] || data.name,
            lastName: data.name.split(' ').slice(1).join(' ') || '',
            email: data.emailFallback,
            subject: data.subjects.join(', '),
            qualifications: [data.qualification],
            experience: data.yearsWithNextPhoton,
            bio: data.intro,
            availability: {
              username: data.username,
              levels: data.levels,
              exams: data.exams,
              priceTier: data.priceTier,
              studentsTaught: data.studentsTaught,
              hoursTaught: data.hoursTaught,
              profileImage: data.profileImage || undefined,
            },
          },
        },
      });
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  // For multi-selects
  const handleMultiSelect = (field: keyof EducatorFormData, value: string) => {
    const arr = (watch(field) || []) as string[];
    if (arr.includes(value)) {
      setValue(field, arr.filter((v) => v !== value) as any);
    } else {
      setValue(field, [...arr, value] as any);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              {...register('name')}
              placeholder="Enter educator's full name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <AtSign className="w-4 h-4" /> Username
            </label>
            <input
              {...register('username')}
              placeholder="@username"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              {...register('emailFallback')}
              type="email"
              placeholder="educator@example.com"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.emailFallback && <p className="text-red-400 text-xs mt-1">{errors.emailFallback.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <ImageIcon className="w-4 h-4" /> Profile Image URL (Optional)
            </label>
            <input
              {...register('profileImage')}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.profileImage && <p className="text-red-400 text-xs mt-1">{errors.profileImage.message}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
            <FileText className="w-4 h-4" /> Introduction
          </label>
          <textarea
            {...register('intro')}
            placeholder="Brief introduction about the educator..."
            className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     hover:bg-white/15 transition-all resize-none"
            rows={3}
          />
          {errors.intro && <p className="text-red-400 text-xs mt-1">{errors.intro.message}</p>}
        </div>
      </div>

      {/* Qualifications & Pricing Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Qualifications & Pricing
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Qualification
            </label>
            <input
              {...register('qualification')}
              placeholder="e.g., M.Sc. Physics, IIT Delhi"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.qualification && <p className="text-red-400 text-xs mt-1">{errors.qualification.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> Price Tier
            </label>
            <select
              {...register('priceTier')}
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select price tier...</option>
              {priceTiers.map((tier) => (
                <option key={tier.value} value={tier.value} className="bg-gray-800">
                  {tier.label}
                </option>
              ))}
            </select>
            {errors.priceTier && <p className="text-red-400 text-xs mt-1">{errors.priceTier.message}</p>}
            {watch('priceTier') && (
              <div className="mt-2">
                <div className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                  priceTiers.find(t => t.value === watch('priceTier'))?.color
                } ${watch('priceTier').includes('beginner') ? 'text-black' : 'text-white'}`}>
                  {priceTiers.find(t => t.value === watch('priceTier'))?.label}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Experience
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Years with NextPhoton
            </label>
            <input
              type="number"
              {...register('yearsWithNextPhoton', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.yearsWithNextPhoton && <p className="text-red-400 text-xs mt-1">{errors.yearsWithNextPhoton.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Users className="w-4 h-4" /> Students Taught
            </label>
            <input
              type="number"
              {...register('studentsTaught', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.studentsTaught && <p className="text-red-400 text-xs mt-1">{errors.studentsTaught.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> Hours Taught
            </label>
            <input
              type="number"
              {...register('hoursTaught', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.hoursTaught && <p className="text-red-400 text-xs mt-1">{errors.hoursTaught.message}</p>}
          </div>
        </div>
      </div>

      {/* Teaching Details Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Teaching Details
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-3 text-sm font-medium text-foreground">Subjects</label>
            <div className="space-y-2">
              {subjectOptions.map((subject) => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={(watch('subjects') || []).includes(subject)}
                    onChange={() => handleMultiSelect('subjects', subject)}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30 rounded
                             focus:ring-primary focus:ring-2 focus:ring-offset-0
                             checked:bg-primary checked:border-primary"
                  />
                  <span className="text-sm text-foreground">{subject}</span>
                </label>
              ))}
            </div>
            {errors.subjects && <p className="text-red-400 text-xs mt-2">{errors.subjects.message as string}</p>}
          </div>
          <div>
            <label className="block mb-3 text-sm font-medium text-foreground">Levels</label>
            <div className="space-y-2">
              {levelOptions.map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={(watch('levels') || []).includes(level)}
                    onChange={() => handleMultiSelect('levels', level)}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30 rounded
                             focus:ring-primary focus:ring-2 focus:ring-offset-0
                             checked:bg-primary checked:border-primary"
                  />
                  <span className="text-sm text-foreground">{level}</span>
                </label>
              ))}
            </div>
            {errors.levels && <p className="text-red-400 text-xs mt-2">{errors.levels.message as string}</p>}
          </div>
          <div>
            <label className="block mb-3 text-sm font-medium text-foreground">Exams</label>
            <div className="space-y-2">
              {examOptions.map((exam) => (
                <label key={exam} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={(watch('exams') || []).includes(exam)}
                    onChange={() => handleMultiSelect('exams', exam)}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30 rounded
                             focus:ring-primary focus:ring-2 focus:ring-offset-0
                             checked:bg-primary checked:border-primary"
                  />
                  <span className="text-sm text-foreground">{exam}</span>
                </label>
              ))}
            </div>
            {errors.exams && <p className="text-red-400 text-xs mt-2">{errors.exams.message as string}</p>}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-foreground rounded-lg
                   hover:bg-white/15 hover:border-white/30 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2.5 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-lg
                   hover:bg-primary/30 hover:border-primary/40 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {updating ? 'Updating...' : 'Update Educator'}
        </button>
      </div>
    </form>
  );
}