import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/HeaderClient";
import Image from "next/image";
import Script from "next/script";
import { 
  CheckCircle2, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  ShieldAlert 
} from "lucide-react";

export default async function EnrollmentLandingPage() {
  const session = await getServerSession(authOptions);

  // Configuration des contacts
  const whatsappNumber = "243899864081";
  const whatsappMessage = encodeURIComponent("Bonjour, je souhaite finaliser mon inscription.");
  const emailAddress = "africoms879@gmail.com";
  const phoneNumber = "2438995271831";

  // Informations sur les 2 livres
  const books = [
    {
      id: 1,
      title: "Livre 1 : Développement Full-Stack",
      price: "10 $",
      description: "Maîtrisez la création d'applications web complètes de A à Z : du frontend (interfaces utilisateur dynamiques) au backend (bases de données, serveurs et API).",
      imageUrl: "/images/book1.png",
    },
    {
      id: 2,
      title: "Livre 2 : Cybersécurité & Guerre Numérique",
      price: "10 $",
      description: "Découvrez les principes fondamentaux de la protection des systèmes, la défense contre les cyberattaques, le hacking éthique et la sécurité des données.",
      imageUrl: "/images/book2.png",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      
      {/* CODE PIXEL META COMPLET (BASE + EVENT COMPLETE REGISTRATION) */}
      <Script id="meta-pixel-full" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', 'VOTRE_PIXEL_ID'); // <-- REMPLACEZ VOTRE_PIXEL_ID PAR VOTRE VRAI ID META
          fbq('track', 'PageView');
          fbq('track', 'CompleteRegistration');
        `}
      </Script>

      <div>
        <Header session={session} />

        <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          
          {/* EN-TÊTE PRINCIPALE */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 mb-4 border border-green-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-green-600" />
              Formation 100% Gratuite
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Finalisez votre inscription & démarrez votre formation
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Apprenez à votre rythme, étape par étape, module par module et leçon par leçon.
            </p>
          </div>

          {/* CARTE PRINCIPALE */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
            
            {/* BANNIÈRE D'AVERTISSEMENT */}
            <div className="bg-amber-50 border-b border-amber-100 p-6 flex items-start gap-4">
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-base mb-1">
                  Activation manuelle requise
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  L'activation de votre compte se fait manuellement après vérification par notre équipe. Veuillez nous contacter directement via l'un des moyens ci-dessous pour valider votre accès.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">

              {/* BLOC FORMATION GRATUITE */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">
                      Accès au Programme
                    </h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    La formation est entièrement <strong className="text-slate-900">100 % gratuite</strong>. Vous aurez un suivi structuré, leçon par leçon et module par module.
                  </p>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> 100% Gratuit
                </span>
              </div>

              {/* SECTION DES 2 LIVRES AVEC CARTES IMAGES COMPLÈTES */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Matériel d'étude obligatoire (2 Livres)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ces deux manuels sont indispensables pour suivre la formation.
                    </p>
                  </div>
                </div>

                {/* GRILLE DES CARTES DE LIVRES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {books.map((book) => (
                    <div 
                      key={book.id} 
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Image du livre */}
                        <div className="relative w-full h-72 bg-slate-100 p-4 flex items-center justify-center">
                          <Image
                            src={book.imageUrl}
                            alt={book.title}
                            fill
                            className="object-contain p-2 drop-shadow-md"
                            unoptimized 
                          />
                        </div>

                        {/* Contenu de la carte */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                              Matériel obligatoire
                            </span>
                            <span className="text-lg font-extrabold text-slate-900">
                              {book.price}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-base mb-2">
                            {book.title}
                          </h4>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5">
                        <div className="w-full text-center text-xs font-semibold text-slate-600 bg-slate-100 py-2 rounded-lg">
                          Prix : {book.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RECAPITULATIF DU PRIX TOTAL */}
                <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-semibold text-amber-900">
                    Total pour les 2 livres d'accompagnement :
                  </span>
                  <span className="text-base font-extrabold bg-amber-600 text-white px-3 py-1 rounded-lg">
                    20 $ USD
                  </span>
                </div>
              </div>

              {/* SECTION REPÈRES & ÉTAPES */}
              <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-blue-950">
                    Vos repères dès votre arrivée dans la formation
                  </h4>
                </div>
                <p className="text-blue-900/80 text-sm leading-relaxed mb-4">
                  Juste après la présentation et l'introduction initiale aux cours, vous recevrez l'ensemble de vos accès ainsi que vos repères de démarrage pour suivre la formation sans difficulté.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Étape 1</span>
                    <p className="text-xs font-medium text-slate-700 mt-2">Paiement des 2 livres (20$)</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Étape 2</span>
                    <p className="text-xs font-medium text-slate-700 mt-2">Validation manuelle de l'accès</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 text-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Étape 3</span>
                    <p className="text-xs font-medium text-slate-700 mt-2">Réception des accès & repères</p>
                  </div>
                </div>
              </div>

              {/* SECTION APPEL À L'ACTION */}
              <div>
                <h3 className="text-center font-bold text-slate-800 text-lg mb-6">
                  Choisissez votre moyen de contact et commnandez vos cours pour finaliser votre inscription
                </h3>
                <p className="text-center text-sm text-slate-600 mb-6">
                  Nous vous contacterons pour confirmer votre inscription et vous fournir les détails pour recevoir vos livres.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <MessageSquare className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">WhatsApp</span>
                    <span className="text-[11px] opacity-80 mt-0.5">Réponse rapide</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${emailAddress}?subject=Finalisation%20Inscription%20-%20Achat%20des%20livres&body=Bonjour,%20je%20souhaite%20finaliser%20mon%20inscription%20et%20acheter%20les%202%20livres%20(20$).`}
                    className="flex flex-col items-center justify-center p-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <Mail className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Par Émail</span>
                    <span className="text-[11px] opacity-80 mt-0.5">Formulaire direct</span>
                  </a>

                  {/* Appel direct */}
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex flex-col items-center justify-center p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <Phone className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Appel Direct</span>
                    <span className="text-[11px] opacity-80 mt-0.5">Contact immédiat</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}