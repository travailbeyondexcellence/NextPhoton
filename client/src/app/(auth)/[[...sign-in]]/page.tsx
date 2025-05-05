"use client";

import * as Clerk from "@clerk/elements/common";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn, // Import SignIn from @clerk/nextjs
  useUser, // ❌ remove
} from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // ❌ remove
  const router = useRouter();

  useEffect(() => { // ❌ remove related effect
    if (isLoaded && isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <>
      <div className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="h-screen flex items-center justify-center bg-lamaSkyLight overflow-y-hidden">
        <SignIn /> {/* Use the standard SignIn component */}
      </div>
    </>
  );
};

export default LoginPage;
