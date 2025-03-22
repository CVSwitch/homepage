"use client";

import { HomeIcon, DocumentIcon, ChatBubbleLeftIcon, PencilIcon, BriefcaseIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    name: "Cover Letter",
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
  
  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-10">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">CVSwitch</h1>
        </div>
        
        <div className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-1 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>© 2023 CVSwitch</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </div>
    </nav>
  );
} 