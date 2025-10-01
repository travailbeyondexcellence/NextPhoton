"use client";

import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import EducatorsCardsView_forAdmin from "@/components/EducatorsCardsView_forAdmin";
import EducatorsList_forAdmin from "@/components/EducatorsList_forAdmin";
import { LayoutGrid, List, UserPlus, User } from "lucide-react";

const Educators = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<"list" | "card">("list");

  const toggleView = () => {
    setView((prev) => (prev === "list" ? "card" : "list"));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 bg-transparent">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur-sm p-2 rounded-full text-primary border border-white/20">
              <User size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Educators</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleView}
              className="p-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 border border-white/20 transition-all"
              title={view === "list" ? "Switch to Card View" : "Switch to List View"}
            >
              {view === "list" ? <LayoutGrid size={20} /> : <List size={20} />}
            </button>
            <button
              className="p-2 bg-primary/20 backdrop-blur-sm rounded-lg hover:bg-primary/30 border border-primary/30 text-primary transition-all flex items-center gap-2 px-4 cursor-pointer"
              onClick={() => router.push(`${pathname}/createNewEducator`)}
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">Add Educator</span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div>
          {view === "list" ? (
            <EducatorsList_forAdmin initialView="table" />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EducatorsCardsView_forAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Educators;
