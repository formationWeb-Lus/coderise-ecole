import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PaymentFooter from "@/components/PaymentFooter";

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
    <div className="min-h-screen flex flex-col bg-green-50">

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">

        <div className="bg-white max-w-lg w-full rounded-2xl shadow-lg p-8 text-center">

          {/* Icône */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-3xl font-bold text-green-700">
            Paiement réussi !
          </h1>

          <p className="mt-4 text-gray-600">
            Merci pour votre paiement.
            Votre inscription a été confirmée avec succès.
          </p>

          {payment && (
            <div className="mt-8 rounded-xl bg-gray-50 p-5 text-left space-y-3">

              <div>
                <span className="font-semibold">
                  Formation :
                </span>

                {payment.course ? (
                  <p className="text-gray-700">
                    {payment.course.title}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Formation non trouvée
                  </p>
                )}
              </div>

              <div>
                <span className="font-semibold">
                  Montant :
                </span>

                <p className="text-gray-700">
                  {payment.amount} USD
                </p>
              </div>

              <div>
                <span className="font-semibold">
                  Téléphone :
                </span>

                <p className="text-gray-700">
                  {payment.phone}
                </p>
              </div>

              <div>
                <span className="font-semibold">
                  Transaction :
                </span>

                <p className="text-gray-700 break-all">
                  {payment.transactionId || "En attente"}
                </p>
              </div>

              <div>
                <span className="font-semibold">
                  Statut :
                </span>

                <p className="text-green-600 font-bold">
                  CONFIRMÉ
                </p>
              </div>

            </div>
          )}

          <div className="mt-8 space-y-4">

            <Link
              href="/dashboard/student"
              className="block w-full rounded-lg bg-yellow-600 py-3 text-white font-semibold hover:bg-yellow-700 transition"
            >
              Accéder à votre espace étudiant
            </Link>

            {payment?.courseId && (
              <Link
                href={`/courses/${payment.courseId}`}
                className="block w-full rounded-lg border border-gray-300 py-3 font-semibold hover:bg-gray-100 transition"
              >
                Commencer la formation
              </Link>
            )}

          </div>

        </div>

      </main>

     

    </div>
  );
}