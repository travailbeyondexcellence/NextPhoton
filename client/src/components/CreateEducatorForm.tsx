import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
  profileImage: z.string().url('Profile image URL required'),
});

type EducatorFormData = z.infer<typeof educatorSchema>;

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

const subjectOptions = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'];
const levelOptions = ['Senior School', 'Junior College', 'JEE Advanced', 'Boards', 'Olympiads'];
const examOptions = ['JEE Main', 'NEET', 'Boards', 'Olympiads'];
const priceTiers = ['beginner-1', 'beginner-2', 'beginner-3', 'intermediate-1', 'intermediate-2', 'intermediate-3', 'premium-1', 'premium-2', 'premium-3'];

export default function CreateEducatorForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EducatorFormData>({
    resolver: zodResolver(educatorSchema),
    defaultValues,
  });

  const onSubmit = (data: EducatorFormData) => {
    // handle form submission
    alert(JSON.stringify(data, null, 2));
    reset();
  };

  // For multi-selects
  const handleMultiSelect = (field: keyof EducatorFormData, value: string) => {
    const arr = watch(field) as string[];
    if (arr.includes(value)) {
      setValue(field, arr.filter((v) => v !== value) as any);
    } else {
      setValue(field, [...arr, value] as any);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-background text-foreground rounded-xl shadow-lg p-8 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Create Educator</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input {...register('name')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input {...register('username')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input {...register('emailFallback')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.emailFallback && <p className="text-red-500 text-xs mt-1">{errors.emailFallback.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Profile Image URL</label>
          <input {...register('profileImage')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Intro</label>
        <textarea {...register('intro')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
        {errors.intro && <p className="text-red-500 text-xs mt-1">{errors.intro.message}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Qualification</label>
          <input {...register('qualification')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Price Tier</label>
          <select {...register('priceTier')} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select...</option>
            {priceTiers.map((tier) => <option key={tier} value={tier}>{tier}</option>)}
          </select>
          {errors.priceTier && <p className="text-red-500 text-xs mt-1">{errors.priceTier.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Years with NextPhoton</label>
          <input type="number" {...register('yearsWithNextPhoton', { valueAsNumber: true })} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.yearsWithNextPhoton && <p className="text-red-500 text-xs mt-1">{errors.yearsWithNextPhoton.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Students Taught</label>
          <input type="number" {...register('studentsTaught', { valueAsNumber: true })} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.studentsTaught && <p className="text-red-500 text-xs mt-1">{errors.studentsTaught.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Hours Taught</label>
          <input type="number" {...register('hoursTaught', { valueAsNumber: true })} className="w-full rounded px-3 py-2 bg-muted border border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.hoursTaught && <p className="text-red-500 text-xs mt-1">{errors.hoursTaught.message}</p>}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Subjects</label>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((subject) => (
              <label key={subject} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watch('subjects').includes(subject)}
                  onChange={() => handleMultiSelect('subjects', subject)}
                  className="accent-primary"
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
          {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects.message as string}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Levels</label>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((level) => (
              <label key={level} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watch('levels').includes(level)}
                  onChange={() => handleMultiSelect('levels', level)}
                  className="accent-primary"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
          {errors.levels && <p className="text-red-500 text-xs mt-1">{errors.levels.message as string}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Exams</label>
          <div className="flex flex-wrap gap-2">
            {examOptions.map((exam) => (
              <label key={exam} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watch('exams').includes(exam)}
                  onChange={() => handleMultiSelect('exams', exam)}
                  className="accent-primary"
                />
                <span>{exam}</span>
              </label>
            ))}
          </div>
          {errors.exams && <p className="text-red-500 text-xs mt-1">{errors.exams.message as string}</p>}
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors">Submit</button>
        <button type="button" className="bg-muted text-foreground px-6 py-2 rounded border border-muted-foreground hover:bg-muted/80 transition-colors" onClick={() => reset()}>Reset</button>
      </div>
    </form>
  );
} 