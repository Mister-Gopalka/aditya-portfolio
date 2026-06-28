import type { Metadata } from "next";
import {
  Playfair_Display,
  DM_Sans,
  Fraunces,
  Inter,
  Plus_Jakarta_Sans,
  Lato,
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
  weight: ["600"],
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

export const metadata: Metadata = {
  title: "Aditya Gopalka — Creative Director, Copywriter, Campaign Director",
  description:
    "Portfolio of Aditya Gopalka — Creative Director, Copywriter, and Campaign Director based in Delhi/Mumbai. Available for campaigns, ads, and direction projects.",
  openGraph: {
    title: "Aditya Gopalka — Creative Director, Copywriter, Campaign Director",
    description:
      "Portfolio of Aditya Gopalka — Creative Director, Copywriter, and Campaign Director based in Delhi/Mumbai.",
    type: "website",
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
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full`}>
      <body className={`${pairingClass} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
