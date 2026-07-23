import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";

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
    <div className="min-h-screen bg-yellow-50 px-6 py-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold">
          Tarification : {course.title}
        </h1>

        <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
  <p className="text-lg">
    <strong>Montant du cours et de tous les livres associés à cette formation</strong>
  </p>

  <p className="text-2xl font-bold text-yellow-700 mt-2">
    💵 15 USD
  </p>

  <p className="text-xl font-semibold text-green-700 mt-1">
    ou en 🇨🇩 33 450 CDF
  </p>
</div>

        <PaymentButton
          courseId={course.id}
          userId={Number(session.user.id)}
        />
      </div>
    </div>
  );
}