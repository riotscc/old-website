"use client";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import BadgesCard from "@/components/dashboard/cards/badges-card";

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <DashboardSidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <div className="w-full px-5 pb-16 pt-5 sm:px-7 lg:px-8 xl:px-10">
          <BadgesCard />
        </div>
      </main>
    </div>
  );
}