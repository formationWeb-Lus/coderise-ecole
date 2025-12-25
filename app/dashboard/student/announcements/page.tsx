"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  isRead: boolean;
}

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les annonces
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/dashboard/student/api/student/announcements/list");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch("/dashboard/student/api/student/announcements/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId: id }),
      });
      // Mettre à jour l'état pour retirer le badge
      setAnnouncements(prev =>
        prev.map(a => (a.id === id ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-yellow-800">
        Mes annonces
      </h1>

      {announcements.length === 0 && <p>Aucune annonce pour le moment.</p>}

      <ul className="space-y-4">
        {announcements.map(a => (
          <li
            key={a.id}
            className={`p-4 border rounded-lg transition ${
              a.isRead ? "bg-gray-100" : "bg-yellow-100"
            } hover:shadow cursor-pointer`}
            onClick={() => markAsRead(a.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg text-yellow-800">
                  {a.title}
                </h2>
                <p className="text-gray-700 mt-1">{a.content}</p>
              </div>
              {!a.isRead && (
                <span className="text-sm bg-red-600 text-white px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
            </div>
            {a.videoUrl && (
              <a
                href={a.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-700 font-bold hover:underline"
              >
                Voir la vidéo
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
