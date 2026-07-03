"use client";

import { useState } from "react";

export default function PaymentButton({ courseId }: { courseId: number }) {
  const [telecom, setTelecom] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneMap: Record<string, string> = {
    AM: "0995271831",
    OM: "0899864081",
    AF: "0910128046",
    MP: "0810946352",
  };

  const pay = async () => {
    if (!telecom) {
      alert("Choisissez un moyen de paiement");
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
            courseId,
            amount: 15,
            telecom,
            phone: phoneMap[telecom],
          }),
        }
      );

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      alert("Erreur paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">

      <div className="grid grid-cols-2 gap-3">

        <button onClick={() => setTelecom("AM")}>Airtel Money</button>
        <button onClick={() => setTelecom("OM")}>Orange Money</button>
        <button onClick={() => setTelecom("AF")}>Afrimoney</button>
        <button onClick={() => setTelecom("MP")}>M-Pesa</button>

      </div>

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