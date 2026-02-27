"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !password || (!email && !phone)) {
      setError("Veuillez remplir les champs obligatoires");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Créer le compte
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // 2️⃣ Connexion automatique
      const login = await signIn("credentials", {
        identifier: email || phone,
        password,
        redirect: false,
      });

      if (login?.error) {
        throw new Error("Connexion automatique échouée");
      }

      // 3️⃣ Redirection directe dashboard
      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/student");
      }

    } catch (err: any) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Inscrivez-vous pour accéder à la plateforme</p>
        </div>

        {/* FORM */}
        <div className="auth-form">

          <div className="field">
            <label>Nom</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Téléphone</label>
            <input
              type="text"
              placeholder="+243..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}

          <button className="submit" onClick={handleRegister} disabled={loading}>
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          Déjà un compte ?{" "}
          <button onClick={() => router.push("/auth/signin")}>
            Se connecter
          </button>
        </div>
      </div>

      {/* STYLE IDENTIQUE LOGIN */}
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #020617, #0f172a);
          padding: 20px;
        }

        .auth-card {
          background: white;
          padding: 36px 32px;
          border-radius: 18px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-header h1 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .auth-header p {
          font-size: 14px;
          color: #6b7280;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .field input,
        .field select {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
        }

        .submit {
          margin-top: 8px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }

        .submit:hover {
          background: #1d4ed8;
        }

        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
        }

        .auth-footer {
          margin-top: 22px;
          text-align: center;
          font-size: 14px;
        }

        .auth-footer button {
          border: none;
          background: none;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}