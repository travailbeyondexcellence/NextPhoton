"use client";

import Image from "next/image";
import { User, Atom, Dice5 } from 'lucide-react';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';
import educatorsData from '../../../mock-data/educators.json';

const educators = educatorsData.data;

interface EducatorProfileProps {
    educatorId: string;
}

const EducatorProfile_forAdmin = ({ educatorId }: EducatorProfileProps) => {
    const [imageError, setImageError] = useState(false);
    
    // Find the educator by ID from the educators array
    const educator = educators.find(edu => edu.id === educatorId);
    
    // If educator not found, show a fallback message
    if (!educator) {
        return (
            <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
                    <h2 className="text-xl font-semibold text-foreground mb-2">Educator Not Found</h2>
                    <p className="text-muted-foreground">The educator with ID "{educatorId}" could not be found.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen p-4 md:p-6 space-y-4 md:space-y-6 mx-auto max-w-[1200px]">
              
            
          {/* Header */}
          <div className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                <span className="bg-white/10 backdrop-blur-sm p-2 rounded-full text-muted-foreground border border-white/20"> { <User/>}</span>
            <span className="text-foreground">Educator Profile</span>
          </div>
    
          {/* Profile Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-white/20">
              {educator.profileImage && !imageError ? (
                <Image
                  src={educator.profileImage}
                  alt={educator.name}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover border-4 border-primary/50"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-xl bg-primary/20 border-4 border-primary/50 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {getInitials(educator.name)}
                  </span>
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">{educator.name}</h2>
                <p className="text-sm text-primary">{educator.username}</p>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground">{educator.intro}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 md:p-6 text-center flex flex-col justify-center backdrop-blur-sm border border-white/20">
              <p className="text-base md:text-lg font-semibold text-primary-foreground">
                Dedicated to helping students crack <span className="font-bold">JEE</span> and <span className="font-bold">NEET</span>
              </p>
              <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">20+ years of educational excellence</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
            <h3 className="font-medium text-base md:text-lg mb-4 text-foreground">Educator Stats</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-6 text-center p-2 md:p-4">
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary">{educator.yearsWithNextPhoton}+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Years with NextPhoton</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary">{educator.studentsTaught}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Students Taught</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-primary">{educator.hoursTaught}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Hours Taught</p>
              </div>
            </div>
            </div>

          
        {/* Subjects */}
<div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
  <h3 className="font-medium text-base md:text-lg mb-4 text-foreground">Subjects</h3>
  <div className="grid grid-cols-2 gap-4 md:gap-6 text-center p-2 md:p-4">
    {educator.subjects.map((subject, index) => (
      <div key={index} className="flex flex-col items-center justify-center space-y-2">
        <Atom className="text-primary" size={24} />
        <p className="text-xs md:text-sm font-semibold text-foreground">{subject}</p>
      </div>
    ))}
  </div>
</div>

                

                </div>
            
             {/* Additional Details */}
      <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl space-y-2 md:space-y-3 border border-white/20">
        <h3 className="font-medium text-base md:text-lg mb-2 text-foreground">Additional Details</h3>
        <p className="text-xs md:text-sm"><span className="font-semibold text-foreground">Qualification:</span> <span className="text-muted-foreground">{educator.qualification}</span></p>
        <p className="text-xs md:text-sm"><span className="font-semibold text-foreground">Subjects:</span> <span className="text-muted-foreground">{educator.subjects.join(", ")}</span></p>
        <p className="text-xs md:text-sm"><span className="font-semibold text-foreground">Levels Taught At:</span> <span className="text-muted-foreground">{educator.levels.join(", ")}</span></p>
        <p className="text-xs md:text-sm"><span className="font-semibold text-foreground">Exam Tags:</span> <span className="text-muted-foreground">{educator.exams.join(", ")}</span></p>
        <p className="text-xs md:text-sm"><span className="font-semibold text-foreground">Price Tier:</span> <span className="text-muted-foreground">{educator.priceTier}</span></p>
      </div>
    
          {/* Reviews Section */}
          <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
            <h3 className="font-medium text-base md:text-lg mb-4 text-foreground">Student Reviews</h3>
            <div className="space-y-3 md:space-y-4">
              {educator.educatorReviews.map((review, index) => (
                <div key={index} className="bg-white/5 p-3 md:p-4 rounded-md border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm font-semibold gap-1">
                    <span className="text-foreground">{review.studentName}</span>
                    <span className="text-warning">{"★".repeat(review.rating)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{review.date} ({review.exam})</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
    
          {/* Admin Notes */}
          <div className="bg-white/10 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/20">
            <h3 className="font-medium text-base md:text-lg mb-4 text-foreground">Admin Notes</h3>
            <ul className="space-y-3 text-xs md:text-sm">
              {educator.adminNotes.map((note, idx) => (
                <li key={idx} className="border-l-4 border-primary pl-3 md:pl-4">
                  <p className="text-foreground font-semibold">{note.author}</p>
                  <p className="text-xs text-muted-foreground mb-1">{note.timestamp}</p>
                  <p className="text-muted-foreground">{note.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
}

export default EducatorProfile_forAdmin





