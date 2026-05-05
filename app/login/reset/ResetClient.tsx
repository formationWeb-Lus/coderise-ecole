"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 🔄 animation progression comme register/login
  const submit = async () => {
    setLoading(true);
    setProgress(5);
    setError("");
    setMsg("");

    let interval: ReturnType<typeof setInterval>;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 5;
      });
    }, 200);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur");

      setProgress(100);
      setMsg("Compte mis à jour avec succès !");

      setTimeout(() => {
        router.push("/login");
      }, 800);

    } catch (err: any) {
      setError(err.message || "Erreur serveur");
      setProgress(0);
      setLoading(false);
    }

    return () => clearInterval(interval);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <h1>Réinitialiser le compte</h1>
          <p>Choisissez un nouveau nom d’utilisateur et mot de passe</p>
        </div>

        {/* FORM */}
        <div className="auth-form">

          <div className="field">
            <label>Nom d’utilisateur</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: jean_pierre"
            />
          </div>

          <div className="field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ex: Min 6 caractères"
            />
          </div>

          {error && <div className="error">{error}</div>}
          {msg && <div className="success">{msg}</div>}

          <button
            className="submit"
            onClick={submit}
            disabled={loading}
          >
            <span className="btn-text">
              {loading ? "Validation..." : "Réinitialiser"}
            </span>

            {loading && (
              <span
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>

        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          <button onClick={() => router.push("/login")}>
            ← Retour à la connexion
          </button>
        </div>
      </div>

      {/* 🎨 STYLE IDENTIQUE AU SYSTÈME */}
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
          box-sizing: border-box;
        }

        .field input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        /* BUTTON SYSTEM IDENTIQUE */
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
          transition: width 0.2s ease;
          z-index: 1;
        }

        /* MESSAGES */
        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }

        .success {
          background: #dcfce7;
          color: #166534;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }

        /* FOOTER */
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