"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // pour l’inscription
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Gestion de l'inscription
  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        return;
      }

      // Login automatique après inscription
      const identifier = email || phone;

      const loginRes = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (loginRes?.error) setError(loginRes.error);
      else router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du login
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        identifier: phone,
        password,
        redirect: false,
      });

      if (res?.error) setError(res.error);
      else router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        {isRegister ? "Créer un compte" : "Se connecter"}
      </h1>

      {isRegister && (
        <>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />
        </>
      )}

      <input
        type="text"
        placeholder="Numéro de téléphone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <button
        onClick={isRegister ? handleRegister : handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading
          ? "Chargement..."
          : isRegister
          ? "S'inscrire"
          : "Se connecter"}
      </button>

      <p className="mt-3 text-sm text-gray-600">
        {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister ? "Se connecter" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
}
