"use client";

import React from 'react';
import { useState } from "react";
import { Cog6ToothIcon, UserCircleIcon, SparklesIcon, MoonIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface ProfileDropdownProps {
  user: firebase.User | null; // Adjust the type based on your user object
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/'); // Redirect to landing page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 hover:border-blue-200 transition-colors"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">👤</span>
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium">{user?.displayName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.email || "No email available"}</p>
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
            <div className="border-t border-gray-100 mt-1"></div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 