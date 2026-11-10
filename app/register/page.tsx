"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type FormType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  level: string;
  role: string;
};

type ErrorType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  level: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    phone: "",
    password: "",
    level: "Niveau 1",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState<ErrorType>({
    name: "",
    email: "",
    phone: "",
    password: "",
    level: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

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

  const update = (key: keyof FormType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const validateField = (key: keyof FormType, value: string): boolean => {
    let message = "";

    if (key === "name") {
      if (!value.trim()) message = "Veuillez renseigner votre nom complet.";
      else if (value.length < 4) message = "Ce nom est trop court.";
    }

    if (key === "email") {
      if (value && !/^\S+@\S+\.\S+$/.test(value))
        message = "Adresse email invalide.";
    }

    if (key === "phone") {
      if (value && value.length < 10)
        message = "Numéro de téléphone invalide.";
    }

    if (key === "password") {
      if (!value.trim()) message = "Mot de passe requis pour sécuriser votre accès.";
      else if (value.length < 6)
        message = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (key === "level") {
      if (!value) message = "Veuillez sélectionner un niveau de formation.";
    }

    setErrors((prev) => ({ ...prev, [key]: message }));
    return message === "";
  };

  const validate = (): boolean => {
    const a = validateField("name", form.name);
    const b = validateField("email", form.email);
    const c = validateField("phone", form.phone);
    const d = validateField("password", form.password);
    const e = validateField("level", form.level);

    if (!form.email && !form.phone) {
      setError("Veuillez renseigner soit une adresse email, soit un numéro de téléphone.");
      return false;
    }

    return a && b && c && d && e;
  };

  const handleRegister = async () => {
    setError("");

    if (!validate()) return;

    setLoading(true);
    setProgress(5);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'enregistrement");

      const login = await signIn("credentials", {
        identifier: form.email || form.phone,
        password: form.password,
        redirect: false,
      });

      if (login?.error) throw new Error("Connexion automatique échouée");

      setProgress(100);

      setTimeout(() => {
        router.push("/dashboard/student");
      }, 400);

    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors du traitement.");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="auth-page font-['IBM_Plex_Sans',system-ui,sans-serif]">
      <div className="auth-card">

        {/* HEADER BRANDING */}
        <div className="auth-header">
          <div className="brand-logo">
            ANGLO <span>PHONY</span>
          </div>
          <p className="brand-sub">DRC School — Excellence & Maîtrise de l'Anglais</p>
          <h1>Rejoignez l'Élite</h1>
          <p className="auth-subtitle">Votre transformation linguistique commence ici.</p>
        </div>

        {/* FORMULAIRE */}
        <div className="auth-form">

          <div className="field">
            <label>Nom complet</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
              placeholder="Ex: Jonathan Kabeya"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="field">
            <label>Adresse Email</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
              placeholder="exemple@domaine.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="field">
            <label>Numéro de téléphone</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={errors.phone ? "input-error" : ""}
              placeholder="+243 810 000 000"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* SÉLECTION DU NIVEAU (2 NIVEAUX UNIQUEMENT) */}
          <div className="field">
            <label>Choisissez votre niveau d'intégration</label>
            <div className="select-wrapper">
              <select
                value={form.level}
                onChange={(e) => update("level", e.target.value)}
                className={errors.level ? "input-error" : ""}
              >
                <option value="Niveau 1">Niveau 1 — Fondations & Immersion Guidée</option>
                <option value="Niveau 2">Niveau 2 — Perfectionnement & Maîtrise Avancée</option>
              </select>
            </div>
            {errors.level && <span className="error-text">{errors.level}</span>}
          </div>

          <div className="field">
            <label>Mot de passe sécurisé</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={errors.password ? "input-error" : ""}
              placeholder="Minimum 6 caractères"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="submit"
            onClick={handleRegister}
            disabled={loading}
          >
            <span className="btn-text">
              {loading ? "Traitement en cours..." : "Valider l'inscription "}
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
          Vous possédez déjà un compte ?{" "}
          <button onClick={() => router.push("/auth/signin")}>
            Se connecter
          </button>
        </div>
      </div>

      {/* ===== STYLES PROFESSIONNELS ===== */}
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
          max-width: 560px;
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

        .field input,
        .field select {
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

        .field select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23071b43' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 18px;
          padding-right: 40px;
        }

        .field input::placeholder {
          color: #94a3b8;
          font-size: 14px;
        }

        .field input:focus,
        .field select:focus {
          border-color: #174ea6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(23, 78, 166, 0.15);
        }

        .input-error {
          border-color: #ef4444 !important;
          background: #fff5f5 !important;
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
          font-weight: 600;
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