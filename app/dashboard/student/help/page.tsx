"use client";

import React from "react";

export default function HelpPage() {
  // Remplace par ton numéro WhatsApp au format international sans +
  const whatsappNumber = "243995271831"; 
  const message = encodeURIComponent(
    "Bonjour, j'ai besoin d'assistance pour mon compte ou mes cours."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Assistance Étudiant</h1>
      <p className="mb-6 text-gray-700">
        Si vous avez besoin d'aide ou si vous rencontrez un problème avec vos cours,
        devoirs, ou votre compte, cliquez sur le bouton ci-dessous pour contacter notre
        équipe de support via WhatsApp.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-block
          bg-green-500 hover:bg-green-600
          text-white font-semibold
          px-6 py-3 rounded-lg
          transition-all duration-200
        "
      >
        Contacter le support sur WhatsApp
      </a>

      <p className="text-sm text-gray-500 mt-4">
        Cliquez sur le bouton et votre application WhatsApp s'ouvrira automatiquement
        avec un message pré-rempli.
      </p>
    </div>
  );
}
