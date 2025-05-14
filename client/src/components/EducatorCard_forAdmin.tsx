import React from 'react'
import Image from 'next/image';

const educator = {
    name: "Dr. Meera Sharma",
    username: "@meera.physics",
    emailFallback: "meerasharma@nextphoton.com",
    intro: "Passionate Physics & Maths educator who simplifies the toughest topics.",
    qualification: "Ph.D. in Theoretical Physics, IIT Bombay",
    subjects: ["Physics", "Mathematics"],
    levels: ["Senior School", "Junior College", "JEE Advanced"],
    exams: ["10th Boards", "JEE Main", "NEET", "Olympiads"],
    priceTier: "Intermediate",
    yearsWithNextPhoton: 5,
    studentsTaught: 1800,
    hoursTaught: 3200,
    profileImage: "/educators/edumeerasharma.png"
  };
  

const EducatorCard_forAdmin = () => { return (
    <div className="flex flex-col md:flex-row bg-background text-foreground rounded-xl overflow-hidden shadow-lg border border-muted dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 w-full max-w-4xl">
    {/* Left: Profile Image */}
    <Image
      src={educator.profileImage}
      alt={educator.name}
      width={192}
      height={192}
      className="w-full md:w-48 object-cover bg-muted dark:bg-gray-800"
    />
  
    {/* Right: Content */}
    <div className="flex-1 p-6 space-y-2">
      <div className="text-xl font-semibold">{educator.name}</div>
      <div className="text-sm text-muted-foreground dark:text-gray-400">
        {educator.username || educator.emailFallback}
      </div>
      <p className="text-sm">{educator.intro}</p>
  
      <div className="text-sm">
        <span className="font-medium">Qualification:</span> {educator.qualification}
      </div>
  
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span><span className="font-medium">Subjects:</span> {educator.subjects.join(", ")}</span>
        <span><span className="font-medium">Levels:</span> {educator.levels.join(", ")}</span>
      </div>
  
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span><span className="font-medium">Exam Tags:</span> {educator.exams.join(", ")}</span>
        <span><span className="font-medium">Price Range:</span> {educator.priceTier}</span>
      </div>
  
      {/* Stats */}
      <div className="flex flex-wrap gap-6 text-sm pt-2">
        <div>
          <span className="font-bold">{educator.yearsWithNextPhoton}+</span><br />
          <span className="text-muted-foreground dark:text-gray-400">Years w/ NextPhoton</span>
        </div>
        <div>
          <span className="font-bold">{educator.studentsTaught.toLocaleString()}</span><br />
          <span className="text-muted-foreground dark:text-gray-400">Students Taught</span>
        </div>
        <div>
          <span className="font-bold">{educator.hoursTaught.toLocaleString()}</span><br />
          <span className="text-muted-foreground dark:text-gray-400">Hours Taught</span>
        </div>
      </div>
  
      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button className="bg-primary text-white px-4 py-1.5 rounded-md dark:bg-slate-500 dark:text-slate-900">View Profile</button>
        <button className="border border-muted px-4 py-1.5 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">Message</button>
        <button className="border border-muted px-4 py-1.5 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">Call</button>
      </div>
    </div>
  </div>
  
  
)}

export default EducatorCard_forAdmin