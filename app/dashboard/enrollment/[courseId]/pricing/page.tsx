import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function PricingPage({ params }: PageProps) {
  const { courseId } = await params;
  const courseIdNum = Number(courseId);

  if (isNaN(courseIdNum)) notFound();

  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
  });

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-yellow-900 mb-2">
          Tarification – {course.title}
        </h1>

        <p className="text-yellow-800 text-lg mb-10">
          Investissez dans vos compétences et accédez à un apprentissage de qualité.
        </p>

        {/* Carte de paiement */}
        <div className="bg-white border-2 border-yellow-900 rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold text-yellow-900 mb-6">
            Détails du paiement
          </h2>

          <div className="space-y-4 text-lg text-yellow-900">
            <div className="flex justify-between">
              <span>💻 Accès complet au cours</span>
              <span className="font-semibold">10 $</span>
            </div>

            <div className="flex justify-between">
              <span>📘 Livre & syllabus</span>
              <span className="font-semibold">5 $</span>
            </div>

            <div className="border-t border-yellow-300 my-6" />

            <div className="flex justify-between text-2xl font-extrabold">
              <span>Total</span>
              <span>15 $</span>
            </div>
          </div>

          {/* Bouton redirection paiement */}
          <Link
             href={`/dashboard/enrollment/${course.id}/payment`}
            className="block mt-10"
          >
            <button
              type="button"
              className="w-full py-4 rounded-xl
                         bg-green-600 text-white text-xl font-bold
                         hover:bg-green-700 transition"
            >
              Procéder au paiement
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
