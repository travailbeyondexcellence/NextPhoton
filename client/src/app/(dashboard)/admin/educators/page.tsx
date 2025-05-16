"use client"

import React from 'react'

import { useState } from 'react';
import EducatorsCardsView_forAdmin  from '@/components/EducatorsCardsView_forAdmin';
import EducatorsList_forAdmin from '@/components/EducatorsList_forAdmin';
import { LayoutGrid, List } from 'lucide-react';

import EducatorCard_forAdmin from '@/components/EducatorCard_forAdmin'

const Educators = () => {

  const [view, setView] = useState<'list' | 'card'>('list');

  const toggleView = () => {
    setView((prev) => (prev === 'list' ? 'card' : 'list'));
  };


  return (
    <div>


<div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Educators</h1>
        <button
          onClick={toggleView}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Toggle View"
        >
          {view === 'list' ? <LayoutGrid size={20} /> : <List size={20} />}
        </button>
      </div>

      {view === 'list' ?   <EducatorsList_forAdmin /> :  <EducatorsCardsView_forAdmin/>}
    </div>


      <EducatorCard_forAdmin />

    
      
     
      




    </div>
  )
}

export default Educators