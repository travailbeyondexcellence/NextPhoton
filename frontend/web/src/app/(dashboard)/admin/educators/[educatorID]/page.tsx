'use client';

import React from 'react'
import { useParams } from 'next/navigation'
import EducatorProfile_forAdmin from '@/components/EducatorProfile_forAdmin'

const EduCatorProfilePage = () => {
  const params = useParams();
  const educatorId = params.educatorID as string;
  
  return (
      <div>
          <EducatorProfile_forAdmin educatorId={educatorId} />
        </div>
  )
}

export default EduCatorProfilePage