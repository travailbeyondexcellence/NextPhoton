import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { authClient } from "@/lib/auth-client";
import { useStore } from "better-auth/react";

const inter = Inter({ subsets: ["latin"] });





export const metadata: Metadata = {
  title: "Next Photon EduTech Management Dashboard",
  description: "Next Photon EduTech Management System",
  icons: {
    icon: "/favicon.png", // adjust path if needed
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
        {/* 👇 This script ensures the correct theme is applied before hydration */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        /> */}
      </head>


      <body className="min-h-screen bg-gray-300 !important dark:bg-gray-800 font-sans text-foreground transition-colors duration-200">

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          // value={{ dark: "dark", light: "" }}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <ToastContainer position="bottom-right" theme="dark" />

      </body>
    </html>
  );
}
