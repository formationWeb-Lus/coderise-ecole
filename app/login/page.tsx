"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // 🔄 animation loading bar
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 4;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(5);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

     if (res?.error) throw new Error("Identifiants incorrects");

// 👉 récupérer session pour role
const session = await fetch("/api/auth/session").then(r => r.json());

console.log("SESSION :", session);
console.log("ROLE :", session?.user?.role);

const role = session?.user?.role;

setProgress(100);

      setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/dashboard");
        } else if (role === "STUDENT") {
          router.push("/dashboard/student");
        } else if (role === "TEACHER") {
          router.push("/dashboard/teacher");
        } else {
          router.push("/dashboard");
        }
      }, 400);

    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Accédez à votre espace personnel</p>
        </div>

        {/* FORM */}
        <div className="auth-form">

          <div className="field">
            <label>Identifiant</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email ou téléphone"
            />
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* 🔥 FORGOT PASSWORD (STYLE PRO IDENTIQUE) */}
          <div className="forgot">
            <button onClick={() => router.push("/login/forgot")}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="submit" onClick={handleLogin} disabled={loading}>
            <span className="btn-text">
              {loading ? "Connexion..." : "Se connecter"}
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
          Pas encore de compte ?{" "}
          <button onClick={() => router.push("/register")}>
            Créer un compte
          </button>
        </div>
      </div>

      {/* ===== STYLE IDENTIQUE SYSTEME ===== */}
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
          font-size: 34px;
          font-weight: 700;
        }

        .auth-header p {
          font-size: 18px;
          color: #6b7280;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field label {
          font-size: 18px;
          font-weight: 600;
        }

        .field input {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
        }

        .forgot {
          text-align: right;
        }

        .forgot button {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 15px;
          cursor: pointer;
          font-weight: 500;
        }

        .submit {
          position: relative;
          overflow: hidden;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: #0f172a;
          color: white;
          font-size: 18px;
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

        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }

        .auth-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 16px;
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
