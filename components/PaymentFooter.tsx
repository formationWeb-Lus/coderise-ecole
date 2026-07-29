import Link from "next/link";

export default function PaymentFooter() {
  return (
    <footer className="mt-20 bg-[#08192d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Assistance */}
        <div className="rounded-3xl border border-yellow-500/20 bg-white/5 backdrop-blur-sm p-8">

          <h2 className="text-center text-3xl font-bold text-yellow-300">
            📞 Besoin d'assistance ?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-center leading-8 text-gray-300">
            Si vous rencontrez un problème pour accéder à votre espace étudiant,
            visualiser vos cours ou si vous avez une question concernant votre
            paiement, notre équipe est disponible pour vous accompagner.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* WhatsApp */}

            <a
              href="https://wa.me/243899864081"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-xl"
            >
              <div className="text-5xl">💬</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                WhatsApp
              </h3>

              <p className="mt-2 text-green-600 font-semibold">
                +243 899 864 081
              </p>
            </a>

            {/* Téléphone */}

            <a
              href="tel:+243995271831"
              className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
            >
              <div className="text-5xl">📞</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Téléphone
              </h3>

              <p className="mt-2 text-blue-600 font-semibold">
                +243 995 271 831
              </p>
            </a>

            {/* Email */}

            <a
              href="mailto:jiresselusa127@gmail.com"
              className="group rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-red-50 hover:shadow-xl"
            >
              <div className="text-5xl">✉️</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Email
              </h3>

              <p className="mt-2 break-all text-red-600 font-semibold">
                jiresselusa127@gmail.com
              </p>
            </a>

          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 text-center">
            <p className="text-gray-700 leading-7">
              <strong>Notre engagement :</strong> Nous répondons rapidement à
              toutes les demandes afin que vous puissiez commencer votre
              formation sans difficulté.
            </p>
          </div>

        </div>

        {/* Footer principal */}

        <div className="mt-16 grid gap-12 md:grid-cols-3">

          <div>

            <h3 className="text-2xl font-bold text-yellow-300">
              CodeRise Academy
            </h3>

            <p className="mt-5 leading-8 text-gray-300">
              Plateforme de formation en ligne destinée à accompagner les
              étudiants vers l'excellence grâce à des formations modernes,
              accessibles et professionnelles.
            </p>

          </div>

          <div>

            <h3 className="text-xl font-bold text-yellow-300">
              Navigation
            </h3>

            <ul className="mt-5 space-y-4">

              <li>
                <Link
                  href="/dashboard/enrollment"
                  className="text-gray-300 transition hover:text-yellow-300"
                >
                  📘 Formations
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/student"
                  className="text-gray-300 transition hover:text-yellow-300"
                >
                  🎓 Tableau de bord
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="text-gray-300 transition hover:text-yellow-300"
                >
                  🏠 Accueil
                </Link>
              </li>

            </ul>

          </div>

          <div>

            <h3 className="text-xl font-bold text-yellow-300">
              Informations
            </h3>

            <p className="mt-5 leading-8 text-gray-300">
              Paiement sécurisé, accès immédiat aux formations après
              confirmation et assistance disponible pour tous les étudiants.
            </p>

          </div>

        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} CodeRise Academy — Tous droits réservés.
        </div>

      </div>
    </footer>
  );
}