import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { AuthProviderInner as AuthProvider } from "@/contexts/AuthProviderWithLoading";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoader } from "@/components/GlobalLoader";
import ThemeScript from "./theme-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
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
        <LoadingProvider>
          <AuthProvider>
            {children}
            <GlobalLoader />
          </AuthProvider>
        </LoadingProvider>
        <ToastContainer position="bottom-right" theme="dark" />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}