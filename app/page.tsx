"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#071b43] font-['IBM_Plex_Sans',system-ui,sans-serif]">
      {/* HEADER / BANNIÈRE DE PAIEMENT & INSCRIPTION */}
      <section className="bg-[#ed1c24] text-white">
        <div
          className="
            max-w-[1240px]
            mx-auto
            px-6
            py-4
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              🎓 Programme d'Anglais en 2 Niveaux — Devenez Bilingue
            </h2>

            <p className="mt-1 font-medium text-slate-100">
              Frais d'inscription : <span className="font-extrabold underline">20 USD</span> | Mensualité : <span className="font-extrabold underline">50 USD / mois</span>
            </p>

            <p className="text-sm mt-1 text-slate-200">
              ⏳ Total à régler pour commencer : <span className="font-bold text-yellow-300">70 USD</span> (20$ Inscription + 50$ Premier Mois)
            </p>
          </div>

          <Link
            href="/register"
            className="
              bg-[#071b43]
              text-white
              px-8
              py-4
              rounded-lg
              font-bold
              hover:bg-[#174ea6]
              transition
              whitespace-nowrap
              shadow-md
            "
          >
            S'inscrire toi maintenant
          </Link>
        </div>
      </section>

      <header className="sticky top-0 z-50 bg-[#071b43] border-b border-blue-900/50 shadow-md">
        <div className="
          max-w-[1240px]
          mx-auto
          px-6
          py-5
          flex
          items-center
          gap-4
        ">
          <Image
  src="/images/anglophony.png"
  width={55}
  height={55}
  alt="ANGLOPHONY DRC School"
/>

          <div>
            <h1 className="
              text-xl
              font-black
              text-white
              tracking-tight
            ">
              ANGLO <span className="text-[#ed1c24]">PHONY DRC</span>
            </h1>

            <p className="
              text-[#174ea6]
              text-xs
              font-bold
              uppercase
              tracking-widest
            ">
              DRC School — Académie d'Anglais Professionnel & Général
            </p>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="
          min-h-[calc(100vh-90px)]
          bg-[#071b43]
          flex
          items-center
        ">
          <div className="
            max-w-[1240px]
            mx-auto
            px-6
            py-12
            grid
            md:grid-cols-2
            gap-12
            items-center
          ">
            {/* TEXTE */}
            <div>
              <h2 className="
                text-4xl
                font-extrabold
                text-white
                leading-tight
              ">
                Parlez Anglais Comme un

                <span className="text-[#ed1c24]">
                  {" "}Américain
                </span>
              </h2>

              <p className="
                text-slate-200
                text-base
                mt-4
                leading-relaxed
              ">
                Notre parcours d'excellence est structuré en <strong className="text-white">2 niveaux progressifs</strong>. Grâce à notre méthode d'immersion ciblée, nous vous garantissons d'acquérir une aisance totale et naturelle en anglais au terme de votre formation.
              </p>

              <div className="mt-6 space-y-2 text-white font-medium text-sm">
                <p>✅ Inscription obligatoire : 20 USD (une seule fois)</p>
                <p>✅ Tarif mensuel : 50 USD / mois</p>
                <p>✅ Parcours structuré en 2 Niveaux d'excellence</p>
                <p>✅ Garantie de maîtrise totale (Niveau "American Native")</p>
              </div>

              <div className="
                mt-6
                bg-white/10
                border-l-4
                border-[#ed1c24]
                p-4
                rounded-r-lg
              ">
                <p className="text-white text-base font-extrabold">
                  💳 Total initial à régler : <span className="text-yellow-300">70 USD</span>
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  (Comprenant 20$ de frais d'inscription + 50$ pour votre premier mois de cours)
                </p>
              </div>
            </div>

            {/* FORMULAIRE / OPTION D'ACCÈS */}
            <div className="
              bg-white
              rounded-2xl
              p-8
              shadow-2xl
              border
              border-slate-100
            ">
              <h2 className="
                text-3xl
                font-bold
                text-[#071b43]
                text-center
                mb-2
              ">
                Commencer la Formation
              </h2>

              <p className="text-center text-sm text-slate-500 mb-6">
                Réglez vos frais pour démarrer votre apprentissage immédiatement.
              </p>

              <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">Frais d'inscription :</span>
                  <span className="font-bold text-[#071b43]">20 USD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-semibold">Frais du 1er mois :</span>
                  <span className="font-bold text-[#071b43]">50 USD</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between items-center font-extrabold text-base">
                  <span className="text-[#071b43]">Total au démarrage :</span>
                  <span className="text-[#ed1c24]">70 USD</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/register"
                  className="
                    block
                    w-full
                    text-center
                    bg-[#ed1c24]
                    text-white
                    font-bold
                    py-4
                    rounded-lg
                    hover:bg-[#c9151d]
                    transition
                    shadow-md
                  "
                >
                   S'inscrire toi maintenant
                </Link>

                <Link
                  href="/auth/signin"
                  className="
                    block
                    w-full
                    text-center
                    bg-[#174ea6]
                    text-white
                    font-bold
                    py-4
                    rounded-lg
                    hover:bg-[#071b43]
                    transition
                    shadow-md
                  "
                >
                  Se connecter (Étudiant déjà inscrit)
                </Link>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Choisissez une option pour accéder à la plateforme d'apprentissage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATISTIQUES ================= */}
        <section className="
          bg-slate-50
          border-y
          border-slate-200
          py-20
        ">
          <div className="
            max-w-[1240px]
            mx-auto
            px-6
          ">
            <div className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-10
              text-center
            ">
              <div>
                <h2 className="
                  text-5xl
                  font-black
                  text-[#071b43]
                ">
                  2 Niveaux
                </h2>
                <p className="
                  mt-3
                  text-slate-600
                  font-semibold
                ">
                  Parcours Structuré
                </p>
              </div>

              <div>
                <h2 className="
                  text-5xl
                  font-black
                  text-[#071b43]
                ">
                  500+
                </h2>
                <p className="
                  mt-3
                  text-slate-600
                  font-semibold
                ">
                  Étudiants Formés
                </p>
              </div>

              <div>
                <h2 className="
                  text-5xl
                  font-black
                  text-[#071b43]
                ">
                  100%
                </h2>
                <p className="
                  mt-3
                  text-slate-600
                  font-semibold
                ">
                  Immersion & Pratique
                </p>
              </div>

              <div>
                <h2 className="
                  text-5xl
                  font-black
                  text-[#071b43]
                ">
                  Garantie
                </h2>
                <p className="
                  mt-3
                  text-slate-600
                  font-semibold
                ">
                  Niveau Américain Natif
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMMENT FONCTIONNE LE PARCOURS EN 2 NIVEAUX ================= */}
        <section
          id="formations"
          className="
            bg-white
            py-20
          "
        >
          <div className="
            max-w-[1240px]
            mx-auto
            px-6
          ">
            <div className="
              text-center
              mb-16
            ">
              <h2 className="
                text-4xl
                font-extrabold
                text-[#071b43]
              ">
                Notre Méthode Progressive en 2 Niveaux
              </h2>

              <p className="
                text-slate-600
                mt-4
                text-lg
              ">
                Un apprentissage intelligent conçu pour vous amérer pas à pas vers une maîtrise totale.
              </p>
            </div>

            <div className="
              grid
              md:grid-cols-2
              gap-8
              max-w-4xl
              mx-auto
            ">
              <div className="
                bg-[#071b43]
                rounded-xl
                p-8
                text-white
                shadow-lg
                border-b-4
                border-[#ed1c24]
                hover:-translate-y-2
                transition
              ">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ed1c24] bg-white/10 px-3 py-1 rounded">
                  Premier Niveau
                </span>
                <h3 className="
                  text-2xl
                  font-bold
                  text-white
                  mt-4
                  mb-3
                ">
                  Fondations & Immersion Guidée
                </h3>

                <p className="
                  text-slate-300
                  text-sm
                  leading-relaxed
                ">
                  Idéal pour débuter. Ce niveau intègre <strong>beaucoup d'anglais et un peu de français</strong> pour vous permettre d'assimiler les bases en toute confiance et éliminer le blocage initial de la prise de parole.
                </p>
              </div>

              <div className="
                bg-[#071b43]
                rounded-xl
                p-8
                text-white
                shadow-lg
                border-b-4
                border-[#174ea6]
                hover:-translate-y-2
                transition
              ">
                <span className="text-xs font-bold uppercase tracking-widest text-[#174ea6] bg-white/10 px-3 py-1 rounded">
                  Deuxième Niveau
                </span>
                <h3 className="
                  text-2xl
                  font-bold
                  text-white
                  mt-4
                  mb-3
                ">
                  Perfectionnement & Maîtrise Avancée
                </h3>

                <p className="
                  text-slate-300
                  text-sm
                  leading-relaxed
                ">
                  L'étape supérieure. Ce niveau propose <strong>beaucoup d'anglais et moins de français</strong>, basculant vers une fluidité professionnelle et une élocution naturelle digne d'un natif américain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= POURQUOI NOUS ================= */}
        <section
          id="pourquoi"
          className="
            bg-slate-100
            py-20
          "
        >
          <div className="
            max-w-[1240px]
            mx-auto
            px-6
          ">
            <div className="
              text-center
              mb-16
            ">
              <h2 className="
                text-4xl
                font-extrabold
                text-[#071b43]
              ">
                Pourquoi choisir ANGLOPHONY DRC ?
              </h2>

              <p className="
                text-slate-600
                mt-5
                text-lg
              ">
                La garantie de résultats concrets pour transformer votre avenir professionnel et personnel.
              </p>
            </div>

            <div className="
              grid
              md:grid-cols-3
              gap-8
            ">
              <div className="
                bg-white
                rounded-xl
                border-t-4
                border-[#ed1c24]
                shadow-md
                p-8
              ">
                <h3 className="
                  text-2xl
                  font-bold
                  text-[#071b43]
                  mb-4
                ">
                  Progression garantie
                </h3>

                <p className="
                  text-slate-600
                  leading-8
                ">
                  En terminant nos deux niveaux, vous parlez et pensez en anglais avec la précision d'un Américain natif.
                </p>
              </div>

              <div className="
                bg-white
                rounded-xl
                border-t-4
                border-[#174ea6]
                shadow-md
                p-8
              ">
                <h3 className="
                  text-2xl
                  font-bold
                  text-[#071b43]
                  mb-4
                ">
                  Mentorat personnalisé
                </h3>

                <p className="
                  text-slate-600
                  leading-8
                ">
                  Bénéficiez d'un suivi rigoureux de votre prononciation et de votre élocution à chaque étape par des formateurs experts.
                </p>
              </div>

              <div className="
                bg-white
                rounded-xl
                border-t-4
                border-[#071b43]
                shadow-md
                p-8
              ">
                <h3 className="
                  text-2xl
                  font-bold
                  text-[#071b43]
                  mb-4
                ">
                  Certificat d'Anglais
                </h3>

                <p className="
                  text-slate-600
                  leading-8
                ">
                  Obtenez une certification reconnue validant vos compétences linguistiques à l'issue de votre formation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="
          bg-[#ed1c24]
          text-white
          py-24
        ">
          <div className="
            max-w-5xl
            mx-auto
            px-6
            text-center
          ">
            <h2 className="
              text-5xl
              font-extrabold
              mb-6
            ">
              Prêt à devenir bilingue comme un Américain ?
            </h2>

            <p className="
              text-xl
              text-slate-100
              mb-10
            ">
              Réglez vos frais d'inscription (20 USD) et votre premier mois (50 USD) pour intégrer dès aujourd'hui le Premier Niveau.
            </p>

            <div className="flex justify-center mt-8">
              <Link
                href="/register"
                className="
                  bg-[#071b43]
                  text-white
                  px-10
                  py-4
                  rounded-lg
                  font-bold
                  hover:bg-[#174ea6]
                  transition
                  shadow-xl
                "
              >
                Payer les 70 USD & Commencer
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="
          bg-[#071b43]
          text-white
          border-t
          border-slate-800
        "
      >
        <div className="
          max-w-[1240px]
          mx-auto
          px-6
          py-16
        ">
          <div className="
            grid
            md:grid-cols-3
            gap-12
          ">
            {/* LOGO & PRESENTATION */}
            <div>
              <div className="
                flex
                items-center
                gap-3
                mb-5
              ">
               <Image
  src="/images/anglophony.png"
  width={55}
  height={55}
  alt="ANGLOPHONY DRC School"
/>

                <h2 className="
                  text-2xl
                  font-black
                  text-white
                ">
                  ANGLO <span className="text-[#ed1c24]">PHONY DRC</span>
                </h2>
              </div>

              <p className="
                text-slate-300
                leading-8
              ">
                Centre d'excellence pour l'apprentissage de la langue anglaise en RDC. Votre passerelle vers une maîtrise de type natif américain.
              </p>
            </div>

            {/* NAVIGATION */}
            <div>
              <h3 className="
                text-xl
                font-bold
                text-white
                mb-6
                border-b
                border-[#ed1c24]
                pb-2
                inline-block
              ">
                Navigation
              </h3>

              <ul className="
                space-y-3
                text-slate-300
              ">
                <li>
                  <a href="#" className="hover:text-[#ed1c24] transition">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#formations" className="hover:text-[#ed1c24] transition">
                    Les 2 Niveaux
                  </a>
                </li>
                <li>
                  <a href="#pourquoi" className="hover:text-[#ed1c24] transition">
                    Pourquoi nous ?
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#ed1c24] transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="
                text-xl
                font-bold
                text-white
                mb-6
                border-b
                border-[#ed1c24]
                pb-2
                inline-block
              ">
                Contact
              </h3>

              <p className="mb-3 text-slate-300">
                📱 WhatsApp : +243 995271831
              </p>

              <p className="mb-3 text-slate-300">
                ✉ africoms879@gmail.com
              </p>

              <p className="text-slate-300">
                📍 République Démocratique du Congo
              </p>

              <div className="
                flex
                gap-5
                mt-8
                text-2xl
              ">
                <a href="#" className="hover:text-[#ed1c24] transition">🌐</a>
                <a href="#" className="hover:text-[#ed1c24] transition">📘</a>
                <a href="#" className="hover:text-[#ed1c24] transition">📸</a>
                <a href="#" className="hover:text-[#ed1c24] transition">💼</a>
                <a href="#" className="hover:text-emerald-400 transition">💬</a>
              </div>
            </div>
          </div>

          <div className="
            border-t
            border-slate-800
            mt-14
            pt-8
            text-center
            text-slate-400
            text-sm
          ">
            © {new Date().getFullYear()} ANGLOPHONY DRC School — Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}