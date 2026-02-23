"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  UserCog,
  Bell,
  Megaphone,
  GraduationCap,
  ClipboardList,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ActivityWatcher from "@/app/components/ActivityWatcher";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

   // 🎯 Tracking marketing
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_name: "Student Dashboard",
      });
    }
  }, []);

  useEffect(() => {
    const loadUnreadAnnouncements = async () => {
      try {
        const res = await fetch(
          "/dashboard/student/api/student/announcements/unread-count"
        );
        if (!res.ok) return;
        const data = await res.json();
        setUnreadAnnouncements(data.unreadCount || 0);
      } catch (error) {
        console.error("Erreur chargement annonces", error);
      }
    };

    const loadUnreadNotifications = async () => {
      try {
        const res = await fetch(
          "/dashboard/student/api/student/notifications/list"
        );
        if (!res.ok) return;
        const data = await res.json();
        const unreadCount = data.filter((n: any) => !n.isRead).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error("Erreur chargement notifications", error);
      }
    };

    loadUnreadAnnouncements();
    loadUnreadNotifications();
  }, []);

  const NavLinks = () => (
    <nav className="flex flex-col space-y-1 mt-3">
      <SidebarLink href="/dashboard/student" icon={<Home size={16} />}>
        Tableau de bord
      </SidebarLink>

      <SidebarLink href="/dashboard/student/courses" icon={<BookOpen size={16} />}>
        Mes cours
      </SidebarLink>

      <SidebarLink
        href="/dashboard/student/grades"
        icon={<GraduationCap size={16} />}
      >
        Notes
      </SidebarLink>

      <SidebarLink
        href="/dashboard/student/announcements"
        icon={<Megaphone size={16} />}
      >
        <span className="flex items-center gap-2">
          Annonces
          {unreadAnnouncements > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {unreadAnnouncements}
            </span>
          )}
        </span>
      </SidebarLink>

      <SidebarLink
        href="/dashboard/student/notifications"
        icon={<Bell size={16} />}
      >
        <span className="flex items-center gap-2">
          Notifications
          {unreadNotifications > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {unreadNotifications}
            </span>
          )}
        </span>
      </SidebarLink>

      <SidebarLink
        href="/dashboard/enrollment"
        icon={<ClipboardList size={16} />}
      >
        Inscriptions
      </SidebarLink>

      <hr className="my-2 border-blue-900" />

      <SidebarLink
        href="/dashboard/student/students"
        icon={<Users size={16} />}
      >
        Étudiants
      </SidebarLink>

      <SidebarLink
        href="/dashboard/student/help"
        icon={<UserCog size={16} />}
      >
        Contactez-nous
      </SidebarLink>

      <hr className="my-2 border-blue-900" />

      <SidebarLink href="/dashboard/profile" icon={<User size={16} />}>
        Profil
      </SidebarLink>
    </nav>
  );

  return (
    <SessionProvider>
      {/* 🔒 PROTECTION GLOBALE : auto logout + fermeture onglet */}
      <Script
  id="meta-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];
      t=b.createElement(e);t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
      }(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '4331977260409210');
      fbq('track', 'PageView');
    `,
  }}
/>
      <ActivityWatcher />

      <div className="min-h-screen flex bg-gray-100">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:flex flex-col bg-[#0a1b2d] text-yellow-200 min-h-screen w-64">
          <div className="flex items-center gap-2 px-4 py-4 border-b border-blue-900">
            <Image
              src="/favicon.png"
              alt="Coderise-Ecole"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl font-bold text-yellow-300">
              Coderise-Ecole
            </span>
          </div>
          <div className="flex-1 px-2">
            <NavLinks />
          </div>
        </aside>

        {/* HEADER MOBILE */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0a1b2d] border-b border-blue-900 flex items-center justify-between px-3">
          <div className="flex items-center gap-2 h-full">
            <Image
              src="/favicon.png"
              alt="Coderise-Ecole"
              width={60}
              height={40}
              className="object-contain h-10"
              priority
            />
            <span className="text-sm font-semibold text-yellow-300 truncate">
              Coderise-Ecole
            </span>
          </div>

          {open ? (
            <X
              size={20}
              onClick={() => setOpen(false)}
              className="cursor-pointer text-yellow-200"
            />
          ) : (
            <Menu
              size={20}
              onClick={() => setOpen(true)}
              className="cursor-pointer text-yellow-200"
            />
          )}
        </header>

        {/* SIDEBAR MOBILE */}
        {open && (
          <aside className="md:hidden fixed top-14 left-0 h-[calc(100vh-56px)] bg-[#0a1b2d] text-yellow-200 shadow-lg z-40 w-64">
            <div className="px-2 py-3">
              <NavLinks />
            </div>
          </aside>
        )}

        {/* CONTENU */}
        <main className="flex-1 flex flex-col pt-14 md:pt-0">
          <div className="flex-1 p-4 max-w-6xl mx-auto">
            {children}
          </div>

          <footer className="bg-[#0a1b2d] text-yellow-200 text-sm py-3 border-t border-blue-900">
            <div className="max-w-6xl mx-auto text-center">
              © {new Date().getFullYear()} Coderise-Ecole. Tous droits réservés.
            </div>
          </footer>
        </main>
      </div>
    </SessionProvider>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-yellow-200 hover:bg-blue-800 hover:text-yellow-300 transition-all duration-200"
    >
      <span className="opacity-90">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
