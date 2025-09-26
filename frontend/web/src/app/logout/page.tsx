"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout and redirect to sign-in page
    const performLogout = async () => {
      try {
        await authClient.signOut();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Always redirect to sign-in page after logout attempt
        router.push("/sign-in");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Logging out...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}