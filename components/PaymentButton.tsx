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
  const [phone, setPhone] = useState("243");

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

  const payload = {
    userId,
    courseId,
    amount: 15,
    phone,
    telecom,
    currency: "USD",
  };

  console.log("Payload :", payload);

  try {
    const res = await fetch(
      "https://api.coderise-solution.com/api/payment/initiate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    console.log("====================================");
    console.log("Status HTTP :", res.status);
    console.log("Réponse API complète :");
    console.log(data);
    console.log(JSON.stringify(data, null, 2));
    console.log("====================================");

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Erreur lors du paiement");
    }

    const message =
      data.data?.message ??
      data.data?.serdiPay?.message ??
      "Paiement initialisé.";

    setMessage(message);


    const payment =
      data.data?.payment ??
      data.data?.serdiPay?.payment;


    if (!payment) {
      console.error("Objet payment introuvable :", data);

      alert(
        "Le serveur n'a pas retourné les informations du paiement. Vérifiez la console."
      );

      return;
    }


    console.log("SessionId :", payment.sessionId);

    setSessionId(String(payment.sessionId));


  } catch (err: any) {

    console.error(err);

    alert(err.message || "Erreur inconnue");

  } finally {

    setLoading(false);

  }
};



  useEffect(() => {

    if (!sessionId) return;


    const interval = setInterval(async () => {

      try {

        const res = await fetch(
          `https://api.coderise-solution.com/api/payment/status/${sessionId}`
        );


        const data = await res.json();


        if (data.payment.status === "SUCCESS") {

          clearInterval(interval);


          router.push(
            `/payment/success?sessionId=${sessionId}`
          );

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



     <div className="
  grid 
  grid-cols-2 
  md:flex 
  md:flex-row 
  gap-4 
  md:gap-8 
  justify-center 
  items-center
">

  {/* Airtel Money */}
  <button
    onClick={() => setTelecom("AM")}
    className={`
      p-2 rounded-lg transition
      ${
        telecom === "AM"
          ? "scale-110 ring-2 ring-red-500"
          : "hover:scale-105"
      }
    `}
  >
    <img
      src="/images/aitel.png"
      alt="Airtel Money"
      className="w-12 h-12 md:w-10 md:h-10 object-contain"
    />
  </button>


  {/* Orange Money */}
  <button
    onClick={() => setTelecom("OM")}
    className={`
      p-2 rounded-lg transition
      ${
        telecom === "OM"
          ? "scale-110 ring-2 ring-orange-500"
          : "hover:scale-105"
      }
    `}
  >
    <img
      src="/images/orange.png"
      alt="Orange Money"
      className="w-12 h-12 md:w-10 md:h-10 object-contain"
    />
  </button>


  {/* M-Pesa */}
  <button
    onClick={() => setTelecom("MP")}
    className={`
      p-2 rounded-lg transition
      ${
        telecom === "MP"
          ? "scale-110 ring-2 ring-green-500"
          : "hover:scale-105"
      }
    `}
  >
    <img
      src="/images/mpsa.png"
      alt="M-Pesa"
      className="w-12 h-12 md:w-10 md:h-10 object-contain"
    />
  </button>


  {/* Afrimoney */}
  <button
    onClick={() => setTelecom("AF")}
    className={`
      p-2 rounded-lg transition
      ${
        telecom === "AF"
          ? "scale-110 ring-2 ring-blue-500"
          : "hover:scale-105"
      }
    `}
  >
    <img
      src="/images/africell.png"
      alt="Afrimoney"
      className="w-12 h-12 md:w-10 md:h-10 object-contain"
    />
  </button>

</div>

{telecom && (
  <div className="mt-5">
    <label className="block text-lg font-semibold mb-2">
      Numéro Mobile Money
    </label>

    <div className="
      flex items-center 
      border-2 border-gray-300 
      rounded-xl px-4 py-3
      focus-within:border-blue-500
    ">
      <span className="text-2xl mr-3">📱</span>

      <input
        type="tel"
        required
        minLength={12}
        maxLength={12}
        placeholder="243xxxxxxxxx"
        className="
          w-full
          text-xl
          font-medium
          outline-none
          bg-transparent
        "
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
      />
    </div>

    {phone.length > 0 && phone.length < 12 && (
      <p className="text-red-500 text-sm mt-2">
        Le numéro doit contenir 12 chiffres (ex: 243971234567)
      </p>
    )}
  </div>
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