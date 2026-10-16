import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";

import { AppProviders } from "@/providers/app-providers";
import { FirebasePublicEnvScript } from "@/components/firebase/firebase-public-env-script";
import { rootMetadata } from "@/lib/seo";

import "./globals.css";

const dmSans = localFont({
  src: "./fonts/dm-sans-latin-variable.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin-variable.woff2",
  variable: "--font-cormorant",
  weight: "300 700",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = rootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f3eee5",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0c0a09",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${dmSans.variable} ${cormorant.variable} min-h-dvh bg-background font-sans text-foreground`}
      >
        <FirebasePublicEnvScript />

        <AppProviders>{children}</AppProviders>
      </body>

      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
