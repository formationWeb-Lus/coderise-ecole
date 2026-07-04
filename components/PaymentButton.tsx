"use client";

import { useState } from "react";

export default function PaymentButton({ courseId }: { courseId: number }) {
  const [telecom, setTelecom] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    if (!telecom) {
      alert("Choisissez un opérateur de paiement");
      return;
    }

    if (!phone) {
      alert("Entrez votre numéro de téléphone");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://api.coderise-solution.com/api/payment/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            amount: 15,
            telecom,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Paiement impossible");
      }
    } catch (error) {
      alert("Erreur paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">

      {/* STEP 1: choix opérateur */}
      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => setTelecom("AM")}
          className={`p-3 border rounded ${
            telecom === "AM" ? "bg-yellow-500 text-white" : ""
          }`}
        >
          Airtel Money
        </button>

        <button
          onClick={() => setTelecom("OM")}
          className={`p-3 border rounded ${
            telecom === "OM" ? "bg-yellow-500 text-white" : ""
          }`}
        >
          Orange Money
        </button>

        <button
          onClick={() => setTelecom("AF")}
          className={`p-3 border rounded ${
            telecom === "AF" ? "bg-yellow-500 text-white" : ""
          }`}
        >
          Afrimoney
        </button>

        <button
          onClick={() => setTelecom("MP")}
          className={`p-3 border rounded ${
            telecom === "MP" ? "bg-yellow-500 text-white" : ""
          }`}
        >
          M-Pesa
        </button>

      </div>

      {/* STEP 2: champ numéro apparaît seulement si opérateur choisi */}
      {telecom && (
        <div className="space-y-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Entrez votre numéro de téléphone"
            className="w-full border p-3 rounded"
          />

          <p className="text-sm text-gray-500">
            Opérateur sélectionné : <strong>{telecom}</strong>
          </p>
        </div>
      )}

      {/* STEP 3: paiement */}
      <button
        onClick={pay}
        disabled={loading}
        className="w-full bg-yellow-700 text-white py-3 rounded"
      >
        {loading ? "Traitement..." : "Payer 15$"}
      </button>

    </div>
  );
}