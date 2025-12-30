"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER FIXE ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1b2d] border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.png"
              alt="Coderise-Ecole"
              width={110}
              height={40}
            />
            <span className="text-lg md:text-xl font-bold text-yellow-300">
              Coderise-Ecole
            </span>
          </div>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="text-yellow-200 font-medium hover:text-yellow-300 transition"
            >
              Commencer
            </Link>

            <Link
              href="/auth/signin"
              className="bg-blue-800 text-yellow-200 px-5 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Se connecter
            </Link>
          </nav>

          {/* BOUTON MOBILE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-yellow-200"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* ================= MENU MOBILE ================= */}
        {open && (
          <div className="md:hidden bg-[#0a1b2d] border-t border-blue-900">
            <nav className="flex flex-col px-4 py-4 gap-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="bg-blue-800 text-yellow-200 text-center py-3 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Commencer
              </Link>

              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="border border-yellow-300 text-yellow-300 text-center py-3 rounded-md font-semibold hover:bg-yellow-300 hover:text-[#0a1b2d] transition"
              >
                Se connecter
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* ================= CONTENU SCROLLABLE ================= */}
      <main className="pt-28">
        {/* HERO */}
        <section className="bg-[#0a1b2d] text-yellow-200">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-3xl md:text-6xl font-bold mb-6 text-yellow-300">
              Plateforme de formations en développement logiciel
            </h1>

            <p className="text-base md:text-xl max-w-3xl mx-auto mb-10">
              Coderise-Ecole vous permet de créer, gérer et suivre des formations
              complètes en programmation : cours, modules, leçons, exercices et
              devoirs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/login"
                className="bg-yellow-300 text-[#0a1b2d] font-bold px-8 py-3 rounded-md hover:bg-yellow-200 transition"
              >
                Commencer gratuitement
              </Link>

              <Link
                href="/auth/signin"
                className="border border-yellow-300 px-8 py-3 rounded-md hover:bg-yellow-300 hover:text-[#0a1b2d] transition font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>

        {/* INFO */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-16 text-blue-900">
              Une plateforme pensée pour l’apprentissage moderne
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Formations structurées",
                  text: "Des parcours organisés par modules et leçons.",
                },
                {
                  title: "Pratique réelle",
                  text: "Exercices, devoirs et projets concrets.",
                },
                {
                  title: "Suivi et progression",
                  text: "Visualisez clairement votre évolution.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg p-8 shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-[#0a1b2d] text-yellow-200 py-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["1K+", "Formations"],
              ["50K+", "Apprenants"],
              ["200K+", "Exercices"],
              ["10K+", "Certificats"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-bold text-yellow-300">{value}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
