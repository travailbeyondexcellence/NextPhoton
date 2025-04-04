


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Next Photon EduTech Management Dashboard",
    description: "Next Photon EduTech Management System",
};

export default function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (


        <html lang="en">

           <body className={inter.className}>

                {children} <ToastContainer position="bottom-right" theme="dark" />
            </body>
        </html>

    );
}