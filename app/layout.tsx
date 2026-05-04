import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXTAUTH_URL ?? "https://chipin-bice.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ChipIn — Créez votre cagnotte en ligne facilement",
    template: "%s | ChipIn",
  },
  description:
    "ChipIn permet de créer une cagnotte en ligne en quelques secondes. Partagez un lien, vos proches participent sans compte. Paiement sécurisé via Stripe.",
  keywords: [
    "cagnotte en ligne",
    "collecte de fonds",
    "cagnotte",
    "chipin",
    "cadeau collectif",
    "pot commun",
    "paiement en ligne",
    "stripe",
  ],
  authors: [{ name: "ChipIn" }],
  creator: "ChipIn",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ChipIn",
    title: "ChipIn — Créez votre cagnotte en ligne facilement",
    description:
      "ChipIn permet de créer une cagnotte en ligne en quelques secondes. Partagez un lien, vos proches participent sans compte.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChipIn — Créez votre cagnotte en ligne facilement",
    description:
      "ChipIn permet de créer une cagnotte en ligne en quelques secondes. Partagez un lien, vos proches participent sans compte.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
        >
          Passer au contenu principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
