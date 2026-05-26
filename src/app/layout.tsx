import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastor Laxson Nyamadzawo | Minister, Theologian & Gospel Songwriter",
  description:
    "The official website of Pastor Laxson Nyamadzawo — shepherding minister, chaplain, theological writer, and Congolese rhumba gospel praise songwriter. ZAOGA Forward in Faith Ministries.",
  keywords: [
    "Laxson Nyamadzawo",
    "Pastor Laxson",
    "ZAOGA Forward in Faith",
    "Theology",
    "Chaplaincy",
    "Gospel Music",
    "Congolese Rhumba Gospel",
    "Zimbabwe Christian Minister",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-[#2d2d2d]">
        {children}
      </body>
    </html>
  );
}
