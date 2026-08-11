import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Tracker from "@/components/Tracker";

// Fraunces + Space Grotesk are the settled pairing. The admin panel used to be
// able to swap between three pairings, which meant every visitor downloaded
// six typefaces to render two. The switcher is gone; so are the other four.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
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

// No longer async: the layout used to hit Supabase for the font pairing on
// every single render of every page.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [fraunces.variable, spaceGrotesk.variable].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Tracker />
      </body>
    </html>
  );
}
