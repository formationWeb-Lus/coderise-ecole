"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: number;
  userId: number;
}

const OPERATORS = [
  {
    code: "AM",
    name: "Airtel Money",
    image: "/images/aitel.png",
    color: "border-red-500",
  },
  {
    code: "OM",
    name: "Orange Money",
    image: "/images/orange.png",
    color: "border-orange-500",
  },
  {
    code: "MP",
    name: "M-Pesa",
    image: "/images/mpsa.png",
    color: "border-green-500",
  },
  {
    code: "AF",
    name: "Afrimoney",
    image: "/images/africell.png",
    color: "border-blue-500",
  },
];

export default function PaymentButton({
  courseId,
  userId,
}: Props) {

  const router = useRouter();

  const [telecom, setTelecom] = useState("");

  const [phone, setPhone] = useState("243");

  const [currency, setCurrency] =
    useState<"USD" | "CDF">("USD");

  const [loading, setLoading] =
    useState(false);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  /**
   * Montant selon la devise
   */
  const amount =
    currency === "USD"
      ? 15
      : 33450;

  /**
   * Numéro valide
   */
  const phoneValid =
    phone.startsWith("243") &&
    phone.length === 12;

  /**
   * Opérateur sélectionné
   */
  const selectedOperator =
    OPERATORS.find(
      (op) => op.code === telecom
    );
    const pay = async () => {

  if (loading) return;

  if (!telecom) {
    alert("Choisissez un opérateur.");
    return;
  }

  if (!phoneValid) {
    alert("Entrez un numéro valide.");
    return;
  }

  setLoading(true);

  try {

    const payload = {
      userId,
      courseId,
      amount,
      phone,
      telecom,
      currency,
    };

    console.log(payload);

    const res = await fetch(
      "https://api.coderise-solution.com/api/payment/initiate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    console.log(data);

    if (!res.ok || !data.success) {

      throw new Error(
        data.message ??
        "Erreur lors du paiement."
      );

    }

    setMessage(
      data.data?.message ??
      "Paiement initialisé."
    );

    const payment =
      data.data?.payment ??
      data.data?.serdiPay?.payment;

    if (!payment) {

      throw new Error(
        "Session de paiement introuvable."
      );

    }

    setSessionId(
      String(payment.sessionId)
    );

  } catch (error: any) {

    console.error(error);

    alert(
      error.message ??
      "Une erreur est survenue."
    );

  } finally {

    setLoading(false);

  }

};

/**
 * ==========================================
 * Vérification automatique du paiement
 * ==========================================
 */

useEffect(() => {
  if (!sessionId) return;

  setMessage(
    "Votre demande de paiement a été envoyée. Veuillez confirmer le paiement sur votre téléphone."
  );

  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    try {
      const res = await fetch(
        `https://api.coderise-solution.com/api/payment/status/${sessionId}`
      );

      if (!res.ok) return;

      const data = await res.json();

      const status = data.payment?.status;

      if (status === "SUCCESS") {
        clearInterval(interval);

        setMessage("Paiement confirmé. Redirection...");

        setTimeout(() => {
          router.push(
            `/payment/success?sessionId=${sessionId}`
          );
        }, 1500);
      }

      if (status === "FAILED") {
        clearInterval(interval);

        setLoading(false);

        setMessage(
          "Le paiement a été refusé."
        );
      }

      if (attempts >= 60) {
        clearInterval(interval);

        setLoading(false);

        setMessage(
          "Le délai de confirmation a expiré."
        );
      }

    } catch (error) {
      console.error(error);
    }

  }, 3000);

  return () => clearInterval(interval);

}, [sessionId, router]);

/**
 * ==========================================
 * AFFICHAGE
 * ==========================================
 */

return (

<div className="max-w-3xl mx-auto rounded-3xl border bg-white shadow-xl overflow-hidden">

  {/* Header */}

  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8">

    <h1 className="text-3xl font-bold">

      Paiement sécurisé

    </h1>

    <p className="mt-2 text-white/90">

      Finalisez votre inscription en quelques secondes.

    </p>

  </div>

  <div className="p-8 space-y-8">

    {/* Choix opérateur */}

    <div>

      <h2 className="font-bold text-xl mb-4">

        1. Choisissez votre opérateur Mobile Money

      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {OPERATORS.map((operator) => (

          <button
            key={operator.code}
            disabled={loading}
            onClick={() => setTelecom(operator.code)}
            className={`rounded-2xl border-2 p-5 transition-all hover:shadow-lg hover:scale-105 ${
              telecom === operator.code
                ? operator.color
                : "border-gray-200"
            }`}
          >

            <img
              src={operator.image}
              alt={operator.name}
              className="w-14 h-14 mx-auto object-contain"
            />

            <p className="mt-3 text-sm font-semibold">

              {operator.name}

            </p>

          </button>

        ))}

      </div>

    </div>
        {/* ==========================================
        Téléphone
    ========================================== */}

    {telecom && (

      <div className="space-y-4">

        <h2 className="font-bold text-xl">

          2. Numéro Mobile Money

        </h2>

        <p className="text-gray-600">

          Opérateur sélectionné :
          <span className="ml-2 font-semibold">
            {selectedOperator?.name}
          </span>

        </p>

        <div className="rounded-2xl border-2 border-gray-300 px-5 py-4 focus-within:border-yellow-500">

          <input
            type="tel"
            placeholder="243XXXXXXXXX"
            value={phone}
            onChange={(e) => {

              let value = e.target.value.replace(/\D/g, "");

              if (!value.startsWith("243")) {
                value = "243";
              }

              if (value.length <= 12) {
                setPhone(value);
              }

            }}
            className="w-full outline-none text-xl"
          />

        </div>

        {!phoneValid && phone.length > 3 && (

          <p className="text-red-500 text-sm">

            Numéro invalide.

          </p>

        )}

      </div>

    )}

    {/* ==========================================
        Choix devise
    ========================================== */}

    {phoneValid && (

      <div className="space-y-5">

        <h2 className="font-bold text-xl">

          3. Choisissez la devise

        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* USD */}

          <button
            type="button"
            disabled={loading}
            onClick={() => setCurrency("USD")}
            className={`rounded-2xl border-2 p-6 text-left transition-all ${
              currency === "USD"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-yellow-300"
            }`}
          >

            <p className="text-gray-500">

              Dollar Américain

            </p>

            <h3 className="mt-3 text-3xl font-bold">

              💵 15 USD

            </h3>

          </button>

          {/* CDF */}

          <button
            type="button"
            disabled={loading}
            onClick={() => setCurrency("CDF")}
            className={`rounded-2xl border-2 p-6 text-left transition-all ${
              currency === "CDF"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >

            <p className="text-gray-500">

              Franc Congolais

            </p>

            <h3 className="mt-3 text-3xl font-bold">

              33 450 CDF

            </h3>

          </button>

        </div>

      </div>

    )}

    {/* ==========================================
        Résumé du paiement
    ========================================== */}

    {phoneValid && (

      <div className="rounded-2xl bg-gray-50 border p-6">

        <h2 className="text-xl font-bold mb-5">

          Résumé

        </h2>

        <div className="space-y-3 text-gray-700">

          <div className="flex justify-between">

            <span>Formation</span>

            <span className="font-semibold">
              Accès à la formation
            </span>

          </div>

          <div className="flex justify-between">

            <span>Opérateur</span>

            <span className="font-semibold">
              {selectedOperator?.name}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Téléphone</span>

            <span className="font-semibold">
              {phone}
            </span>

          </div>

          <div className="flex justify-between">

            <span>Devise</span>

            <span className="font-semibold">
              {currency}
            </span>

          </div>

          <div className="flex justify-between text-2xl font-bold border-t pt-4">

            <span>Montant</span>

            <span>

              {currency === "USD"
                ? "15 USD"
                : "33 450 CDF"}

            </span>

          </div>

        </div>

      </div>

    )}
        {/* ==========================================
        Message d'information
    ========================================== */}

    {message && (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>

          <div>
            <p className="font-semibold text-blue-700">
              {message}
            </p>

            {loading && (
              <p className="text-sm text-blue-600 mt-2">
                Veuillez confirmer la demande sur votre téléphone.
              </p>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ==========================================
        Bouton Paiement
    ========================================== */}

    {phoneValid && (
      <div className="pt-4">

        <button
          type="button"
          onClick={pay}
          disabled={loading}
          className={`w-full rounded-2xl py-5 text-lg font-bold text-white transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">

              <svg
                className="animate-spin h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
                />
              </svg>

              Initialisation du paiement...
            </div>
          ) : (
            <>
              Payer&nbsp;
              <span className="font-extrabold">
                {currency === "USD"
                  ? "15 USD"
                  : "33 450 CDF"}
              </span>
            </>
          )}
        </button>

      </div>
    )}
    

  </div>

</div>

);
}