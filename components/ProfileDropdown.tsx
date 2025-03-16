"use client";

import { useState } from "react";
import { Cog6ToothIcon, UserCircleIcon, SparklesIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ProfileDropdown() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 hover:border-blue-200 transition-colors"
      >
        <img 
          src="https://i.pravatar.cc/32" 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium">Sarah Johnson</p>
            <p className="text-sm text-gray-500">sarah@example.com</p>
          </div>
          
          <div className="py-1">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <UserCircleIcon className="w-5 h-5" />
              Profile
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                Upgrade to Pro
              </div>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                23 tokens left
              </span>
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <MoonIcon className="w-5 h-5" />
              Dark Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 