'use client';

import { useState } from 'react';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { educator as singleEducator } from '../app/(dashboard)/admin/educators/[educatorID]/dummyData'; // adjust import as per your structure
import { getInitials } from '@/lib/utils';

import { educators } from '@/app/(dashboard)/admin/educators/[educatorID]/dummyData1.ts';

const educatorsArr = [...educators];

type Educator = typeof singleEducator;

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


  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-x-auto border border-white/20">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-muted-foreground font-medium">Photo</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Name</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Subjects</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Exams</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Experience</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Students</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Hours</th>
            <th className="px-4 py-3 text-muted-foreground font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {educators.map((edu) => (
            <tr key={edu.id} className="border-t border-white/10 hover:bg-white/5 transition-all">
              <td className="px-4 py-3">
                {edu.profileImage ? (
                  <Image
                    src={edu.profileImage}
                    alt={edu.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {getInitials(edu.name)}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
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
