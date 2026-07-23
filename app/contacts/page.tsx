"use client";

import Image from "next/image";
import Link from "next/link";


export default function HomePage() {

  return (

    <div className="min-h-screen bg-[#08192d]">


      {/* HEADER */}

      <header className="border-b border-blue-900">


        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-5
          flex
          items-center
          gap-4
        ">


          <Image

            src="/favicon.png"

            width={55}

            height={55}

            alt="CodeRise Academy"

          />


          <div>

            <h1 className="
              text-xl
              font-bold
              text-yellow-300
            ">
              CodeRise Academy
            </h1>


            <p className="
              text-gray-300
              text-sm
            ">
              Formation numérique professionnelle
            </p>


          </div>


        </div>


      </header>





      {/* HERO */}


      <main>


        <section className="
          min-h-[calc(100vh-90px)]
          flex
          items-center
        ">


          <div className="
            max-w-6xl
            mx-auto
            px-6
            grid
            md:grid-cols-2
            gap-12
            items-center
          ">


            {/* TEXTE */}


            <div>


              <h2 className="
                text-5xl
                font-bold
                text-white
                leading-tight
              ">

                Apprenez les métiers

                <span className="
                  text-yellow-300
                ">
                  {" "}du numérique
                </span>


              </h2>



              <p className="
                text-gray-300
                text-lg
                mt-6
                leading-8
              ">

                Rejoignez CodeRise Academy et développez
                vos compétences en développement web,
                mobile, intelligence artificielle et technologie.

              </p>



              <p className="
                text-yellow-300
                mt-8
                font-semibold
              ">

                🚀 Commencez votre parcours maintenant

              </p>


            </div>





            {/* FORMULAIRE */}


            <div className="
              bg-white
              rounded-3xl
              p-8
              shadow-xl
            ">


              <h2 className="
                text-3xl
                font-bold
                text-gray-900
                text-center
              ">

                Commencer

              </h2>




<div className="space-y-5">
  <Link
    href="/register"
    className="
      block
      w-full
      text-center
      bg-white
      text-black
      font-bold
      py-4
      rounded-xl
      border
      border-gray-300
      hover:bg-gray-100
      transition
    "
  >
    Commencer gratuitement
  </Link>

  <Link
    href="/auth/signin"
    className="
      block
      w-full
      text-center
      bg-blue-800
      text-yellow-200
      font-bold
      py-4
      rounded-xl
      hover:bg-blue-700
      transition
    "
  >
    Se connecter
  </Link>

  <p className="text-center text-sm text-gray-500 mt-4">
    Choisissez une option pour accéder à la plateforme.
  </p>
</div>



            </div>



          </div>


        </section>

                {/* ================= STATISTIQUES ================= */}


        <section className="
          bg-white
          py-20
        ">


          <div className="
            max-w-7xl
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
                  font-bold
                  text-blue-900
                ">
                  500+
                </h2>

                <p className="
                  mt-3
                  text-gray-600
                ">
                  Étudiants
                </p>

              </div>




              <div>

                <h2 className="
                  text-5xl
                  font-bold
                  text-blue-900
                ">
                  15+
                </h2>

                <p className="
                  mt-3
                  text-gray-600
                ">
                  Formations
                </p>

              </div>




              <div>

                <h2 className="
                  text-5xl
                  font-bold
                  text-blue-900
                ">
                  90%
                </h2>

                <p className="
                  mt-3
                  text-gray-600
                ">
                  Pratique
                </p>

              </div>




              <div>

                <h2 className="
                  text-5xl
                  font-bold
                  text-blue-900
                ">
                  100%
                </h2>

                <p className="
                  mt-3
                  text-gray-600
                ">
                  En ligne
                </p>

              </div>



            </div>


          </div>


        </section>






        {/* ================= POURQUOI NOUS ================= */}



        <section

          id="pourquoi"

          className="
            bg-gray-100
            py-20
          "

        >



          <div className="
            max-w-7xl
            mx-auto
            px-6
          ">



            <div className="
              text-center
              mb-16
            ">


              <h2 className="
                text-4xl
                font-bold
                text-[#08192d]
              ">

                Pourquoi choisir CodeRise Academy ?

              </h2>



              <p className="
                text-gray-600
                mt-5
                text-lg
              ">

                Une plateforme moderne conçue pour développer vos compétences.

              </p>


            </div>





            <div className="
              grid
              md:grid-cols-3
              gap-8
            ">




              <div className="
                bg-white
                rounded-2xl
                shadow-lg
                p-8
              ">


                <h3 className="
                  text-2xl
                  font-bold
                  text-[#08192d]
                  mb-4
                ">

                  Formation pratique

                </h3>



                <p className="
                  text-gray-600
                  leading-8
                ">

                  Réalisez des projets concrets afin
                  d'acquérir une véritable expérience
                  professionnelle.

                </p>


              </div>





              <div className="
                bg-white
                rounded-2xl
                shadow-lg
                p-8
              ">


                <h3 className="
                  text-2xl
                  font-bold
                  text-[#08192d]
                  mb-4
                ">

                  Mentorat

                </h3>



                <p className="
                  text-gray-600
                  leading-8
                ">

                  Bénéficiez d'un accompagnement
                  personnalisé par des professionnels
                  expérimentés.

                </p>


              </div>





              <div className="
                bg-white
                rounded-2xl
                shadow-lg
                p-8
              ">


                <h3 className="
                  text-2xl
                  font-bold
                  text-[#08192d]
                  mb-4
                ">

                  Certificat

                </h3>



                <p className="
                  text-gray-600
                  leading-8
                ">

                  Recevez un certificat à la fin
                  de votre parcours de formation.

                </p>


              </div>



            </div>


          </div>


        </section>







        {/* ================= FORMATIONS ================= */}



        <section

          id="formations"

          className="
            bg-white
            py-20
          "

        >




          <div className="
            max-w-7xl
            mx-auto
            px-6
          ">



            <div className="
              text-center
              mb-16
            ">



              <h2 className="
                text-4xl
                font-bold
                text-[#08192d]
              ">

                Nos domaines de formation

              </h2>



              <p className="
                text-gray-600
                mt-4
                text-lg
              ">

                Choisissez la formation qui correspond
                à vos objectifs.

              </p>



            </div>





            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-4
              gap-7
            ">





              <div className="
                bg-[#08192d]
                rounded-2xl
                p-8
                text-white
                shadow-lg
                hover:-translate-y-2
                transition
              ">


                <h3 className="
                  text-xl
                  font-bold
                  text-yellow-300
                  mb-4
                ">

                  Développement Web

                </h3>


                <p className="
                  text-gray-300
                ">

                  HTML, CSS, JavaScript, React,
                  Next.js, Node.js, Express,
                  PostgreSQL, MongoDB et Prisma.

                </p>


              </div>





              <div className="
                bg-[#08192d]
                rounded-2xl
                p-8
                text-white
                shadow-lg
                hover:-translate-y-2
                transition
              ">


                <h3 className="
                  text-xl
                  font-bold
                  text-yellow-300
                  mb-4
                ">

                  Développement Mobile

                </h3>


                <p className="
                  text-gray-300
                ">

                  Créez des applications Android
                  et iOS avec React Native et Expo.

                </p>


              </div>





              <div className="
                bg-[#08192d]
                rounded-2xl
                p-8
                text-white
                shadow-lg
                hover:-translate-y-2
                transition
              ">


                <h3 className="
                  text-xl
                  font-bold
                  text-yellow-300
                  mb-4
                ">

                  Intelligence Artificielle

                </h3>


                <p className="
                  text-gray-300
                ">

                  Découvrez Python, Machine Learning,
                  ChatGPT et les outils IA modernes.

                </p>


              </div>





              <div className="
                bg-[#08192d]
                rounded-2xl
                p-8
                text-white
                shadow-lg
                hover:-translate-y-2
                transition
              ">


                <h3 className="
                  text-xl
                  font-bold
                  text-yellow-300
                  mb-4
                ">

                  Marketing Digital

                </h3>


                <p className="
                  text-gray-300
                ">

                  Facebook Ads, Google Ads, SEO,
                  Email Marketing et création de contenu.

                </p>


              </div>




            </div>



          </div>



        </section>

                {/* ================= CTA ================= */}


        <section className="
          bg-yellow-300
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
              font-bold
              text-[#08192d]
              mb-6
            ">

              Votre avenir commence aujourd'hui

            </h2>



            <p className="
              text-xl
              text-[#08192d]
              mb-10
            ">

              Remplissez vos informations et choisissez
              la formation qui correspond à vos objectifs.

            </p>




            <button

              onClick={() =>
                window.scrollTo({
                  top:0,
                  behavior:"smooth"
                })
              }

              className="
                bg-[#08192d]
                text-yellow-300
                px-10
                py-4
                rounded-xl
                font-bold
                hover:bg-[#102c4e]
                transition
              "

            >

              Commencer maintenant

            </button>



          </div>



        </section>







      </main>







      {/* ================= FOOTER ================= */}



      <footer

        id="contact"

        className="
          bg-[#08192d]
          text-white
        "

      >



        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-16
        ">



          <div className="
            grid
            md:grid-cols-3
            gap-12
          ">





            {/* LOGO */}



            <div>



              <div className="
                flex
                items-center
                gap-3
                mb-5
              ">


                <Image

                  src="/favicon.png"

                  alt="CodeRise Academy"

                  width={50}

                  height={50}

                />



                <h2 className="
                  text-2xl
                  font-bold
                  text-yellow-300
                ">

                  CodeRise Academy

                </h2>



              </div>





              <p className="
                text-gray-300
                leading-8
              ">

                Nous aidons les jeunes africains
                à acquérir les compétences numériques
                recherchées par les entreprises.

              </p>



            </div>








            {/* NAVIGATION */}



            <div>



              <h3 className="
                text-xl
                font-bold
                text-yellow-300
                mb-6
              ">

                Navigation

              </h3>




              <ul className="
                space-y-3
                text-gray-300
              ">



                <li>

                  <a
                    href="#"
                    className="hover:text-yellow-300"
                  >

                    Accueil

                  </a>

                </li>




                <li>

                  <a
                    href="#formations"
                    className="hover:text-yellow-300"
                  >

                    Formations

                  </a>

                </li>




                <li>

                  <a
                    href="#pourquoi"
                    className="hover:text-yellow-300"
                  >

                    Pourquoi nous ?

                  </a>

                </li>




                <li>

                  <a
                    href="#contact"
                    className="hover:text-yellow-300"
                  >

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
                text-yellow-300
                mb-6
              ">

                Contact

              </h3>





              <p className="mb-3">

                📱 WhatsApp : +243 XXX XXX XXX

              </p>




              <p className="mb-3">

                ✉ contact@coderise.africa

              </p>




              <p>

                📍 République Démocratique du Congo

              </p>





              <div className="
                flex
                gap-5
                mt-8
                text-3xl
              ">


                <a
                  href="#"
                  className="hover:text-yellow-300"
                >
                  🌐
                </a>



                <a
                  href="#"
                  className="hover:text-yellow-300"
                >
                  📘
                </a>




                <a
                  href="#"
                  className="hover:text-yellow-300"
                >
                  📸
                </a>




                <a
                  href="#"
                  className="hover:text-yellow-300"
                >
                  💼
                </a>




                <a
                  href="#"
                  className="hover:text-green-400"
                >
                  💬
                </a>



              </div>



            </div>






          </div>







          <div className="
            border-t
            border-gray-700
            mt-14
            pt-8
            text-center
            text-gray-400
          ">


            © {new Date().getFullYear()}
            {" "}
            CodeRise Academy — Tous droits réservés.


          </div>




        </div>



      </footer>





    </div>

  );
}
