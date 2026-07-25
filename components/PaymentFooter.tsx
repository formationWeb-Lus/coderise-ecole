export default function PaymentFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
        {/* Texte */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-800">
            Besoin d'aide ?
          </h3>

          <p className="text-sm text-gray-500">
            Notre équipe est disponible pour vous accompagner avant, pendant et après votre paiement.
          </p>
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="https://wa.me/243899864081"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-green-600 transition hover:bg-green-50 hover:text-green-700"
          >
            <span className="text-xl">💬</span>
            <span className="font-semibold">WhatsApp</span>
          </a>

          <a
            href="tel:+243995271831"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="text-xl">📞</span>
            <span className="font-semibold">+243 995 271 831</span>
          </a>

          <a
            href="mailto:jiresselusa127@gmail.com"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <span className="text-xl">✉️</span>
            <span className="font-semibold">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}