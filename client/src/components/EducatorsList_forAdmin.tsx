'use client';

import { useState } from 'react';

import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { educator as singleEducator } from '../app/(dashboard)/admin/educators/[educatorID]/dummyData'; // adjust import as per your structure

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
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Photo</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Subjects</th>
            <th className="px-4 py-3">Exams</th>
            <th className="px-4 py-3">Experience</th>
            <th className="px-4 py-3">Students</th>
            <th className="px-4 py-3">Hours</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {educators.map((edu) => (
            <tr key={edu.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <Image
                  src={edu.profileImage || '/default-avatar.png'}
                  alt={edu.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold">{edu.name}</div>
                <div className="text-gray-500 text-xs">{edu.username}</div>
              </td>
              <td className="px-4 py-3">{edu.subjects.join(', ')}</td>
              <td className="px-4 py-3">{edu.exams.join(', ')}</td>
              <td className="px-4 py-3">{edu.yearsWithNextPhoton} yrs</td>
              <td className="px-4 py-3">{edu.studentsTaught}</td>
              <td className="px-4 py-3">{edu.hoursTaught}</td>
              <td className="px-4 py-3 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil size={16} />
                </button>
                <button className="text-red-600 hover:text-red-800">
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
