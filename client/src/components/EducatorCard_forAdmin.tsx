"use client";

import React from "react";
import Image from "next/image";

const educator = {
  name: "Dr. Meera Sharma",
  username: "@meera.physics",
  emailFallback: "meerasharma@nextphoton.com",
  intro: "Passionate Physics & Maths educator who simplifies the toughest topics. lorem20 years of experience in teaching JEE and NEET aspirants. I believe in making learning fun and engaging.",
  qualification: "Ph.D. in Theoretical Physics, IIT Bombay",
  subjects: ["Physics", "Mathematics"],
  levels: ["Senior School", "Junior College", "JEE Advanced"],
  exams: ["10th Boards", "JEE Main", "NEET", "Olympiads"],
  priceTier: "intermediate-2",
  yearsWithNextPhoton: 5,
  studentsTaught: 1800,
  hoursTaught: 3200,
  profileImage: "/educators/edumeerasharma.png",
};

const getPriceTagColor = (tier: string) => {
  switch (tier.toLowerCase()) {
    case "beginner-1":
      return "bg-[#F3E090FF] text-black";
      case "beginner-2":
      return "bg-[#F8DD65FF] text-black";
      case "beginner-3":
        return "bg-[#FFB303FF] text-black";
    case "intermediate-1":
      return "bg-[#51D9EBFF] text-black";
      case "intermediate-2":
      return "bg-[#0477FAFF] text-white";
      case "intermediate-3":
        return "bg-[#024EA6FF] text-white";
    case "premium-1":
      return "bg-[#F9618CFF] text-white";
      case "premium-2":
      return "bg-[#ff1e37] text-white";
      case "premium-3":
        return "bg-[#BA0419FF] text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const EducatorCard_forAdmin = () => {
  return (
    <div className="relative flex flex-col md:flex-row bg-background text-foreground rounded-xl overflow-hidden shadow-lg border border-muted dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 w-full max-w-4xl cursor-pointer hover:scale-[1.015] transition-transform duration-300">
      {/* Floating top-right price tag */}
      <div className={`absolute top-2 right-2 text-xs flex justify-center items-center font-semibold px-3 py-1 rounded ${getPriceTagColor(educator.priceTier)}`}>
        Price Range: {educator.priceTier}
      </div>

      {/* Educator Image */}
      <Image
        src={educator.profileImage}
        alt={educator.name}
        width={240}
        height={192}
        className="w-full  md:w-56 object-cover bg-muted dark:bg-gray-800  hover:scale-[1.05] transition-transform duration-300"
    
      />

      {/* Main Section */}
      <div className="flex-1 p-3 space-y-2">
          {/* Content Section */}
          <div className="flex-1 p-3 pb-1 space-y-2">
        <div className="text-xl font-semibold">{educator.name}</div>
        <div className="text-sm text-muted-foreground dark:text-gray-400">
          {educator.username || educator.emailFallback}
        </div>
        <p className="text-sm text-opacity-75 italic">{educator.intro}</p>

        <div className="text-sm">
          <span className="font-semibold text-muted-foreground dark:text-gray-400">Qualification:</span>{" "}
          {educator.qualification}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>
            <span className="font-medium text-muted-foreground dark:text-gray-400">Levels:</span>{" "}
            {educator.levels.join(", ")}
          </span>
          <span>
            <span className="font-medium text-muted-foreground dark:text-gray-400">Exam Tags:</span>{" "}
            {educator.exams.join(", ")}
          </span>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm pt-2">
          <div>
            <span className="font-bold">{educator.yearsWithNextPhoton}+</span>
            <br />
            <span className="text-muted-foreground dark:text-gray-400">
              Years w/ NextPhoton
            </span>
          </div>
          <div>
            <span className="font-bold">
              {educator.studentsTaught.toLocaleString()}
            </span>
            <br />
            <span className="text-muted-foreground dark:text-gray-400">
              Students Taught
            </span>
          </div>
          <div>
            <span className="font-bold">
              {educator.hoursTaught.toLocaleString()}
            </span>
            <br />
            <span className="text-muted-foreground dark:text-gray-400">
              Hours Taught
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button className="bg-primary text-white px-4 py-1.5 rounded-md dark:bg-slate-500 dark:text-slate-900">
            View Profile
          </button>
          <button className="border border-muted px-4 py-1.5 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            Message
          </button>
          <button className="border border-muted px-4 py-1.5 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            Call
          </button>
        </div>
          </div>

          {/* CARD FOOTER: Floating bottom-right subjects label */}
        <div className="footer-container bg-gray-200 dark:bg-gray-700 flex items-center justify-between  p-1 ml-2  rounded-sm text-sm font-semibold">
          
          <span className="text-muted-foreground dark:text-gray-400 px-2">Demo Lecture(s)</span>
          <div className=" card-footer  bottom-2 right-3 text-sm font-semibold border border-muted px-3 py-1 rounded bg-muted dark:bg-gray-800 dark:text-gray-100">
                <span className="text-muted-foreground dark:text-gray-400">Subjects:</span>{" "}
                 {educator.subjects.join(", ")}
          </div>
          </div>
        
      </div>
    </div>
  );
};

export default EducatorCard_forAdmin;
