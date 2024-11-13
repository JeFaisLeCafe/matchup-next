"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    if (result?.error) {
      console.error(result.error);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Link href="/" className="mb-6 inline-flex items-center text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-primary">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-secondary text-primary hover:bg-secondary/90"
        >
          LOG IN
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">or</p>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/quizzes" })}
          variant="outline"
          className="mt-2 w-full"
        >
          Sign in with Google
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
