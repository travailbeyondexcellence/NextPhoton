"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "../../../lib/auth-client";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("idle");


  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData);
        setStatus(sessionData ? "authenticated" : "unauthenticated");
      } catch (error) {
        console.error("Error checking session:", error);
        setStatus("error");
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const result = await authClient.signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setStatus("error");
      } else {
        setStatus("authenticated");
        // Successful sign-in, handle redirect if needed (useEffect will handle it here)
      }
    } catch (error: any) {
      setError(error.message);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight overflow-y-hidden">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
