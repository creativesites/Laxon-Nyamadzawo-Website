import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laxson Nyamadzawo | Minister, Theologian & Songwriter",
  description: "The digital sanctuary and official website of Pastor Laxson Nyamadzawo. Explore academic theological writings, chaplaincy insights, and Congolese rhumba gospel praise music.",
  keywords: ["Laxson Nyamadzawo", "Pastor Laxson", "ZAOGA Forward in Faith", "Theology", "Chaplaincy", "Gospel Music", "Congolese Rhumba Gospel", "Zimbabwe Christian Minister"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-[#fcfbf7] text-[#1c1c1a] dark:bg-[#0f0f0e] dark:text-[#f4f4f3] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
