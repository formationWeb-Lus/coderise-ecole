import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/HeaderClient";
import SessionTimer from "@/components/SessionTimer";
import { SessionDurations } from "@/utils/sessionExpiration";

import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  GraduationCap 
} from "lucide-react";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  // Récupérer les cours de l'utilisateur connecté
  const studentCourses = await prisma.studentCourse.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <SessionTimer duration={SessionDurations.LONG} />
      
      <div>
        <Header session={session} />

        <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

          {!studentCourses.length ? (
            /* ÉTAT : AUCUN COURS (BIENVENUE + DÉMONSTRATION) */
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* EN-TÊTE BIENVENUE */}
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Espace Étudiant
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Bienvenue sur votre espace de formation
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                  Découvrez le fonctionnement de la plateforme et explorez nos formations disponibles pour commencer.
                </p>
              </div>

              {/* CARTE VIDÉO DE PRÉSENTATION */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Vidéo d'introduction & Guide d'utilisation
                  </h3>
                </div>

                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-slate-900">
                  <iframe
                    src="https://www.youtube.com/embed/WB7elJawPl4"
                    title="Présentation de la plateforme"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* SECTION APEL À L'ACTION (BOUTON ENRÔLEMENT) */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Prêt à commencer votre apprentissage ?
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Inscrivez-vous aux cours disponibles pour obtenir votre matériel et vos accès complets.
                  </p>
                </div>

                <div>
                  <Link href="/enrolement" className="inline-block">
                    <div className="
                      inline-flex items-center gap-3 px-8 py-4 
                      text-base sm:text-lg font-bold text-white 
                      rounded-2xl
                      bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                      shadow-lg shadow-orange-500/25
                      hover:shadow-xl hover:shadow-orange-500/35
                      hover:scale-[1.02] active:scale-[0.98]
                      transition-all duration-300
                    ">
                      <GraduationCap className="w-6 h-6" />
                      <span>Voir les cours & finaliser l'inscription</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>

            </div>

          ) : (

            /* ÉTAT : LISTE DES COURS DE L'ÉTUDIANT */
            <div className="space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Vos cours inscrits
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Reprenez votre apprentissage là où vous l'avez laissé.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 self-start sm:self-auto">
                  <BookOpen className="w-4 h-4" />
                  {studentCourses.length} {studentCourses.length > 1 ? "cours suivis" : "cours suivi"}
                </span>
              </div>

              {/* GRILLE DES COURS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {studentCourses.map((sc, index) => (
                  <Link
                    key={sc.id}
                    href={`/dashboard/courses/${sc.courseId}`}
                    className={`group block bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                      index === 0 ? "border-amber-300 ring-1 ring-amber-300" : "border-slate-200"
                    }`}
                  >
                    <div>
                      {/* Image du cours */}
                      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                        {sc.course.imageUrl ? (
                          <Image
                            src={sc.course.imageUrl}
                            alt={sc.course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <BookOpen className="w-8 h-8 mb-1 opacity-50" />
                            <span className="text-xs">Image non disponible</span>
                          </div>
                        )}
                        {index === 0 && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                            En cours
                          </span>
                        )}
                      </div>

                      {/* Details du cours */}
                      <div className="p-5">
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {sc.course.title}
                        </h2>
                        {sc.course.description && (
                          <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                            {sc.course.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2">
                      <div className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 py-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span>Accéder au cours</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}