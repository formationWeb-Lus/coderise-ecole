"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Header({ session }: { session: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(
    session?.user?.image || "/default-profile.png"
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await fetch("/api/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) setProfileImage(data.imageUrl);
  };

  return (
    <header className="relative bg-white shadow-md p-4 flex items-center justify-between">
      {/* Titre ou Logo */}
      <h1 className="text-xl font-bold shrink-0">Tableau de bord</h1>

      {/* Photo de profil seule en haut à droite */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="focus:outline-none"
        >
          <Image
            src={profileImage}
            alt="Profil"
            width={50}
            height={50}
            className="rounded-full border border-gray-300"
          />
        </button>

        {/* Menu dropdown */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50">
            <label className="block p-2 cursor-pointer hover:bg-gray-100">
              Changer la photo
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            <button className="block w-full text-left p-2 hover:bg-gray-100">
              Paramètres du compte
            </button>

            <button
              onClick={() => signOut()}
              className="block w-full text-left p-2 text-red-600 hover:bg-gray-100"
            >
              Fermer la session
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
