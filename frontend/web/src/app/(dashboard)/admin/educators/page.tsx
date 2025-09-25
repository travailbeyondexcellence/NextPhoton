"use client";

import React from "react";

import { useRouter, usePathname } from 'next/navigation';

import { useState } from "react";
import EducatorsCardsView_forAdmin from "@/components/EducatorsCardsView_forAdmin";
import EducatorsList_forAdmin from "@/components/EducatorsList_forAdmin";
import { LayoutGrid, List, UserPlus } from "lucide-react";

import EducatorCard_forAdmin from "@/components/EducatorCard_forAdmin";

const Educators = () => {

  const router = useRouter();
  const pathname = usePathname()

  const [view, setView] = useState<"list" | "card">("list");

  const toggleView = () => {
    setView((prev) => (prev === "list" ? "card" : "list"));
  };

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Educators</h1>
        <p className="text-muted-foreground">Manage and monitor all educators on the platform</p>
      </div>

      {/* Controls Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleView}
            className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 transition-all"
            title="Toggle View"
          >
            {view === "list" ? <LayoutGrid size={20} /> : <List size={20} />}
          </button>
          <button 
            className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/15 transition-all" 
            onClick={() => router.push(`${pathname}/createNewEducator`)}
          >
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {view === "list" ? (
        <EducatorsList_forAdmin />
      ) : (
        <EducatorsCardsView_forAdmin />
      )}
    </div>
  );
};

export default Educators;
