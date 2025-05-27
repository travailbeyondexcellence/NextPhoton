"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "better-auth/react"; // Assuming signUp exists and is imported like this
import Link from "next/link";

const InternSignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Assuming signUp function exists and accepts email, password, and role
      const result = await signUp({
        email,
        password,
        role: "INTERN", // Specify the role
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Successful signup, redirect to sign-in or a welcome page
        router.push("/sign-in");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight overflow-y-hidden">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Intern Sign Up</h2>
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
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-4">
          Already have an account? <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default InternSignupPage; 