"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    validateField(key, value);
  };

  // 🔥 VALIDATION FIELD BY FIELD
  const validateField = (key: string, value: string) => {
    let message = "";

    if (key === "identifier") {
      if (!value.trim()) message = "Email ou téléphone requis";
    }

    if (key === "password") {
      if (!value.trim()) message = "Mot de passe requis";
      else if (value.length < 4) message = "Minimum 4 caractères";
    }

    setErrors((prev) => ({ ...prev, [key]: message }));
    return message === "";
  };

  const validate = () => {
    const a = validateField("identifier", form.identifier);
    const b = validateField("password", form.password);
    return a && b;
  };

  const handleLogin = async () => {
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier: form.identifier,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Identifiants incorrects");
      }

      router.push("/dashboard/student");
    } catch (e: any) {
      setError(e.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Accédez à votre espace étudiant</p>
        </div>

        {/* FORM */}
        <div className="auth-form">

          {/* IDENTIFIANT */}
          <div className="field">
            <label>Identifiant</label>
            <input
              type="text"
              placeholder="Email ou téléphone"
              value={form.identifier}
              onChange={(e) => update("identifier", e.target.value)}
              className={errors.identifier ? "input-error" : ""}
            />
            {errors.identifier && (
              <span className="error-text">{errors.identifier}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="forgot">
            <button onClick={() => router.push("/login/forgot")}>
              Mot de passe oublié ?
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="submit"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
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

        .field input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          transition: 0.2s;
        }

        .field input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .input-error {
          border-color: #ef4444 !important;
          background: #fff5f5;
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
        }

        .forgot {
          text-align: right;
        }

        .forgot button {
          background: none;
          border: none;
          font-size: 13px;
          color: #2563eb;
          cursor: pointer;
        }

        .forgot button:hover {
          text-decoration: underline;
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

        .submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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
          color: #374151;
        }

        .auth-footer button {
          border: none;
          background: none;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
        }

        .auth-footer button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}