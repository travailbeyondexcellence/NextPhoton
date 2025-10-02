import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

import educatorsData from '../../mock-data/educators.json';

type Educator = typeof educatorsData.data[0];

// type Educator = {
//   id: string;
//   name: string;
//   username: string;
//   emailFallback: string;
//   intro: string;
//   qualification: string;
//   subjects: string[];
//   levels: string[];
//   exams: string[];
//   priceTier: string;
//   yearsWithNextPhoton: number;
//   studentsTaught: number;
//   hoursTaught: number;
//   profileImage: string;
// };

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

const EducatorCard_forAdmin = ({ educator = defaultEducator }: { educator?: Educator }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex flex-col md:flex-row bg-white/[0.02] backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 w-full min-h-[250px] md:min-h-[220px] cursor-pointer hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300">
      {/* Price Tag */}
      <div
        className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded z-10 ${getPriceTagColor(educator.priceTier)}`}
      >
        Price Range: {educator.priceTier}
      </div>

      {/* Educator Image */}
      {educator.profileImage && !imageError ? (
        <Image
          src={educator.profileImage}
          alt={educator.name}
          width={240}
          height={192}
          className="w-full md:w-48 lg:w-56 xl:w-64 h-48 md:h-full object-cover bg-white/[0.01]"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full md:w-48 lg:w-56 xl:w-64 h-48 md:h-full md:min-h-[200px] bg-primary/[0.05] flex items-center justify-center md:border-r border-white/5">
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {getInitials(educator.name)}
            </span>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="flex-1 p-4 md:p-5 space-y-2">
        <div className="text-xl font-semibold text-foreground">{educator.name}</div>
        <div className="text-sm text-muted-foreground">
          {educator.username || educator.emailFallback}
        </div>
        <p className="text-sm italic text-foreground line-clamp-2">{educator.intro}</p>
        <div className="text-sm text-foreground line-clamp-1">
          <span className="font-semibold text-muted-foreground">Qualification:</span>{" "}
          {educator.qualification}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>
            <span className="font-medium text-muted-foreground">Levels:</span>{" "}
            {educator.levels.join(", ")}
          </span>
          <span>
            <span className="font-medium text-muted-foreground">Exam Tags:</span>{" "}
            {educator.exams.join(", ")}
          </span>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-sm pt-2">
          <div>
            <span className="font-bold">{educator.yearsWithNextPhoton}+</span>
            <br />
            <span className="text-muted-foreground">Years w/ NextPhoton</span>
          </div>
          <div>
            <span className="font-bold">{educator.studentsTaught.toLocaleString()}</span>
            <br />
            <span className="text-muted-foreground">Students Taught</span>
          </div>
          <div>
            <span className="font-bold">{educator.hoursTaught.toLocaleString()}</span>
            <br />
            <span className="text-muted-foreground">Hours Taught</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            className="bg-primary/10 text-primary px-4 py-2 rounded-md border border-primary/20 hover:bg-primary/20 transition-all text-sm"
            onClick={() => router.push(`/admin/educators/${educator.id}`)}
          >
            View Profile
          </button>
          <button className="bg-white/[0.02] px-4 py-2 rounded-md border border-white/5 hover:bg-white/[0.05] transition-all text-foreground text-sm">
            Message
          </button>
          <button className="bg-white/[0.02] px-4 py-2 rounded-md border border-white/5 hover:bg-white/[0.05] transition-all text-foreground text-sm">
            Call
          </button>
        </div>

        {/* Footer */}
        <div className="footer-container bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md text-xs border border-white/5 gap-2 mt-2">
          <span className="text-muted-foreground font-medium">Demo Lecture(s)</span>
          <div className="px-2 py-1 rounded bg-white/[0.02] border border-white/5">
            <span className="text-muted-foreground">Subjects:</span>{" "}
            <span className="text-foreground font-medium">{educator.subjects.join(", ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorCard_forAdmin;
