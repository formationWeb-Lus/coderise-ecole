"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role, // rôle dynamique
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Compte créé avec succès ! Redirection en cours...");

        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRole("STUDENT");

        setTimeout(() => {
          router.push("/dashboard/enrollment");
        }, 1500);
      } else {
        setMessage(data.error || "Erreur lors de la création du compte");
      }
    } catch (error) {
      setMessage("Erreur serveur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Créer un compte
        </h2>

        {message && (
          <div className="mb-4 text-center text-blue-600 font-semibold">
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* Sélection du rôle */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "STUDENT" | "ADMIN")}
          className="w-full p-2 mb-6 border rounded bg-white"
          required
        >
          <option value="STUDENT">Étudiant</option>
          <option value="ADMIN">Administrateur</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded
                     hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Création en cours..." : "Créer le compte"}
        </button>
      </form>
    </div>
  );
}
