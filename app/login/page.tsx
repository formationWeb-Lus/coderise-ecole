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
      const session = await fetch("/api/auth/session").then((r) => r.json());

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
    <div className="auth-page font-['IBM_Plex_Sans',system-ui,sans-serif]">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <div className="brand-logo">
            ANGLO <span>PHONY</span>
          </div>
          <p className="brand-sub">DRC School — Académie d'Anglais</p>
          <h1>Connexion</h1>
          <p className="auth-subtitle">Accédez à votre espace personnel d'apprentissage</p>
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

          {/* FORGOT PASSWORD */}
          <div className="forgot">
            <button onClick={() => router.push("/login/forgot")}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="submit" onClick={handleLogin} disabled={loading}>
            <span className="btn-text">
              {loading ? "Connexion en cours..." : "Se connecter"}
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
          Pas encore d'espace étudiant ?{" "}
          <button onClick={() => router.push("/register")}>
            S'inscrire (70 USD)
          </button>
        </div>
      </div>

      {/* ===== STYLE ADAPTÉ BRIGHTSPOT / ANGLOPHONY ===== */}
      <style jsx>{`

        .auth-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #071b43, #174ea6);
          padding: 20px;
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
          font-size: 26px;
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
          font-size: 28px;
          font-weight: 800;
          color: #071b43;
          margin-bottom: 4px;
        }

        .auth-subtitle {
          font-size: 15px;
          color: #64748b;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #071b43;
          margin-bottom: 6px;
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
        }

        .field input:focus {
          border-color: #174ea6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(23, 78, 166, 0.15);
        }

        .forgot {
          text-align: right;
          margin-top: -6px;
        }

        .forgot button {
          background: none;
          border: none;
          color: #174ea6;
          font-size: 14px;
          cursor: pointer;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .forgot button:hover {
          color: #ed1c24;
          text-decoration: underline;
        }

        .submit {
          position: relative;
          overflow: hidden;
          padding: 15px;
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
          font-size: 14px;
          font-weight: 600;
        }

        .auth-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-t: 1px solid #e2e8f0;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }

        .auth-footer button {
          border: none;
          background: none;
          color: #ed1c24;
          font-weight: 700;
          cursor: pointer;
          margin-left: 4px;
          transition: color 0.2s ease;
        }

        .auth-footer button:hover {
          color: #071b43;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}