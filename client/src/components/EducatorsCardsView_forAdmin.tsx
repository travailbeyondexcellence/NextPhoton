'use client';

import React, { useState } from 'react';
import EducatorCard_forAdmin from './EducatorCard_forAdmin';
import { educator as educator1 } from '@/app/(dashboard)/admin/educators/[educatorID]/dummyData';

import { educators } from '@/app/(dashboard)/admin/educators/[educatorID]/dummyData1.ts';

const educatorsArr = [...educators];

// const dummyEducators = [
//   educator1,
//   {
//     ...educator1,
//     id: '67890',
//     name: 'Prof. Anand Iyer',
//     username: '@anand.chem',
//     emailFallback: 'anandiyer@nextphoton.com',
//     intro: 'Chemistry expert, Olympiad coach, 15 years of transforming results.',
//     qualification: 'M.Sc. in Organic Chemistry, IISc Bangalore',
//     subjects: ['Chemistry'],
//     levels: ['Junior College', 'JEE Advanced'],
//     exams: ['JEE Main', 'NEET'],
//     profileImage: '/educators/eduanandiyer.png',
//     priceTier: 'premium-1',
//     yearsWithNextPhoton: 3,
//     studentsTaught: 1200,
//     hoursTaught: 2500,
//   },
// ];

const EducatorsCardsView_forAdmin = () => {

    
    
    const [educators, setEducators] = useState(educatorsArr);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {educators.map((edu: any) => (
        <EducatorCard_forAdmin key={edu.id} educator={edu} />
      ))}
    </div>
  );
};

export default EducatorsCardsView_forAdmin;
