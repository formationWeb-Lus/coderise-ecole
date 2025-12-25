import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function PaymentContactPage({ params }: PageProps) {
  const { courseId } = await params;
  const courseIdNum = Number(courseId);

  if (isNaN(courseIdNum)) notFound();

  const course = await prisma.course.findUnique({
    where: { id: courseIdNum },
  });

  if (!course) notFound();

  // Numéro WhatsApp (format international, sans + ni espaces)
  const whatsappNumber = "243899864081";
  const message = encodeURIComponent(
    `Bonjour, je souhaite finaliser le paiement du cours "${course.title}". Merci de m'envoyer les détails de paiement mobile.`
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white border-2 border-yellow-900 rounded-2xl shadow-xl p-10 text-center">
        
        <h1 className="text-3xl font-extrabold text-yellow-900 mb-6">
          Merci d’arriver ici 🙏
        </h1>

        <p className="text-lg text-yellow-900 leading-relaxed mb-10">
          Veuillez écrire à ce numéro ci-dessous pour nous indiquer le moyen 
          de paiement qui vous semble le plus facile.
          <br /><br />
          L’assistant vous fournira ensuite les détails des comptes afin de
          commander et accéder à votre cours.
        </p>

        {/* Icône WhatsApp cliquable */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center
                     w-20 h-20 rounded-full
                     bg-green-600 hover:bg-green-700
                     transition shadow-lg mb-6"
          aria-label="Contacter l’assistant sur WhatsApp"
        >
          {/* Icône WhatsApp (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="white"
            className="w-10 h-10"
          >
            <path d="M19.11 17.31c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.54-.45-.47-.61-.48h-.52c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.27s.98 2.64 1.12 2.82c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.82-1.27.22-.61.22-1.14.16-1.27-.07-.13-.25-.2-.52-.34z" />
            <path d="M16.01 3C9.39 3 4 8.38 4 15c0 2.65.86 5.1 2.32 7.1L5 29l7.07-1.86A11.9 11.9 0 0 0 16 27c6.62 0 12-5.38 12-12S22.62 3 16.01 3zm0 21.82c-2.03 0-3.91-.6-5.48-1.63l-.39-.25-4.19 1.1 1.12-4.08-.26-.42A9.8 9.8 0 0 1 6.2 15c0-5.41 4.4-9.81 9.81-9.81 5.41 0 9.81 4.4 9.81 9.81 0 5.41-4.4 9.81-9.81 9.81z" />
          </svg>
        </a>

        {/* Numéro visible */}
        <p className="text-yellow-900 text-lg">
          📞 Ecrivez Ici :
          <br />
          <a
            href={whatsappLink}
            className="font-bold text-green-700 underline"
          >
            +243 899 864 081
          </a>
        </p>

      </div>
    </div>
  );
}

