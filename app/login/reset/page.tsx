export const dynamic = "force-dynamic";

"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de la réinitialisation");
        return;
      }

      setMsg("Nom d’utilisateur et mot de passe mis à jour avec succès !");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page">
        <div className="card">
          <h1>Réinitialiser le compte</h1>
          <p className="subtitle">
            Choisissez un nouveau nom d’utilisateur et mot de passe.
          </p>

          <input
            className="input-field"
            placeholder="Nouveau nom d’utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input-field"
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" onClick={submit} disabled={loading}>
            {loading ? "Validation..." : "Réinitialiser"}
          </button>

          {msg && <p className="success">{msg}</p>}
          {error && <p className="error">{error}</p>}

          <a href="/login" className="back">
            ← Retour à la connexion
          </a>
        </div>
      </div>

      <style jsx>{`
        /* PAGE */
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          padding: 20px;
          font-family: "Inter", sans-serif;
        }

        /* CARD */
        .card {
          background: #ffffff;
          padding: 36px 32px;
          border-radius: 16px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
          text-align: center;
        }

        .subtitle {
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 24px;
        }

        .input-field {
          width: 100%;
          padding: 14px;
          margin-bottom: 20px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 0.95rem;
          transition: all 0.2s ease-in-out;
        }

        .input-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }

        .btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .success {
          margin-top: 16px;
          color: #166534;
          background-color: #dcfce7;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          text-align: center;
          width: 100%;
        }

        .error {
          margin-top: 16px;
          color: #b91c1c;
          background-color: #fee2e2;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          text-align: center;
          width: 100%;
        }

        .back {
          margin-top: 22px;
          font-size: 0.85rem;
          color: #2563eb;
          text-decoration: none;
          text-align: center;
        }

        .back:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .card {
            padding: 28px 20px;
          }
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
