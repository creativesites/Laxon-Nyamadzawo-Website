import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Pastor Laxson Nyamadzawo | ZAOGA Forward in Faith — Chilenje District, Zambia",
  description:
    "Official website of Pastor Laxson Nyamadzawo — District Pastor, Chilenje District, Lusaka, Zambia. ZAOGA Forward in Faith Ministries International. Shepherd, chaplain, theological writer, and gospel songwriter ministering to Zambia and Zimbabwe.",
  keywords: [
    "Laxson Nyamadzawo", "Pastor Laxson", "ZAOGA Forward in Faith",
    "Chilenje District", "Lusaka Zambia", "Zimbabwe Pastor",
    "Theology", "Chaplaincy", "Gospel Music", "Congolese Rhumba Gospel",
    "Zimbabwe Christian Minister", "Zambia Church", "Forward in Faith",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-square.ico",
    shortcut: "/logo-square.ico",
    apple: "/images/logo-square.png",
  },
};

export const viewport = {
  themeColor: "#5b1d8f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="icon" href="/logo-square.ico" sizes="any" />
        <link rel="shortcut icon" href="/logo-square.ico" />
        <link rel="apple-touch-icon" href="/images/logo-square.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5b1d8f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#2d2d2d]">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
