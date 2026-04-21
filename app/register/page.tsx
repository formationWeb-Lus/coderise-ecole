"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    validateField(key, value);
  };

  // 🔥 FIELD VALIDATION
  const validateField = (key: string, value: string) => {
    let message = "";

    if (key === "name") {
      if (!value.trim()) message = "Nom requis";
      else if (value.trim().length < 4) message = "Nom trop court";
    }

    if (key === "email") {
      if (value && !/^\S+@\S+\.\S+$/.test(value)) message = "Email invalide";
    }

    if (key === "phone") {
      if (value && value.length < 10) message = "Téléphone invalide";
    }

    if (key === "password") {
      if (!value.trim()) message = "Mot de passe requis";
      else if (value.length < 6) message = "Minimum 6 caractères";
    }

    setErrors((prev) => ({ ...prev, [key]: message }));
    return message === "";
  };

  // 🔥 FORM VALIDATION
  const validate = () => {
    const a = validateField("name", form.name);
    const b = validateField("email", form.email);
    const c = validateField("phone", form.phone);
    const d = validateField("password", form.password);

    if (!form.email && !form.phone) {
      setError("Email ou téléphone requis");
      return false;
    }

    return a && b && c && d;
  };

  const handleRegister = async () => {
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const login = await signIn("credentials", {
        identifier: form.email || form.phone,
        password: form.password,
        redirect: false,
      });

      if (login?.error) throw new Error("Connexion automatique échouée");

      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Inscrivez-vous pour accéder à la plateforme</p>
        </div>

        <div className="auth-form">

          {/* NAME */}
          <div className="field">
            <label>Nom</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={(e) => validateField("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
              placeholder="Votre nom"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* EMAIL */}
          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={(e) => validateField("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
              placeholder="exemple@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* PHONE */}
          <div className="field">
            <label>Téléphone</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              onBlur={(e) => validateField("phone", e.target.value)}
              className={errors.phone ? "input-error" : ""}
              placeholder="+243..."
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* PASSWORD */}
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              onBlur={(e) => validateField("password", e.target.value)}
              className={errors.password ? "input-error" : ""}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="submit"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </div>

        <div className="auth-footer">
          Déjà un compte ?{" "}
          <button onClick={() => router.push("/auth/signin")}>
            Se connecter
          </button>
        </div>
      </div>

      {/* ===== STYLE ===== */}
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