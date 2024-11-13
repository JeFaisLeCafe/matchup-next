"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the registration logic
    console.log("Registration submitted", { email, password });
    // For now, let's just redirect to the login page
    router.push("/login");
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Link href="/" className="mb-6 inline-flex items-center text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-primary">Register</h1>
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
        <div>
          <Label htmlFor="confirmPassword">Repeat the password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-secondary text-primary hover:bg-secondary/90"
        >
          NEXT
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">or</p>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/quizzes" })}
          variant="outline"
          className="mt-2 w-full"
        >
          Sign up with Google
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
