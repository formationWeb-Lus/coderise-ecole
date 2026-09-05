"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function HomePage() {
  // État local pour valider l'engagement obligatoire
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-[#08192d]">


      {/* BANNIÈRE PROMOTIONNEL - GRATUITÉ */}
      <section className="bg-yellow-400 text-[#08192d]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
              🎁 FORMATION 100% GRATUITE
            </h2>
            <p className="text-sm mt-0.5 font-medium">
              Accès complet aux cours dispensés par des experts. Pour terminer toute la formation, vous devrez acheter **2 livres pédagogiques au prix total de 20 $**.

            </p>
          </div>
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
                100% Gratuit — Sans frais de scolarité
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Devenez <span className="text-yellow-300">Développeur Web,</span> Mobile ou Expert en IA
              </h2>

              <p className="text-gray-300 text-base mt-4 leading-relaxed">
                Rejoignez un programme intensif et 100% pratique. Apprenez à concevoir des applications web et mobiles modernes guidé par des mentors en direct.
              </p>

              <div className="mt-6 space-y-2.5 text-gray-200 text-sm">
                <p className="flex items-center gap-2">✅ <strong>Formation 100% Gratuite</strong> (aucun frais d'inscription)</p>
                <p className="flex items-center gap-2">✅ Projets professionnels réels</p>
                <p className="flex items-center gap-2">✅ Suivi et mentorat personnalisé</p>
              </div>

              {/* TIMELINE DES 4 JOURS */}
              <div className="mt-8 bg-blue-950/60 border border-blue-800/60 rounded-2xl p-5">
                <h3 className="text-yellow-300 font-bold text-sm mb-2">
                  💡 Comment fonctionne l'offre ?
                </h3>
                <ul className="text-xs text-gray-300 space-y-2 leading-relaxed">
                  <li><strong>Jour 1 à 4 :</strong> Suivez les cours en direct gratuitement.</li>
                  <li><strong>Au 4ᵉ jour :</strong> Procurez-vous les 2 livres d'accompagnement indispensables (20$ total) pour poursuivre la pratique.</li>
                </ul>
              </div>
            </div>

            {/* BLOC D'INSCRIPTION & IMAGES DES LIVRES */}
            <div id="inscription" className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Inscription Gratuite
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Matériel d'étude obligatoire
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Les 2 livres sont payables 4 jours après le début des cours.
                </p>
              </div>

              {/* AFFICHAGE DES IMAGES DES 2 LIVRES */}
              <div className="grid grid-cols-2 gap-3 mb-5">
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
                  <p className="text-yellow-600 font-extrabold text-sm mt-1">10 USD</p>
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
                  <p className="text-yellow-600 font-extrabold text-sm mt-1">10 USD</p>
                </div>
              </div>

              {/* RECAPITULATIF TOTAL */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 text-center">
                <p className="text-xs text-gray-700">
                  Total du matériel d'étude : <strong className="text-gray-900">20 USD</strong> (10$ × 2 livres)
                </p>
                <p className="text-[11px] text-red-600 font-semibold mt-0.5">
                  ⏰ À régler obligatoirement 4 jours après le début de la formation.
                </p>
              </div>

             {/* CASE À COCHER OBLIGATOIRE */}
<div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-5 shadow-sm">
  <label className="flex items-start gap-3 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => setIsChecked(e.target.checked)}
      className="mt-0.5 w-5 h-5 text-yellow-500 border-gray-400 rounded focus:ring-yellow-400 shrink-0 cursor-pointer"
    />

    <span className="text-sm font-semibold text-gray-800 leading-relaxed">
      Je comprends que la formation est gratuite et je m'engage à acheter
      les deux livres d'accompagnement{" "}
      <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded">
        20 USD au total
      </span>{" "}
      pour terminer toute la formation.
    </span>
  </label>
</div>

              {/* BOUTONS D'ACTION */}
              <div className="space-y-3">
                {isChecked ? (
                  <Link
                    href="/register"
                    className="block w-full text-center bg-yellow-400 text-[#08192d] font-bold py-3.5 rounded-xl hover:bg-yellow-500 shadow-md transition text-sm"
                  >
                    🚀 Valider mon inscription gratuite
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center bg-gray-200 text-gray-400 font-bold py-3.5 rounded-xl cursor-not-allowed text-sm"
                  >
                    🔒 Cochez l'engagement ci-dessus pour t'inscrire
                  </button>
                )}
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
                <h3 className="text-4xl font-bold text-[#08192d]">0 $</h3>
                <p className="mt-1 text-gray-600 text-sm">Frais de cours</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">90%</h3>
                <p className="mt-1 text-gray-600 text-sm">Pratique sur projets</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-[#08192d]">100%</h3>
                <p className="mt-1 text-gray-600 text-sm">En ligne</p>
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