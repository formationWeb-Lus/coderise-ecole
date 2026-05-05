"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [foundUser, setFoundUser] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🔄 PROGRESSION STYLE PRO (comme register/login)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 4;
        });
      }, 180);
    }

    return () => clearInterval(interval);
  }, [loading]);

  // 1️⃣ CHECK USER
  const checkIdentifier = async () => {
    setError("");
    setMsg("");
    setLoading(true);
    setProgress(5);

    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Utilisateur introuvable");

      setProgress(100);

      setTimeout(() => {
        setFoundUser(true);
        setLoading(false);
        setProgress(0);
      }, 400);
    } catch (err: any) {
      setError(err.message || "Erreur");
      setLoading(false);
      setProgress(0);
    }
  };

  // 2️⃣ RESET PASSWORD
  const resetPassword = async () => {
    setError("");
    setMsg("");
    setLoading(true);
    setProgress(5);

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

      if (!res.ok) throw new Error(data.message || "Erreur");

      setProgress(100);

      setMsg("Mot de passe mis à jour avec succès !");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur serveur");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <h1>Récupération du compte</h1>
          <p>Retrouvez votre accès en toute sécurité</p>
        </div>

        {/* FORM */}
        <div className="auth-form">

          {!foundUser ? (
            <>
              <div className="field">
                <label>Email / Téléphone / Username</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ex: jean@gmail.com ou +243810000000"
                />
              </div>

              <button
                className="submit"
                onClick={checkIdentifier}
                disabled={loading}
              >
                <span className="btn-text">
                  {loading ? "Vérification..." : "Vérifier le compte"}
                </span>

                {loading && (
                  <span
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            </>
          ) : (
            <>
              <div className="field">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ex: Abc12345"
                />
              </div>

              <button
                className="submit"
                onClick={resetPassword}
                disabled={loading}
              >
                <span className="btn-text">
                  {loading ? "Mise à jour..." : "Réinitialiser"}
                </span>

                {loading && (
                  <span
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            </>
          )}

          {msg && <div className="success">{msg}</div>}
          {error && <div className="error">{error}</div>}
        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          <button onClick={() => router.push("/login")}>
            ← Retour à la connexion
          </button>
        </div>
      </div>

      {/* ===== STYLE IDENTIQUE REGISTER ===== */}
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
          padding: 32px;
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-header h1 {
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 700;
        }

        .auth-header p {
          font-size: clamp(14px, 2vw, 18px);
          color: #6b7280;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 17px;
          font-weight: 600;
        }

        .field input {
          width: 100%;
          padding: 16px 18px;
          font-size: 16px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
        }

        .field input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .submit {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: #0f172a;
          color: white;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-text {
          position: relative;
          z-index: 2;
        }

        .progress-bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, #ca8a04, #facc15);
          z-index: 1;
        }

        .success {
          background: #dcfce7;
          color: #166534;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
        }

        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
        }

        .auth-footer {
          margin-top: 20px;
          text-align: center;
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