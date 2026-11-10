import "./globals.css";
import Script from "next/script";
import favicon from "./favicon.svg"; // 1. Import direct du fichier depuis le dossier app/

export const metadata = {
  title: "Anglophony DRC",
  description: "Gestion des formations en ligne",
  icons: {
    icon: favicon.src, // 2. Utilisation de l'URL générée par Next.js
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
        {/* Balise link avec l'URL importée */}
        <link rel="icon" href={favicon.src} type="image/svg+xml" />

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '4331977260409210');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body>
        {children}

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4331977260409210&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}