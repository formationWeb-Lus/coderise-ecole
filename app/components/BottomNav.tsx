"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  ClipboardList,
  BarChart3,
} from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Cours",
      icon: BookOpen,
      path: "/dashboard/student/courses",
    },
    {
      label: "Pratique",
      icon: Code2,
      path: "/practice",
    },
    {
      label: "Annonces",
      icon: ClipboardList,
      path: "/dashboard/student/announcements",
    },
    {
      label: "Grades",
      icon: BarChart3,
      path: "/dashboard/student/grades",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0a1b2d] border-t border-gray-700 shadow-lg z-50">
      <div className="grid grid-cols-4 py-3">

        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center gap-1 py-1 transition"
            >
              {/* 🔥 Icône plus grande */}
              <Icon
                size={30}
                className={`transition ${
                  isActive ? "scale-110" : ""
                } text-white`}
              />

              {/* 🔥 Texte plus grand + couleur jaune */}
              <span
                className="text-sm font-semibold"
                style={{ color: "#FFD54F" }}
              >
                {item.label}
              </span>

              {/* 🔥 Indicateur actif amélioré */}
              {isActive && (
                <div className="w-2 h-1 bg-[#FFD54F] rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}