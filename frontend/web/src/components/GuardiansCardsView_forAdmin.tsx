// Component for displaying guardians in a card grid view for admin
'use client';

import React from 'react';
import GuardianCard_forAdmin from './GuardianCard_forAdmin';
import guardiansData from '../../../mock-data/guardians.json';

const guardians = guardiansData.data;

const GuardiansCardsView_forAdmin = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
            {guardians.map((guardian) => (
                <GuardianCard_forAdmin key={guardian.id} guardian={guardian} />
            ))}
        </div>
    );
};

export default GuardiansCardsView_forAdmin;