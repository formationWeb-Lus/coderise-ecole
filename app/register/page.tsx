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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validate = () => {
    if (form.name.trim().length < 4) return "Nom trop court";
    if (form.password.length < 6) return "Mot de passe minimum 6 caractères";
    if (!form.email && !form.phone) return "Email ou téléphone requis";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Email invalide";
    if (form.phone && form.phone.length < 10) return "Téléphone invalide";
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ création compte
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2️⃣ auto login
      const login = await signIn("credentials", {
        identifier: form.email || form.phone,
        password: form.password,
        redirect: false,
      });

      if (login?.error) throw new Error("Connexion automatique échouée");

      // 3️⃣ redirection dashboard
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

          <div className="field">
            <label>Nom</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Téléphone</label>
            <input
              type="text"
              placeholder="+243..."
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="submit" onClick={handleRegister} disabled={loading}>
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