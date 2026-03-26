import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solusi Digital Palembang",
  description: "Smart Digitalization Specialist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable} ${space.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
