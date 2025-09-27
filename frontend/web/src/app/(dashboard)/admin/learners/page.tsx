"use client";

import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import LearnersCardsView_forAdmin from "@/components/LearnersCardsView_forAdmin";
import LearnersList_forAdmin from "@/components/LearnersList_forAdmin";
import { LayoutGrid, List, UserPlus, GraduationCap } from "lucide-react";

const Learners = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<"list" | "card">("list");

  const toggleView = () => {
    setView((prev) => (prev === "list" ? "card" : "list"));
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full text-primary border border-white/20">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Learners</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleView}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 border border-white/20 transition-all"
              title={view === "list" ? "Switch to Card View" : "Switch to List View"}
            >
              {view === "list" ? <LayoutGrid size={20} /> : <List size={20} />}
            </button>
            <button 
              className="p-2 bg-primary/20 backdrop-blur-sm rounded-lg hover:bg-primary/30 border border-primary/30 text-primary transition-all flex items-center gap-2 px-4"
              onClick={() => router.push(`${pathname}/createNewLearner`)}
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">Add Learner</span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          {view === "list" ? (
            <LearnersList_forAdmin initialView="table" />
          ) : (
            <div className="p-6">
              <LearnersCardsView_forAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learners;