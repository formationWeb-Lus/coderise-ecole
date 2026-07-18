"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: number;
  userId: number;
}

export default function PaymentButton({
  courseId,
  userId,
}: Props) {
  const router = useRouter();

  const [telecom, setTelecom] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  /**
   * ============================================
   * Initialiser le paiement
   * ============================================
   */

  const pay = async () => {
    if (!telecom) {
      alert("Choisissez un opérateur.");
      return;
    }

    if (!phone) {
      alert("Entrez votre numéro.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.coderise-solution.com/api/payment/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            courseId,
            amount: 15,
            phone,
            telecom,
            currency: "USD",
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(data.data.message);

      setSessionId(
        data.data.payment.sessionId.toString()
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ============================================
   * Vérifie automatiquement le paiement
   * ============================================
   */

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://api.coderise-solution.com/api/payment/status/${sessionId}`
        );

        const data = await res.json();

        if (!data.success) return;

        if (data.payment.status === "SUCCESS") {
          clearInterval(interval);

          alert("Paiement confirmé ✅");

          router.push(`/courses/${courseId}`);
        }

        if (data.payment.status === "FAILED") {
          clearInterval(interval);

          alert("Paiement refusé.");
        }
      } catch (error) {
        console.log(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, router, courseId]);

  return (
    <div className="space-y-6 mt-6">
      <h3 className="font-bold text-lg">
        Choisissez votre opérateur
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTelecom("AM")}
          className={`border rounded p-3 ${
            telecom === "AM"
              ? "bg-yellow-600 text-white"
              : ""
          }`}
        >
          Airtel Money
        </button>

        <button
          onClick={() => setTelecom("OM")}
          className={`border rounded p-3 ${
            telecom === "OM"
              ? "bg-orange-500 text-white"
              : ""
          }`}
        >
          Orange Money
        </button>

        <button
          onClick={() => setTelecom("MP")}
          className={`border rounded p-3 ${
            telecom === "MP"
              ? "bg-red-600 text-white"
              : ""
          }`}
        >
          M-Pesa
        </button>

        <button
          onClick={() => setTelecom("AF")}
          className={`border rounded p-3 ${
            telecom === "AF"
              ? "bg-blue-700 text-white"
              : ""
          }`}
        >
          Afrimoney
        </button>
      </div>

      {telecom && (
        <input
          type="tel"
          placeholder="243xxxxxxxxx"
          className="w-full border rounded p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      {message && (
        <div className="rounded bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}

      {sessionId && (
        <div className="rounded bg-blue-100 p-3 text-blue-700">
          Paiement en attente de confirmation...
        </div>
      )}

      <button
        disabled={loading}
        onClick={pay}
        className="w-full rounded bg-yellow-700 py-3 text-white"
      >
        {loading ? "Initialisation..." : "Payer 15 USD"}
      </button>
    </div>
  );
}