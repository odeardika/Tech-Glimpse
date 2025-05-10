import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"], // Adjust weights as needed
});

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
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
