import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaaS Pricing Calculator | Phone Call Infrastructure Cost Analysis",
  description: "Modern pricing calculator for phone call SaaS platforms. Compare costs across different scales, analyze infrastructure spending, and optimize your budget with real-time calculations.",
  keywords: ["pricing calculator", "saas", "phone call", "cost analysis", "infrastructure"],
  authors: [{ name: "Your Company" }],
  openGraph: {
    title: "SaaS Pricing Calculator",
    description: "Comprehensive cost analysis for phone call infrastructure",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
