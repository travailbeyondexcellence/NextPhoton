import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

import { educator as defaultEducator } from "@/app/(dashboard)/admin/educators/[educatorID]/dummyData";

type Educator = typeof defaultEducator;

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

  return (
    <div className="relative flex flex-col xl:flex-row bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 w-full cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-300">
      {/* Price Tag */}
      <div
        className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1 rounded ${getPriceTagColor(educator.priceTier)}`}
      >
        Price Range: {educator.priceTier}
      </div>

      {/* Educator Image */}
      {educator.profileImage ? (
        <Image
          src={educator.profileImage}
          alt={educator.name}
          width={240}
          height={192}
          className="w-full md:w-56 object-cover bg-white/5"
        />
      ) : (
        <div className="w-full md:w-56 h-48 bg-primary/10 flex items-center justify-center border-r border-white/10">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {getInitials(educator.name)}
            </span>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="flex-1 p-3 space-y-2">
        <div className="text-xl font-semibold text-foreground">{educator.name}</div>
        <div className="text-sm text-muted-foreground">
          {educator.username || educator.emailFallback}
        </div>
        <p className="text-sm italic text-foreground">{educator.intro}</p>
        <div className="text-sm text-foreground">
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
        <div className="flex gap-3 pt-1">
          <button
            className="bg-primary/20 text-primary px-4 py-1.5 rounded-md border border-primary/30 hover:bg-primary/30 transition-all"
            onClick={() => router.push(`/admin/educators/${educator.id}`)}
          >
            View Profile
          </button>
          <button className="bg-white/5 px-4 py-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-all text-foreground">
            Message
          </button>
          <button className="bg-white/5 px-4 py-1.5 rounded-md border border-white/10 hover:bg-white/10 transition-all text-foreground">
            Call
          </button>
        </div>

        {/* Footer */}
        <div className="footer-container bg-white/5 flex items-center justify-between p-2 rounded-md text-sm font-semibold border border-white/10">
          <span className="text-muted-foreground px-2">Demo Lecture(s)</span>
          <div className="px-3 py-1 rounded bg-white/5 border border-white/10">
            <span className="text-muted-foreground">Subjects:</span>{" "}
            <span className="text-foreground">{educator.subjects.join(", ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorCard_forAdmin;
