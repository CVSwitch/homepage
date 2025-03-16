"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { HeroSection } from "@/components/HeroSection";
import { QuickActions } from "@/components/QuickActions";
import { StatsGrid } from "@/components/StatsGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6">
        {/* Header with Welcome and Profile */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">Sarah</span>! 👋
          </h1>
          <ProfileDropdown />
        </div>

        <HeroSection />
        <QuickActions />
        <StatsGrid />
      </main>
    </div>
  );
}
