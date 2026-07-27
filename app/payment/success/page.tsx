import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  searchParams: Promise<{
    sessionId?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const sessionId = params.sessionId;

  let payment = null;

  if (sessionId) {
    payment = await prisma.payment.findFirst({
      where: {
        sessionId: String(sessionId),
      },
      include: {
        course: true,
        user: true,
      },
    });
  }

  return (
    <div className="min-h-screen bg-green-50 py-16 px-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">

        {/* Icône */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl">✅</span>
        </div>

        {/* Titre */}
        <h1 className="text-center text-3xl font-bold text-green-700">
          Paiement réussi !
        </h1>

        <p className="mt-4 text-center leading-7 text-gray-600">
          Merci pour votre paiement.
          <br />
          Votre inscription a été confirmée avec succès.
        </p>

        {/* Informations du paiement */}
        {payment && (
          <div className="mt-8 space-y-4 rounded-xl bg-gray-50 p-6">

            <div>
              <span className="font-semibold text-gray-800">
                Formation
              </span>
              <p className="text-gray-700">
                {payment.course
                  ? payment.course.title
                  : "Formation non trouvée"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-800">
                Montant
              </span>
              <p className="text-gray-700">
                {payment.amount} USD
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-800">
                Téléphone
              </span>
              <p className="text-gray-700">
                {payment.phone}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-800">
                Transaction
              </span>
              <p className="break-all text-gray-700">
                {payment.transactionId || "En attente"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-800">
                Statut
              </span>
              <p className="font-bold text-green-600">
                CONFIRMÉ
              </p>
            </div>

          </div>
        )}

        {/* Boutons */}
        <div className="mt-8 space-y-4">

          <Link
            href="/dashboard/student"
            className="block w-full rounded-lg bg-yellow-600 py-3 text-center font-semibold text-white transition hover:bg-yellow-700"
          >
            Accéder à votre espace étudiant
          </Link>

          {payment?.courseId && (
            <Link
              href={`/courses/${payment.courseId}`}
              className="block w-full rounded-lg border border-gray-300 py-3 text-center font-semibold transition hover:bg-gray-100"
            >
              Commencer la formation
            </Link>
          )}

        </div>

        {/* Assistance */}
        <div className="mt-10 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

          <h2 className="text-center text-2xl font-bold text-gray-800">
            📞 Besoin d'assistance ?
          </h2>

          <p className="mt-4 text-center leading-7 text-gray-600">
            Si vous rencontrez un problème pour accéder à votre espace étudiant,
            visualiser vos cours ou si vous avez une question concernant votre
            paiement, notre équipe est disponible pour vous accompagner.
          </p>

          <div className="mt-6 space-y-4">

            <a
              href="https://wa.me/243899864081"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:border-green-500 hover:bg-green-50"
            >
              <span className="text-3xl">💬</span>

              <div>
                <p className="font-semibold text-gray-800">
                  WhatsApp
                </p>
                <p className="text-green-600">
                  +243 899 864 081
                </p>
              </div>
            </a>

            <a
              href="tel:+243995271831"
              className="flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:border-blue-500 hover:bg-blue-50"
            >
              <span className="text-3xl">📞</span>

              <div>
                <p className="font-semibold text-gray-800">
                  Téléphone
                </p>
                <p className="text-blue-600">
                  +243 995 271 831
                </p>
              </div>
            </a>

            <a
              href="mailto:jiresselusa127@gmail.com"
              className="flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:border-red-500 hover:bg-red-50"
            >
              <span className="text-3xl">✉️</span>

              <div>
                <p className="font-semibold text-gray-800">
                  Email
                </p>
                <p className="text-red-600 break-all">
                  jiresselusa127@gmail.com
                </p>
              </div>
            </a>

          </div>

          <div className="mt-6 rounded-xl bg-white p-4 text-center text-sm text-gray-600">
            <strong>Notre engagement :</strong> Nous répondons rapidement à
            toutes les demandes afin que vous puissiez commencer votre formation
            sans difficulté.
          </div>

        </div>

      </div>
    </div>
  );
}