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

        <p className="mt-4 text-lg">
          Total : <strong>15$</strong>
        </p>

        <PaymentButton
          courseId={course.id}
          userId={Number(session.user.id)}
        />
      </div>
    </div>
  );
}