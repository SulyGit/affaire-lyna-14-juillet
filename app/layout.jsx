import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://sulygit.github.io/affaire-lyna-14-juillet/"),
  title: "L’Affaire du Double Anniversaire — Pour Lyna",
  description: "Une enquête parisienne strictement confidentielle. Six indices, deux anniversaires, une seule journée.",
  manifest: "/affaire-lyna-14-juillet/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Dossier Lyna",
    statusBarStyle: "black-translucent"
  },
  openGraph: {
    title: "Lyna, une enquête t’attend…",
    description: "Dossier confidentiel · Paris · 14 juillet",
    type: "website",
    images: [{ url: "https://sulygit.github.io/affaire-lyna-14-juillet/og.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyna, une enquête t’attend…",
    description: "Dossier confidentiel · Paris · 14 juillet",
    images: ["https://sulygit.github.io/affaire-lyna-14-juillet/og.png"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#efe6d3"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
