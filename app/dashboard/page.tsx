"use client";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import OverviewCard from "@/components/dashboard/cards/overview-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#080808] dark:text-white">
      <DashboardSidebar />

      <main className="min-h-screen lg:ml-[250px]">
        <div className="w-full px-5 pb-16 pt-5 sm:px-7 lg:px-8 xl:px-10">
          <OverviewCard />
        </div>
      </main>
    </div>
  );
}