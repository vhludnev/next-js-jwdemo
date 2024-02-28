import type { Metadata } from "next";
import "@/styles/globals.css";
import { inter, satoshi } from "./styles/fonts";
import NavWrapper from "./components/NavWrapper";

import ThemeProvider from "./components/ThProvider";
import Provider from "./components/Provider";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "JW Centrs",
  description: "Make the world a better place",
  keywords: ["jw", "witnessing", "centrs"],
  metadataBase: new URL(process.env.BASE_URL!),
  openGraph: {
    url: process.env.BASE_URL,
    images: [
      {
        url: `${process.env.BASE_URL}/opengraph-image.png`,
        width: 180,
        height: 180,
        alt: "JW Centrs stands",
      },
    ],
    title: "JW Centrs",
    description: "Make the world a better place",
    locale: "ru_RU",
    type: "website",
  },
  manifest: "/manifest.json",
  //themeColor: '#f5f3f0',
};

export const viewport = {
  themeColor: "#f5f3f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <Provider>
          <ThemeProvider>
            <main className="app">
              <NavWrapper />
              {children}
            </main>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
