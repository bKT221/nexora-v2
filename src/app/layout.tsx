import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2d8a6e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Nexora — La Super-App Africaine",
  description: "Éducation, Business, Social et IA — Tout-en-Un. Power in your hands, offline or online.",
  keywords: ["Nexora", "Afrique", "Éducation", "IA", "Mobile Money", "Super-App", "Offline", "Sénégal", "Afrique de l'Ouest"],
  authors: [{ name: "Nexora Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: ["/logo.svg", "/icon-192.png"],
    apple: "/icon-512.png",
  },
  openGraph: {
    title: "Nexora — La Super-App Africaine",
    description: "Éducation, Business, Social et IA — Tout-en-Un",
    type: "website",
    locale: "fr_SN",
    siteName: "Nexora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — La Super-App Africaine",
    description: "Éducation, Business, Social et IA — Tout-en-Un",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nexora" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
