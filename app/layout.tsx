import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DKC Books - Premium Books & Courses",
  description: "Browse and purchase top-quality books and courses.",


   twitter: {
    card: 'summary_large_image',
    title: 'Home - DKC Books - Premium Books & Courses',
    description: 'Browse and purchase top-quality books and courses.',
    images: ['https://dkcbooks.com/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    

  },

  alternates: {
    canonical: 'https://dkcbooks.com/',
  },






};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-blue-600 text-white border-t border-gray-200 py-6 h-50">
            <div className="container mx-auto px-4 text-center text-white text-sm">
              &copy; {new Date().getFullYear()} Digital Kingdom Chronicles Books. All rights reserved.
            </div>
          </footer>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
