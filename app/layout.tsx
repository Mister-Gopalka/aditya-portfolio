import type { Metadata } from "next";
import {
  Playfair_Display,
  DM_Sans,
  Fraunces,
  Inter,
  Plus_Jakarta_Sans,
  Lato,
  Caveat,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { getFontPairing } from "@/lib/supabase";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lato",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adityagopalka.com"),
  title: "Aditya Gopalka — Creative Director & Marketing Consultant (B2B & D2C) in Delhi | Ad Films, Brand Campaigns",
  description:
    "Aditya Gopalka is a Creative Director, Marketing Consultant (B2B & D2C), and Brand Manager based in Delhi. 10 years of brand campaigns, ad films, and creative direction — for OYO, HomeLane, Vinod Chopra Films, Wunderman Thompson, L&K Saatchi & Saatchi, and more.",
  keywords: [
    "Creative Director Delhi",
    "Marketing Consultant Delhi",
    "Brand Manager Delhi",
    "Ad Film Director Delhi",
    "Brand Campaign Delhi",
    "Creative Director India",
    "Aditya Gopalka",
    "TVC Director Delhi",
    "Digital Marketing Delhi",
    "Campaign Director Delhi",
  ],
  authors: [{ name: "Aditya Gopalka" }],
  creator: "Aditya Gopalka",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Aditya Gopalka — Creative Director & Marketing Consultant (B2B & D2C) in Delhi",
    description:
      "Brand campaigns, ad films, and creative direction — for OYO, HomeLane, Vinod Chopra Films, and more. Based in Delhi.",
    type: "website",
    locale: "en_IN",
    siteName: "Aditya Gopalka",
    url: "https://www.adityagopalka.com",
    images: [
      {
        url: "/assets/aditya-photo.jpg",
        width: 1200,
        height: 630,
        alt: "Aditya Gopalka — Creative Director & Marketing Consultant (B2B & D2C), Delhi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Gopalka — Creative Director & Marketing Consultant (B2B & D2C) in Delhi",
    description:
      "Brand campaigns, ad films, and creative direction — for OYO, HomeLane, Vinod Chopra Films, and more.",
    images: ["/assets/aditya-photo.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },

};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pairing = await getFontPairing();
  const pairingClass = `font-pairing-${pairing.toLowerCase()}`;

  const fontVars = [
    playfair.variable,
    dmSans.variable,
    fraunces.variable,
    inter.variable,
    plusJakarta.variable,
    lato.variable,
    caveat.variable,
    spaceGrotesk.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full`}>
      <body className={`${pairingClass} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
