import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeScript from "./theme-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Photon EduTech Management Dashboard",
  description: "Next Photon EduTech Management System - Uber for Educators",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme script to prevent FOUC */}
        <ThemeScript />
      </head>
      <body className={`${inter.className} min-h-screen font-sans text-foreground transition-colors duration-200`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer position="bottom-right" theme="dark" />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}