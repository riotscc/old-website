"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import Dither from "@/components/Dither/Dither";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FinishDiscordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/onboarding/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to finish setting up your account."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Dither
          waveColor={[
            0.01568627450980392,
            0.0392156862745098,
            0.5215686274509804,
          ]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.27}
          waveFrequency={2.8}
          waveSpeed={0.06}
        />
      </div>

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.72)_100%)]" />

      <div className="relative z-10 flex min-h-svh items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">

          <div className="rounded-[28px] border border-white/[0.09] bg-[#080808]/85 p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">
            <div className="mb-8">
              <h1 className="text-[28px] font-semibold tracking-[-1.1px] text-white">
                Finish your account
              </h1>

              <p className="mt-2 text-[14px] leading-6 text-white/45">
                Your Discord account is connected. Add an email and password so
                you can access your account another way.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[13px] font-medium text-white/75"
                >
                  Email
                </label>

                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 rounded-xl border-white/[0.08] bg-white/[0.035] pl-11 text-[14px] text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-[13px] font-medium text-white/75"
                >
                  Password
                </label>

                <div className="relative">
                  <HugeiconsIcon
                    icon={LockPasswordIcon}
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 rounded-xl border-white/[0.08] bg-white/[0.035] px-11 text-[14px] text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/65"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffIcon : ViewIcon}
                      size={17}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-[13px] font-medium text-white/75"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <HugeiconsIcon
                    icon={LockPasswordIcon}
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 rounded-xl border-white/[0.08] bg-white/[0.035] px-11 text-[14px] text-white placeholder:text-white/25 focus-visible:border-white/20 focus-visible:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/65"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <HugeiconsIcon
                      icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                      size={17}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/15 bg-red-500/[0.07] px-4 py-3 text-[13px] leading-5 text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-xl bg-white text-[14px] font-medium text-black transition hover:bg-white/90"
              >
                {loading ? "Finishing setup..." : "Finish setup"}

                {!loading && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                    className="ml-2 transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-[12px] leading-5 text-white/30">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-white/55 transition hover:text-white"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-white/55 transition hover:text-white"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}