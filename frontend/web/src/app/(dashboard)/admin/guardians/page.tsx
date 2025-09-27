"use client";

import React from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import GuardiansCardsView_forAdmin from "@/components/GuardiansCardsView_forAdmin";
import GuardiansList_forAdmin from "@/components/GuardiansList_forAdmin";
import { LayoutGrid, List, UserPlus, Users } from "lucide-react";

const Guardians = () => {
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
              <Users size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Guardians</h1>
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
              onClick={() => router.push(`${pathname}/createNewGuardian`)}
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">Add Guardian</span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          {view === "list" ? (
            <GuardiansList_forAdmin initialView="table" />
          ) : (
            <div className="p-6">
              <GuardiansCardsView_forAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guardians;