"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Vérifier si l'utilisateur existe
  const checkIdentifier = async () => {
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Utilisateur introuvable");
      }

      setFoundUser(true);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Réinitialiser le mot de passe
  const resetPassword = async () => {
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      setMsg("✅ Mot de passe mis à jour avec succès. Redirection...");
      
      // 🔁 Redirection automatique vers la connexion
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Récupérer le compte</h1>

        {!foundUser ? (
          <>
            <p className="subtitle">
              Entrez votre email, téléphone ou nom d’utilisateur.
            </p>

            <input
              className="input"
              placeholder="Email, téléphone ou username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <button className="btn" onClick={checkIdentifier} disabled={loading}>
              {loading ? "Vérification..." : "Vérifier"}
            </button>
          </>
        ) : (
          <>
            <p className="subtitle">
              Utilisateur trouvé. Entrez un nouveau mot de passe.
            </p>

            <input
              type="password"
              className="input"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button className="btn" onClick={resetPassword} disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </>
        )}

        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}

        {/* 🔙 Retour connexion */}
        <div className="back-login">
          <button onClick={() => router.push("/login")}>
            ← Retour à la connexion
          </button>
        </div>
      </div>

      {/* 🎨 STYLE */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          padding: 20px;
        }

        .card {
          background: white;
          padding: 30px 25px;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .subtitle {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 15px;
        }

        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          margin-bottom: 15px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success {
          margin-top: 15px;
          text-align: center;
          color: #16a34a;
          font-weight: 600;
        }

        .error {
          margin-top: 15px;
          text-align: center;
          color: #dc2626;
          font-weight: 600;
        }

        .back-login {
          margin-top: 20px;
          text-align: center;
        }

        .back-login button {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
        }

        .back-login button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
