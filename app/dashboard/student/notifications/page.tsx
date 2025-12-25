"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/dashboard/student/api/student/notifications/list");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch("/dashboard/student/api/student/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Chargement des notifications...</p>;

  if (notifications.length === 0) return <p>Aucune notification pour le moment.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-yellow-800">Notifications</h1>
      <ul className="space-y-3">
        {notifications.map(n => (
          <li
            key={n.id}
            className={`p-4 border rounded-md cursor-pointer transition ${
              n.isRead ? "bg-gray-100" : "bg-yellow-100"
            }`}
            onClick={() => !n.isRead && markAsRead(n.id)}
          >
            <h2 className="font-semibold">{n.title}</h2>
            <p className="text-gray-700">{n.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
            {!n.isRead && (
              <span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold mt-1">
                Nouveau
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
