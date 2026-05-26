import type { Metadata } from "next";
import { Poppins, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const themeScript = `
  (function() {
    try {
      var s = localStorage.getItem('theme');
      var p = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (s === 'dark' || (!s && p)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export const metadata: Metadata = {
  title: "Tech Glimpse",
  description: "Tech Glimpse is a modern web application that delivers the latest technology news daily. Built with Next.js, the site fetches and displays real-time tech-related stories using the Hacker News API. Whether you're a developer, enthusiast, or just curious about the latest trends, Tech Glimpse helps you stay updated with a clean and responsive interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${poppins.variable} ${bricolage.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
