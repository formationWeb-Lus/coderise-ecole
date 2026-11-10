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

  // 🔄 ANIMATION BARRE DE PROGRESSION
  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

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

      if (!res.ok) throw new Error(data.message || "Échec de la réinitialisation.");

      setProgress(100);
      setMsg("Votre compte a été mis à jour avec succès ! Redirection...");

      setTimeout(() => {
        router.push("/auth/signin");
      }, 1200);

    } catch (err: any) {
      setError(err.message || "Une erreur réseau est survenue.");
      setProgress(0);
      setLoading(false);
    }

    return () => clearInterval(interval);
  };

  return (
    <div className="auth-page font-['IBM_Plex_Sans',system-ui,sans-serif]">
      <div className="auth-card">

        {/* HEADER BRANDING */}
        <div className="auth-header">
          <div className="brand-logo">
            ANGLO <span>PHONY</span>
          </div>
          <p className="brand-sub">DRC School — Espace Sécurité</p>
          <h1>Réinitialisation du Compte</h1>
          <p className="auth-subtitle">Définissez vos nouveaux identifiants d'accès</p>
        </div>

        {/* FORMULAIRE */}
        <div className="auth-form">

          <div className="field">
            <label>Nom d’utilisateur ou identifiant</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: jean_pierre"
            />
          </div>

          <div className="field">
            <label>Nouveau mot de passe sécurisé</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
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
              {loading ? "Mise à jour en cours..." : "Valider les modifications"}
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
          <button onClick={() => router.push("/auth/signin")}>
            ← Retourner à la connexion
          </button>
        </div>
      </div>

      {/* ===== STYLES PROFESSIONNELS (ANGLOPHONY / BRIGHTSPOT) ===== */}
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #071b43, #174ea6);
          padding: 24px 16px;
        }

        .auth-card {
          background: #ffffff;
          padding: 40px 36px;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 25px 50px -12px rgba(7, 27, 67, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-logo {
          font-size: 28px;
          font-weight: 900;
          color: #071b43;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .brand-logo span {
          color: #ed1c24;
        }

        .brand-sub {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #174ea6;
          margin-bottom: 16px;
        }

        .auth-header h1 {
          font-size: 26px;
          font-weight: 800;
          color: #071b43;
          margin-bottom: 4px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 14px;
          font-weight: 700;
          color: #071b43;
        }

        .field input {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 8px;
          border: 1.5px solid #cbd5e1;
          background: #f8fafc;
          color: #071b43;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }

        .field input::placeholder {
          color: #94a3b8;
          font-size: 14px;
        }

        .field input:focus {
          border-color: #174ea6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(23, 78, 166, 0.15);
        }

        .submit {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          border: none;
          background: #ed1c24;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          box-shadow: 0 4px 12px rgba(237, 28, 36, 0.25);
          margin-top: 6px;
        }

        .submit:hover:not(:disabled) {
          background: #c9151d;
          transform: translateY(-1px);
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
          background: #071b43;
          transition: width 0.2s ease;
          z-index: 1;
        }

        .error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }

        .success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }

        .auth-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 14px;
        }

        .auth-footer button {
          border: none;
          background: none;
          color: #174ea6;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .auth-footer button:hover {
          color: #ed1c24;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}