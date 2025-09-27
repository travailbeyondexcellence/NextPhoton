// Component for displaying learners in a card grid view for admin
'use client';

import React from 'react';
import LearnerCard_forAdmin from './LearnerCard_forAdmin';
import learnersData from '../../../mock-data/learners.json';

const learners = learnersData.data;

const LearnersCardsView_forAdmin = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
            {learners.map((learner) => (
                <LearnerCard_forAdmin key={learner.id} learner={learner} />
            ))}
        </div>
    );
};

export default LearnersCardsView_forAdmin;