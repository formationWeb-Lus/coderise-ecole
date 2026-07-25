import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";
import PaymentFooter from "@/components/PaymentFooter";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function PricingPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id: Number(courseId),
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <>
      <div className="min-h-screen bg-yellow-50 px-6 py-12 pb-32">
        <div className="max-w-xl mx-auto rounded-xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-800">
            Tarification : {course.title}
          </h1>

          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-5">
            <p className="text-lg font-semibold text-gray-800">
              Montant du cours et de tous les livres associés à cette formation
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-700">
              💵 15 USD
            </p>

            <p className="mt-2 text-xl font-semibold text-green-700">
              ou en 33&nbsp;450 CDF
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Après la confirmation du paiement, votre accès au cours sera
              activé automatiquement.
            </p>
          </div>

          <div className="mt-8">
            <PaymentButton
              courseId={course.id}
              userId={Number(session.user.id)}
            />
          </div>
        </div>
      </div>

      <PaymentFooter />
    </>
  );
}