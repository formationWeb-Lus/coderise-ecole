import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function PricingPage({ params }: PageProps) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
  });

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold">
          Tarification : {course.title}
        </h1>

        <p className="mt-4 text-lg">
          Total : <strong>15$</strong>
        </p>

        {/* 🔥 PAYMENT BUTTON UNIQUE */}
        <PaymentButton courseId={course.id} />

      </div>
    </div>
  );
}