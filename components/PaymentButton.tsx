"use client";

import { useState, useEffect } from "react";

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handlePayment = async () => {
    setLoading(true);
    setProgress(10);

    await new Promise((res) => setTimeout(res, 1500));

    setProgress(100);

    setTimeout(() => {
      alert("Paiement réussi ✅");
      setLoading(false);
      setProgress(0);
    }, 500);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="relative w-full py-4 rounded-xl
                 bg-green-600 text-white text-xl font-bold
                 overflow-hidden
                 transition transform
                 hover:scale-105 active:scale-95
                 shadow-lg hover:shadow-xl"
    >
      {/* TEXTE */}
      <span className="relative z-10">
        {loading ? "Traitement..." : "Procéder au paiement"}
      </span>

      {/* BARRE */}
      {loading && (
        <span
          className="absolute left-0 top-0 h-full
                     bg-gradient-to-r from-yellow-400 to-yellow-500
                     transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      )}
    </button>
  );
}