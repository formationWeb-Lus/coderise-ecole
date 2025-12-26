"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Charger l'image de profil depuis ton API
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile/${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.image) setProfileImage(data.image);
        });
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.image) {
      setProfileImage(data.image);
      alert("Photo de profil mise à jour !");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profil de {session?.user?.name}</h1>

        {/* Avatar + Déconnexion */}
        <div className="flex items-center gap-2">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              {session?.user?.name?.[0]}
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Upload photo */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Modifier la photo de profil</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
