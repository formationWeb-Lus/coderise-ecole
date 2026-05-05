"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type FormType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

type ErrorType = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });

  const [errors, setErrors] = useState<ErrorType>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // 🔄 progression intelligente
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

  // 🔧 update
  const update = (key: keyof FormType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  // 🔍 validation champ
  const validateField = (key: keyof FormType, value: string): boolean => {
    let message = "";

    if (key === "name") {
      if (!value.trim()) message = "Nom requis";
      else if (value.length < 4) message = "Nom trop court";
    }

    if (key === "email") {
      if (value && !/^\S+@\S+\.\S+$/.test(value))
        message = "Email invalide";
    }

    if (key === "phone") {
      if (value && value.length < 10)
        message = "Téléphone invalide";
    }

    if (key === "password") {
      if (!value.trim()) message = "Mot de passe requis";
      else if (value.length < 6)
        message = "Minimum 6 caractères";
    }

    setErrors((prev) => ({ ...prev, [key]: message }));
    return message === "";
  };

  // 🔍 validation globale
  const validate = (): boolean => {
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

  // 🚀 inscription
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
      if (!res.ok) throw new Error(data.error);

      const login = await signIn("credentials", {
        identifier: form.email || form.phone,
        password: form.password,
        redirect: false,
      });

      if (login?.error) throw new Error("Connexion échouée");

      // ✅ FIN → 100%
      setProgress(100);

      setTimeout(() => {
        router.push("/dashboard");
      }, 400);

    } catch (e: any) {
      setError(e.message || "Erreur serveur");
      setLoading(false);
      setProgress(0);
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

          <div className="field">
            <label>Nom Complet</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={errors.name ? "input-error" : ""}
                placeholder="Ex: Jean Pierre"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
                placeholder="ex: jean@gmail.com"
            />
          </div>

          <div className="field">
            <label>Téléphone</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={errors.phone ? "input-error" : ""}
                placeholder="ex: +243 810 000 000"
            />
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={errors.password ? "input-error" : ""}
              placeholder="ex: Min 6 caractères (ex: Abc123)"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="submit"
            onClick={handleRegister}
            disabled={loading}
          >
            <span className="btn-text">
              {loading ? "Création..." : "Créer le compte"}
            </span>

            {loading && (
              <span
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        </div>

        <div className="auth-footer">
          Déjà un compte ?{" "}
          <button onClick={() => router.push("/auth/signin")}>
            Se connecter
          </button>
        </div>
      </div>

      <style jsx>{`
        /* ===== PAGE ===== */

        .field input::placeholder {
  color: #9ca3af;
  font-size: 14px;
}
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #020617, #0f172a);
  padding: 20px;
}

/* ===== CARD ===== */
.auth-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* ===== HEADER ===== */
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

/* ===== FORM ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== FIELD ===== */
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
  transition: 0.2s;
}

/* Focus */
.field input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

/* Error input */
.input-error {
  border-color: #ef4444 !important;
  background: #fff5f5;
}

/* Error text */
.error-text {
  font-size: 13px;
  color: #ef4444;
}

/* Error box */
.error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

/* ===== BUTTON ===== */
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

/* Texte bouton */
.btn-text {
  position: relative;
  z-index: 2;
}

/* Barre de progression */
.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #ca8a04, #facc15);
  transition: width 0.2s ease;
  z-index: 1;
}

/* ===== FOOTER ===== */
.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 15px;
}

.auth-footer button {
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .auth-card {
    max-width: 100%;
    padding: 24px 18px;
  }

  .auth-header h1 {
    font-size: 26px;
  }

  .auth-header p {
    font-size: 14px;
  }

  .field label {
    font-size: 15px;
  }

  .field input {
    padding: 14px;
    font-size: 15px;
  }

  .submit {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .auth-card {
    max-width: 600px;
  }
}

        .auth-footer {
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}