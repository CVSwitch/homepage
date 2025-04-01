"use client";

import { 
  HomeIcon, 
  DocumentIcon, 
  ChatBubbleLeftIcon, 
  BriefcaseIcon, 
  DocumentTextIcon, 
  ArrowRightOnRectangleIcon, 
  MoonIcon, 
  SunIcon,
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  {
    name: "Dashboard",
    icon: HomeIcon,
    href: "/home",
  },
  {
    name: "Resume Optimizer",
    icon: DocumentIcon,
    href: "/resume-optimizer",
  },
  {
    name: "LinkedIn Optimizer",
    icon: BriefcaseIcon,
    href: "/linkedin-optimizer",
  },
  {
    name: "Cover Letters",
    icon: DocumentTextIcon,
    href: "/cover-letter",
  },
  {
    name: "Interview Prep",
    icon: ChatBubbleLeftIcon,
    href: "/interview-prep",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProTooltip, setShowProTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">CVSwitch</h1>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Enhanced Upgrade to Pro Section with new color theme */}
        <div 
          className="relative"
          onMouseEnter={() => setShowProTooltip(true)}
          onMouseLeave={() => setShowProTooltip(false)}
        >
          <button 
            onClick={() => router.push('/upgrade')}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">Upgrade to Pro</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                <BoltIcon className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold text-white">23 tokens</span>
              </div>
            </div>
            <div className="relative z-10 mt-2 flex items-center gap-1">
              <CheckBadgeIcon className="w-4 h-4 text-white/90" />
              <span className="text-xs text-white/90">Premium features unlocked</span>
            </div>
          </button>

          {showProTooltip && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white dark:bg-gray-700 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
              <h4 className="font-bold text-sm text-gray-800 dark:text-white mb-1">Pro Benefits:</h4>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Unlimited AI optimizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Advanced performance analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>Exclusive templates</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {mounted && theme === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
          <span>{mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>

        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 px-3">
            <p>© {new Date().getFullYear()} CVSwitch</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </div>
    </nav>
  );
}