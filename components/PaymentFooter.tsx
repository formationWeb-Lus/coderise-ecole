import Link from "next/link";

export default function PaymentFooter() {
  return (
    <footer className="mt-20 bg-[#08192d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* À propos */}
          <div>
            <h2 className="mb-5 text-2xl font-bold text-yellow-300">
              CodeRise Academy
            </h2>

            <p className="leading-8 text-gray-300">
              Notre équipe est disponible pour vous accompagner avant,
              pendant et après votre paiement afin de vous garantir une
              expérience simple, rapide et sécurisée.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-yellow-300">
              Navigation
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <Link
                  href="/dashboard/enrollment"
                  className="hover:text-yellow-300 transition"
                >
                  Formations
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="hover:text-yellow-300 transition"
                >
                  Paiement
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-yellow-300 transition"
                >
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-yellow-300">
              Contact
            </h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/243899864081"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 transition hover:text-green-400"
              >
                💬 WhatsApp : +243 899 864 081
              </a>

              <a
                href="tel:+243995271831"
                className="block text-gray-300 transition hover:text-blue-400"
              >
                📞 +243 995 271 831
              </a>

              <a
                href="mailto:jiresselusa127@gmail.com"
                className="block text-gray-300 transition hover:text-red-400"
              >
                ✉️ jiresselusa127@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-gray-700 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} CodeRise Academy — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}