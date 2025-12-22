"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col space-y-1 mt-4">
      <SidebarLink href="/dashboard/student" icon={<Home size={18} />}>
        Tableau de bord
      </SidebarLink>

      <SidebarLink href="/dashboard/student/courses" icon={<BookOpen size={18} />}>
        Mes cours
      </SidebarLink>
      
      <SidebarLink href="/dashboard/student/grades" icon={<GraduationCap size={18} />}>
        Grades
      </SidebarLink>
      
      <SidebarLink href="/dashboard/enrollments" icon={<ClipboardList size={18} />}>
        Inscriptions
      </SidebarLink>


      <hr className="my-3 border-blue-500" />

      <SidebarLink href="/dashboard/student/students" icon={<Users size={18} />}>
        Étudiants
      </SidebarLink>

      <SidebarLink href="/dashboard/student/teachers" icon={<UserCog size={18} />}>
        Enseignants
      </SidebarLink>

      <SidebarLink href="/dashboard/student/announcements" icon={<Megaphone size={18} />}>
        Annonces
      </SidebarLink>

      <SidebarLink href="/dashboard/student/notifications" icon={<Bell size={18} />}>
        Notifications
      </SidebarLink>


      <hr className="my-3 border-blue-500" />

      <SidebarLink href="/dashboard/profile" icon={<User size={18} />}>
        Profil
      </SidebarLink>
    </nav>
  );

  return (
    <SessionProvider>
      <div className="min-h-screen flex bg-gray-100">

        {/* 🟦 SIDEBAR DESKTOP */}
        <aside className="hidden md:flex w-64 flex-col bg-blue-700 text-orange-400 min-h-screen">
          <h1 className="text-2xl font-bold px-6 py-6 border-b border-blue-500 text-orange-300">
            Titien
          </h1>
          <div className="flex-1 px-4">
            <NavLinks />
          </div>
        </aside>

        {/* 📱 HEADER MOBILE */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-blue-500 border-b border-blue-500 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-300">
            Titien
          </h1>

          {open ? (
            <X
              size={28}
              onClick={() => setOpen(false)}
              className="cursor-pointer text-orange-400"
            />
          ) : (
            <Menu
              size={28}
              onClick={() => setOpen(true)}
              className="cursor-pointer text-orange-400"
            />
          )}
        </header>

        {/* 📱 SIDEBAR MOBILE */}
        {open && (
          <aside className="md:hidden fixed top-16 left-0 w-64 h-full bg-blue-700 text-orange-400 shadow-lg z-40">
            <div className="px-4">
              <NavLinks />
            </div>
          </aside>
        )}

        {/* 🟩 CONTENU */}
        <main className="flex-1 p-6 mt-16 md:mt-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}

/* 🔹 Lien Sidebar stylé */
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
      className="
        flex items-center gap-3 px-4 py-2 rounded-md
        text-orange-400
        hover:bg-blue-400 hover:text-orange-300
        transition-all duration-200
      "
    >
      <span className="opacity-90">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
