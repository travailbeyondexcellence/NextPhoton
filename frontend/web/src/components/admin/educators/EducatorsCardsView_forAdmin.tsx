'use client';

import React, { useState } from 'react';
import EducatorCard_forAdmin from './EducatorCard_forAdmin';
import educatorsData from '../../mock-data/educators.json';

const educatorsArr = educatorsData.data;

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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
      {educators.map((edu: any) => (
        <EducatorCard_forAdmin key={edu.id} educator={edu} />
      ))}
    </div>
  );
};

export default EducatorsCardsView_forAdmin;
