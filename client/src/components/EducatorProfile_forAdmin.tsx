"use client";

import Image from "next/image";
import { User } from 'lucide-react';
import { educator, educatorReviews, adminNotes } from "../app/(dashboard)/admin/educators/[educatorID]/dummyData"; 

const EducatorProfile_forAdmin = () => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#0f172a] text-slate-900 dark:text-white p-6 space-y-6 rounded-xl min-w-800 mx-auto max-w-[1200px]">
              
            
          {/* Header */}
          <div className="text-2xl font-semibold flex items-center gap-2">
                <span className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full text-muted-foreground"> { <User/>}</span>
            EduCator Profile
          </div>
    
          {/* Profile Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-200 dark:bg-slate-800 rounded-xl p-6 flex items-center gap-6">
              <Image
                src={educator.profileImage}
                alt={educator.name}
                width={120}
                height={120}
                className="rounded-xl object-cover border-4 border-blue-400 dark:border-blue-500"
              />
              <div>
                <h2 className="text-xl font-semibold">{educator.name}</h2>
                <p className="text-sm text-blue-600 dark:text-blue-400">{educator.username}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-gray-300">{educator.intro}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-center">
              <p className="text-lg font-semibold">
                Dedicated to helping students crack <span className="font-bold">JEE</span> and <span className="font-bold">NEET</span>
              </p>
              <p className="text-sm text-white/80 mt-1">20+ years of educational excellence</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
          {/* Stats */}
          <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl">
            <h3 className="font-medium text-lg mb-4">Educator Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold">{educator.yearsWithNextPhoton}+</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Years with NextPhoton</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{educator.studentsTaught}</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Students Taught</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{educator.hoursTaught}</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Hours Taught</p>
              </div>
            </div>
            </div>

              {/* Subjects */}
        {/* Subjects */}
<div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl">
  <h3 className="font-medium text-lg mb-4">Subjects</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
    
    {/* Physics */}
    <div className="flex flex-col items-center justify-center space-y-2">
      <Image
        src="/icons/physics.png" // Your uploaded image here
        alt="Physics"
        width={64} // Adjust as needed
        height={64} // Adjust as needed
        className="object-contain"
      />
      <p className="text-sm font-semibold">Physics</p>
    </div>

    {/* Mathematics */}
    <div className="flex flex-col items-center justify-center space-y-2">
      <Image
        src="/icons/mathematics.png" // Add a math icon image similarly
        alt="Mathematics"
        width={64} // Adjust as needed
        height={64} // Adjust as needed
        className="object-contain"
      />
      <p className="text-sm font-semibold">Mathematics</p>
    </div>
    
  </div>
</div>

                

                </div>
            
             {/* Additional Details */}
      <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl space-y-3">
        <h3 className="font-medium text-lg mb-2">Additional Details</h3>
        <p><span className="font-semibold">Qualification:</span> {educator.qualification}</p>
        <p><span className="font-semibold">Subjects:</span> {educator.subjects.join(", ")}</p>
        <p><span className="font-semibold">Levels Taught At:</span> {educator.levels.join(", ")}</p>
        <p><span className="font-semibold">Exam Tags:</span> {educator.exams.join(", ")}</p>
        <p><span className="font-semibold">Price Tier:</span> {educator.priceTier}</p>
      </div>
    
          {/* Reviews Section */}
          <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl">
            <h3 className="font-medium text-lg mb-4">Student Reviews</h3>
            <div className="space-y-4">
              {educatorReviews.map((review, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-700 p-4 rounded-md">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{review.studentName}</span>
                    <span className="text-yellow-500 dark:text-yellow-400">{"★".repeat(review.rating)}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mb-2">{review.date} ({review.exam})</div>
                  <p className="text-sm text-slate-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
    
          {/* Admin Notes */}
          <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl">
            <h3 className="font-medium text-lg mb-4">Admin Notes</h3>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-gray-300">
              {adminNotes.map((note, idx) => (
                <li key={idx} className="border-l-4 border-blue-400 dark:border-blue-500 pl-4">
                  <p className="text-slate-900 dark:text-white font-semibold">{note.author}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-500 mb-1">{note.timestamp}</p>
                  <p>{note.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
}

export default EducatorProfile_forAdmin





