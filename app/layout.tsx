import "./globals.css";

export const metadata = {
  title: "Coderise-École",
  description: "Gestion des formations en ligne",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
