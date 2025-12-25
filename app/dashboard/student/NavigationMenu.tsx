"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavigationMenu() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(
          "/dashboard/student/api/student/announcements/unread-count"
        );
        const data = await res.json();
        setUnreadCount(data.unreadCount);
      } catch (err) {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    // Rafraîchir toutes les 30s
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex flex-wrap items-center gap-6 p-4 bg-yellow-50 shadow-md">
      <Link
        href="/dashboard/student"
        className="font-bold text-yellow-800 hover:text-yellow-900 transition"
      >
        Dashboard
      </Link>

      <Link
        href="/dashboard/student/announcements"
        className="relative font-bold text-yellow-800 hover:text-yellow-900 transition"
      >
        Annonces
        {unreadCount > 0 && (
          <span
            className="absolute -top-2 -right-8 bg-red-600 text-white text-xs px-2 rounded-full animate-pulse"
            title={`${unreadCount} annonce(s) non lue(s)`}
          >
            {unreadCount}
          </span>
        )}
      </Link>

      <Link
        href="/dashboard/student/courses"
        className="font-bold text-yellow-800 hover:text-yellow-900 transition"
      >
        Cours
      </Link>

      <Link
        href="/dashboard/student/profile"
        className="font-bold text-yellow-800 hover:text-yellow-900 transition"
      >
        Profil
      </Link>
    </nav>
  );
}
