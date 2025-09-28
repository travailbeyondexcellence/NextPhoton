'use client';

import { useState } from 'react';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import educatorsData from '../../mock-data/educators.json';

const educatorsArr = educatorsData.data;

type Educator = typeof educatorsData.data[0];

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

    const [educators, setEducators] = useState(educatorsArr);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());


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
          {educators.map((edu) => (
            <tr key={edu.id} className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
              <td className="p-4">
                {edu.profileImage && !imageErrors.has(edu.id) ? (
                  <Image
                    src={edu.profileImage}
                    alt={edu.name}
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
                      {getInitials(edu.name)}
                    </span>
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="font-semibold text-foreground">{edu.name}</div>
                <div className="text-muted-foreground text-xs">{edu.username}</div>
              </td>
              <td className="px-4 py-3 text-foreground">{edu.subjects.join(', ')}</td>
              <td className="px-4 py-3 text-foreground">{edu.exams.join(', ')}</td>
              <td className="px-4 py-3 text-foreground">{edu.yearsWithNextPhoton} yrs</td>
              <td className="px-4 py-3 text-foreground">{edu.studentsTaught}</td>
              <td className="px-4 py-3 text-foreground">{edu.hoursTaught}</td>
              <td className="px-4 py-3 flex gap-2">
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <Pencil size={16} />
                </button>
                <button className="text-destructive hover:text-destructive/80 transition-colors">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EducatorsList_forAdmin;
