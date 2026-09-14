"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import Dither from "@/components/Dither/Dither";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [requiresVerification, setRequiresVerification] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create account."
        );
      }

      if (data.requiresVerification) {
        setRequiresVerification(true);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading || code.length !== 6) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/signup/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            email,
            password,
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to verify code."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-black px-4 py-10">
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

      <div className="absolute inset-0 bg-black/25" />

      <section className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080809]/90 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <div className="px-6 pb-7 pt-8 sm:px-7">
          <div className="mb-8 text-center">
            <h1 className="text-[26px] font-semibold tracking-[-0.8px] text-white">
              {requiresVerification
                ? "Check your email"
                : "Create your account"}
            </h1>

            <p className="mt-2 text-[14px] text-white/45">
              {requiresVerification
                ? `Enter the 6-digit code sent to ${email}`
                : "Choose your username, email, and password"}
            </p>
          </div>

          {!requiresVerification ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
            >
              <div className="group relative">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55 transition-colors group-focus-within:text-white"
                />

                <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#5862ff]">
                  carts.lol/
                </span>

                <Input
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="username"
                  required
                  minLength={1}
                  maxLength={24}
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  disabled={loading}
                  className="h-[48px] rounded-[15px] border-white/[0.1] bg-white/[0.025] pl-[119px] pr-4 text-[14px] text-white placeholder:text-white/35 focus-visible:border-[#2832F9]/70 focus-visible:ring-[#2832F9]/20"
                />
              </div>

              <div className="group relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55 transition-colors group-focus-within:text-white"
                />

                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  className="h-[48px] rounded-[15px] border-white/[0.1] bg-white/[0.025] pl-12 pr-4 text-[14px] text-white placeholder:text-white/35 focus-visible:border-[#2832F9]/70 focus-visible:ring-[#2832F9]/20"
                />
              </div>

              <div className="group relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55 transition-colors group-focus-within:text-white"
                />

                <Input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  className="h-[48px] rounded-[15px] border-white/[0.1] bg-white/[0.025] pl-12 pr-14 text-[14px] text-white placeholder:text-white/35 focus-visible:border-[#2832F9]/70 focus-visible:ring-[#2832F9]/20"
                />

                <Button
                  type="submit"
                  size="icon"
                  aria-label="Create account"
                  disabled={loading}
                  className="absolute right-[6px] top-1/2 size-9 -translate-y-1/2 rounded-full bg-white text-black hover:bg-white/85"
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={17}
                    strokeWidth={2}
                  />
                </Button>
              </div>

              {error && (
                <div className="rounded-[13px] border border-red-500/15 bg-red-500/[0.07] px-4 py-3 text-[13px] leading-5 text-red-300">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <form
              onSubmit={handleVerify}
              className="flex flex-col gap-3"
            >
              <Input
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                required
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                disabled={loading}
                className="h-[56px] rounded-[15px] border-white/[0.1] bg-white/[0.025] px-4 text-center text-[22px] font-semibold tracking-[10px] text-white placeholder:text-white/20 focus-visible:border-[#2832F9]/70 focus-visible:ring-[#2832F9]/20"
              />

              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="h-[48px] rounded-[15px] bg-white text-[14px] font-semibold text-black hover:bg-white/85"
              >
                {loading
                  ? "Verifying..."
                  : "Verify and create account"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={() => {
                  setRequiresVerification(false);
                  setCode("");
                  setError(null);
                }}
                className="h-[40px] gap-2 rounded-[13px] text-[13px] text-white/45 hover:bg-white/[0.04] hover:text-white"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={16}
                  strokeWidth={1.8}
                />
                Back
              </Button>

              {error && (
                <div className="rounded-[13px] border border-red-500/15 bg-red-500/[0.07] px-4 py-3 text-[13px] leading-5 text-red-300">
                  {error}
                </div>
              )}
            </form>
          )}

          {!requiresVerification && (
            <>
              <div className="mt-8 text-center text-[13px] text-white/40">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#7b82ff]"
                >
                  Log in
                </Link>
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-white/30">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline decoration-white/20 underline-offset-2 hover:text-white/60"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline decoration-white/20 underline-offset-2 hover:text-white/60"
                >
                  Privacy Policy
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}