import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/HeaderClient";
import SessionTimer from "@/components/SessionTimer";
import { SessionDurations } from "@/utils/sessionExpiration";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findFirst({
    where: { email: session.user.email ?? undefined },
  });

  const studentCourses = student
    ? await prisma.studentCourse.findMany({
        where: { studentId: student.id },
        include: { course: true },
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <SessionTimer duration={SessionDurations.LONG} />
      <Header session={session} />

      <main className="pt-24 sm:pt-28 md:pt-32 px-6 pb-12">

        {!studentCourses.length ? (
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-3xl font-bold text-yellow-700 mb-4">
              Bienvenue sur votre espace étudiant
            </h1>

            <p className="text-gray-600 mb-8">
              Découvrez comment fonctionne la plateforme et explorez les formations disponibles.
            </p>

            {/* 🎬 VIDEO */}
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-xl mb-8">
  <iframe
    src="https://www.youtube.com/embed/WB7elJawPl4"
    title="Présentation de la plateforme"
    className="w-full h-full"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>

            {/* 🔥 BOUTON PREMIUM */}
            <Link href="/dashboard/enrollment" className="inline-block">
              <div className="
                px-10 py-4 
                text-lg font-bold text-white 
                rounded-xl
                bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500
                shadow-lg
                hover:shadow-2xl
                hover:scale-105
                transition-all duration-300
                animate-pulse
              ">
                🎓 Voir tous les cours disponibles pour vous inscrire
              </div>
            </Link>

            {/* Texte marketing */}
            <p className="text-gray-500 mt-6">
              Cliquez ici pour découvrir toutes les formations et commencer votre apprentissage dès aujourd’hui.
            </p>

          </div>

        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-yellow-700">
              Vos cours
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {studentCourses.map((sc, index) => (
                <Link
                  key={sc.id}
                  href={`/dashboard/courses/${sc.courseId}`}
                  className={`block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 ${
                    index === 0 ? "bg-yellow-100" : "bg-white"
                  }`}
                >
                  {sc.course.imageUrl ? (
                    <div className="relative w-full h-40">
                      <Image
                        src={sc.course.imageUrl}
                        alt={sc.course.title}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                      Image du cours
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                      {sc.course.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {sc.course.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}