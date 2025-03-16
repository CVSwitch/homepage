"use client";

import { HomeIcon, DocumentIcon, ChatBubbleLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    icon: HomeIcon,
    href: "/",
  },
  {
    name: "Resume Analyzer",
    icon: DocumentIcon,
    href: "/analyzer",
  },
  {
    name: "Interview Prep",
    icon: ChatBubbleLeftIcon,
    href: "/interview",
  },
  {
    name: "Editor",
    icon: PencilIcon,
    href: "/editor",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed w-64 h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CVSwitch</h1>
        </div>

        <div className="flex-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
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
      </div>
    </nav>
  );
} 