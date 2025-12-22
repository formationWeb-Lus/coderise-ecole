"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function AnnouncementIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/dashboard/student/api/student/announcements/unread-count")
      .then((r) => r.json())
      .then((d) => setCount(d.unreadCount));
  }, []);

  return (
    <Link
      href="/dashboard/student/announcements"
      className="relative"
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}
