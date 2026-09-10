"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08192d]">

      {/* BANNIÈRE PROMOTIONNELLE */}
      <section className="bg-yellow-400 text-[#08192d]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
              🚀 4 JOURS D'ESSAI GRATUIT EN DIRECT
            </h2>
            <p className="text-sm mt-0.5 font-medium">
              Découvrez la formation sans débourser un centime pendant 4 jours. Validez votre intérêt avant d'aller plus loin !
            </p>
          </div>
          <Link
            href="/register"
            className="bg-[#08192d] text-yellow-300 font-bold px-5 py-2 rounded-lg hover:bg-blue-900 transition text-sm whitespace-nowrap"
          >
            S'inscrire à l'essai
          </Link>
        </div>
      </section>

      {/* HEADER */}
      <header className="border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/favicon.png"
              width={50}
              height={50}
              alt="CodeRise Academy"
            />
            <div>
              <h1 className="text-xl font-bold text-yellow-300">
                CodeRise Academy
              </h1>
              <p className="text-gray-300 text-xs">
                Formation Numérique Professionnelle
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main>
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
            
            {/* DÉTAILS DE LA FORMATION */}
            <div>
              <span className="inline-block bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20 mb-4">
                Débutants & Intermédiaires acceptés
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Devenez <span className="text-yellow-300">Développeur Web,</span> Mobile ou Expert en IA
              </h2>

              <p className="text-gray-300 text-base mt-4 leading-relaxed">
                Rejoignez un programme intensif et 100% pratique. Apprenez à concevoir des applications web et mobiles modernes guidé par des mentors en direct.
              </p>

              <div className="mt-6 space-y-2.5 text-gray-200 text-sm">
                <p className="flex items-center gap-2">✅ <strong>4 premiers jours 100% gratuits</strong> (sans carte de crédit)</p>
                <p className="flex items-center gap-2">✅ Projets professionnels réels dès le premier jour</p>
                <p className="flex items-center gap-2">✅ Suivi et mentorat personnalisé en direct</p>
              </div>

              {/* TIMELINE DES 4 JOURS */}
              <div className="mt-8 bg-blue-950/60 border border-blue-800/60 rounded-2xl p-5">
                <h3 className="text-yellow-300 font-bold text-sm mb-2">
                  💡 Comment se déroule votre parcours ?
                </h3>
                <ul className="text-xs text-gray-300 space-y-2.5 leading-relaxed">
                  <li><strong>1. Inscription :</strong> Accédez directement au groupe et aux premiers cours en direct.</li>
                  <li><strong>2. Jour 1 à 4 (Gratuit) :</strong> Testez les cours, pratiquez et validez la pédagogie sans payer.</li>
                  <li><strong>3. Après le 4ᵉ jour :</strong> Procurez-vous les 2 livres d'accompagnement (20 $ au total) pour débloquer la suite du programme complet.</li>
                </ul>
              </div>
            </div>

            {/* BLOC D'INSCRIPTION & IMAGES DES LIVRES */}
            <div id="inscription" className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Accès Immédiat
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Commencez votre formation
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Rejoignez la session en direct sans aucun paiement requis aujourd'hui.
                </p>
              </div>

              {/* AFFICHAGE DES IMAGES DES 2 LIVRES */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* LIVRE 1 */}
                <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 flex flex-col items-center">
                  <div className="relative w-24 h-32 mb-2 shadow-md rounded overflow-hidden bg-gray-200">
                    <Image
                      src="/images/book1.png"
                      alt="Livre 1: Développement Full-Stack"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-gray-800 text-xs">Livre 1 : Full-Stack</h4>
                  <p className="text-gray-500 font-semibold text-xs mt-1">Livre de cours</p>
                </div>

                {/* LIVRE 2 */}
                <div className="border border-gray-200 rounded-xl p-3 text-center bg-gray-50 flex flex-col items-center">
                  <div className="relative w-24 h-32 mb-2 shadow-md rounded overflow-hidden bg-gray-200">
                    <Image
                      src="/images/book2.png"
                      alt="Livre 2: Cybersécurité & IA"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-gray-800 text-xs">Livre 2 : Cybersécurité</h4>
                  <p className="text-gray-500 font-semibold text-xs mt-1">Guide pratique</p>
                </div>
              </div>

              {/* RECAPITULATIF SUPPORT */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-center">
                <p className="text-xs text-blue-950 font-medium">
                  📚 Les supports de cours (20 $ total) vous seront proposés au 4ᵉ jour pour poursuivre votre apprentissage.
                </p>
              </div>

              {/* BOUTON D'ACTION PRINCIPAL */}
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="block w-full text-center bg-yellow-400 text-[#08192d] font-bold py-4 rounded-xl hover:bg-yellow-500 shadow-lg hover:shadow-xl transition text-base"
                >
                  🚀 Réserver ma place (Essai Gratuit 4 jours)
                </Link>
                <p className="text-center text-[11px] text-gray-500">
                  ⚡ Inscription rapide en 1 minute. Sans engagement.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTIQUES */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">500+</h3>
                <p className="mt-1 text-gray-600 text-sm">Étudiants formés</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">4 Jours</h3>
                <p className="mt-1 text-gray-600 text-sm">D'essai 100% gratuit</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">90%</h3>
                <p className="mt-1 text-gray-600 text-sm">Pratique sur projets</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">100%</h3>
                <p className="mt-1 text-gray-600 text-sm">En ligne & En direct</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#08192d] border-t border-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CodeRise Academy — Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}