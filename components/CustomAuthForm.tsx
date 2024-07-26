// components/CustomAuthForm.tsx
"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const CustomAuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signInLoaded || !signUpLoaded) return;

    try {
      if (isSignUp) {
        await signUp.create({
          firstName,
          lastName,
          emailAddress: email,
          password,
        });
        // Handle post sign-up actions if needed
      } else {
        await signIn.create({
          identifier: email,
          password,
        });
        // Handle post sign-in actions if needed
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {isSignUp && (
          <>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomAuthForm;
