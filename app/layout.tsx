import "./globals.css";

export const metadata = {
  title: "Coderise-École",
  description: "Gestion des formations en ligne",
  icons: {
    icon: "/favicon.png", // Assure-toi que ton favicon est dans le dossier public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
