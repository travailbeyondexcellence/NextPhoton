"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Mail, 
  AtSign, 
  Phone,
  School, 
  GraduationCap,
  Target,
  Calendar,
  Users,
  BookOpen,
  Award,
  Image as ImageIcon,
  FileText,
  MapPin,
  Hash
} from 'lucide-react';

const learnerSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name is required'),
  username: z.string().min(2, 'Username is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  profileImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  // Academic Information
  academicLevel: z.string().min(1, 'Academic level is required'),
  grade: z.string().min(1, 'Grade is required'),
  school: z.string().min(2, 'School name is required'),
  board: z.string().min(1, 'Board is required'),
  
  // Target Exams
  targetExams: z.array(z.string()).min(1, 'Select at least one target exam'),
  targetExamYear: z.coerce.number().min(new Date().getFullYear(), 'Year must be current or future'),
  
  // Guardian Information (simplified for creation)
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianRelation: z.string().min(1, 'Guardian relation is required'),
  guardianPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  guardianEmail: z.string().email('Invalid guardian email'),
  
  // Additional Info
  batchId: z.string().optional(),
  enrollmentDate: z.string().optional(),
  remarkTags: z.array(z.string()).optional(),
});

type LearnerFormData = z.infer<typeof learnerSchema>;

const defaultValues: LearnerFormData = {
  name: '',
  username: '',
  email: '',
  phone: '',
  profileImage: '',
  academicLevel: '',
  grade: '',
  school: '',
  board: '',
  targetExams: [],
  targetExamYear: new Date().getFullYear() + 1,
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  batchId: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  remarkTags: [],
};

const academicLevels = ['Middle School', 'Senior School', 'Junior College'];
const grades = ['8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'];
const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];
const targetExamOptions = ['JEE Main', 'JEE Advanced', 'NEET', 'Boards', 'Olympiads', 'NTSE', 'KVPY', 'CLAT', 'NDA'];
const guardianRelations = ['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt', 'Grandparent'];
const remarkTagOptions = [
  'High Potential', 'Needs Support', 'Consistent Performer', 
  'Olympiad Aspirant', 'Board Focused', 'Competitive Exam Focused',
  'Attendance Issue', 'Improving', 'Top Performer'
];

export default function CreateLearnerForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<LearnerFormData>({
    resolver: zodResolver(learnerSchema),
    defaultValues,
  });

  const onSubmit = (data: LearnerFormData) => {
    // Handle form submission
    console.log('Form data:', data);
    alert('Learner created successfully!');
    reset();
  };

  // Handle multi-select for exams
  const handleExamSelect = (exam: string) => {
    const currentExams = watch('targetExams');
    if (currentExams.includes(exam)) {
      setValue('targetExams', currentExams.filter(e => e !== exam));
    } else {
      setValue('targetExams', [...currentExams, exam]);
    }
  };

  // Handle multi-select for tags
  const handleTagSelect = (tag: string) => {
    const currentTags = watch('remarkTags') || [];
    if (currentTags.includes(tag)) {
      setValue('remarkTags', currentTags.filter(t => t !== tag));
    } else {
      setValue('remarkTags', [...currentTags, tag]);
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
              placeholder="Enter learner's full name"
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
              {...register('email')} 
              type="email"
              placeholder="learner@example.com"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Phone className="w-4 h-4" /> Phone Number (Optional)
            </label>
            <input 
              {...register('phone')} 
              placeholder="+91-9999999999"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="mt-4">
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

      {/* Academic Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <School className="w-5 h-5 text-primary" />
          Academic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <GraduationCap className="w-4 h-4" /> Academic Level
            </label>
            <select 
              {...register('academicLevel')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select academic level...</option>
              {academicLevels.map((level) => (
                <option key={level} value={level} className="bg-gray-800">{level}</option>
              ))}
            </select>
            {errors.academicLevel && <p className="text-red-400 text-xs mt-1">{errors.academicLevel.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Hash className="w-4 h-4" /> Grade
            </label>
            <select 
              {...register('grade')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select grade...</option>
              {grades.map((grade) => (
                <option key={grade} value={grade} className="bg-gray-800">{grade}</option>
              ))}
            </select>
            {errors.grade && <p className="text-red-400 text-xs mt-1">{errors.grade.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <School className="w-4 h-4" /> School Name
            </label>
            <input 
              {...register('school')} 
              placeholder="Enter school name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.school && <p className="text-red-400 text-xs mt-1">{errors.school.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Board
            </label>
            <select 
              {...register('board')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select board...</option>
              {boards.map((board) => (
                <option key={board} value={board} className="bg-gray-800">{board}</option>
              ))}
            </select>
            {errors.board && <p className="text-red-400 text-xs mt-1">{errors.board.message}</p>}
          </div>
        </div>
      </div>

      {/* Target Exams Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Target Exams
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-3 text-sm font-medium text-foreground">Select Target Exams</label>
            <div className="grid grid-cols-2 gap-2">
              {targetExamOptions.map((exam) => (
                <label key={exam} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={watch('targetExams').includes(exam)}
                    onChange={() => handleExamSelect(exam)}
                    className="w-4 h-4 text-primary bg-white/10 border-white/30 rounded 
                             focus:ring-primary focus:ring-2 focus:ring-offset-0
                             checked:bg-primary checked:border-primary"
                  />
                  <span className="text-sm text-foreground">{exam}</span>
                </label>
              ))}
            </div>
            {errors.targetExams && <p className="text-red-400 text-xs mt-2">{errors.targetExams.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Target Exam Year
            </label>
            <input 
              type="number" 
              {...register('targetExamYear', { valueAsNumber: true })} 
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 5}
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.targetExamYear && <p className="text-red-400 text-xs mt-1">{errors.targetExamYear.message}</p>}
          </div>
        </div>
      </div>

      {/* Guardian Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Guardian Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <User className="w-4 h-4" /> Guardian Name
            </label>
            <input 
              {...register('guardianName')} 
              placeholder="Enter guardian's full name"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.guardianName && <p className="text-red-400 text-xs mt-1">{errors.guardianName.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Relation</label>
            <select 
              {...register('guardianRelation')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            >
              <option value="" className="bg-gray-800">Select relation...</option>
              {guardianRelations.map((relation) => (
                <option key={relation} value={relation} className="bg-gray-800">{relation}</option>
              ))}
            </select>
            {errors.guardianRelation && <p className="text-red-400 text-xs mt-1">{errors.guardianRelation.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Phone className="w-4 h-4" /> Guardian Phone
            </label>
            <input 
              {...register('guardianPhone')} 
              placeholder="+91-9999999999"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.guardianPhone && <p className="text-red-400 text-xs mt-1">{errors.guardianPhone.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" /> Guardian Email
            </label>
            <input 
              {...register('guardianEmail')} 
              type="email"
              placeholder="guardian@example.com"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
            {errors.guardianEmail && <p className="text-red-400 text-xs mt-1">{errors.guardianEmail.message}</p>}
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Additional Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Batch ID (Optional)</label>
            <input 
              {...register('batchId')} 
              placeholder="e.g., batch_jee_2026_01"
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Enrollment Date
            </label>
            <input 
              type="date"
              {...register('enrollmentDate')} 
              className="w-full rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       hover:bg-white/15 transition-all cursor-pointer"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-3 text-sm font-medium text-foreground">Tags (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {remarkTagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  (watch('remarkTags') || []).includes(tag)
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/10 text-foreground border border-white/20 hover:bg-white/15'
                }`}
              >
                {tag}
              </button>
            ))}
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
          onClick={() => reset()}
        >
          Reset
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary rounded-lg 
                   hover:bg-primary/30 hover:border-primary/40 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
        >
          Create Learner
        </button>
      </div>
    </form>
  );
}