import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Anubhav Bharti — AI Enthusiast & Digital Creator",
    template: "%s | Anubhav Bharti",
  },
  description:
    "Learn AI, build skills, and grow online. Premium digital products by Anubhav Bharti.",
  keywords: ["AI", "artificial intelligence", "digital products", "online learning", "Anubhav Bharti"],
  authors: [{ name: "Anubhav Bharti" }],
  creator: "Anubhav Bharti",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Anubhav Bharti",
    title: "Anubhav Bharti — AI Enthusiast & Digital Creator",
    description: "Learn AI, build skills, and grow online. Premium digital products by Anubhav Bharti.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubhav Bharti — AI Enthusiast & Digital Creator",
    description: "Learn AI, build skills, and grow online.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
