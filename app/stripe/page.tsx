"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

export default function StripeTestingPage() {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkStripe() {
      try {
        const response = await fetch("/api/stripe/config");
        const data = await response.json();

        setConfigured(
          Boolean(data.publishableKey)
        );
      } catch {
        setConfigured(false);
      }
    }

    checkStripe();
  }, []);

  async function handlePayment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 500,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create payment session."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe did not return a checkout URL."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6">
      <div className="w-full max-w-[460px]">
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-7 shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
            <HugeiconsIcon
              icon={CreditCardIcon}
              size={22}
              strokeWidth={1.7}
              className="text-white"
            />
          </div>

          <div className="mt-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#2832F9]">
              Stripe Sandbox
            </p>

            <h1 className="mt-2 text-[30px] font-semibold tracking-[-1px] text-white">
              Test payment
            </h1>

            <p className="mt-3 text-[14px] leading-6 text-white/45">
              Create a Stripe sandbox checkout
              session and test the payment flow.
            </p>
          </div>

          <div className="mt-7 rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/45">
                Test product
              </span>

              <span className="text-[13px] font-medium text-white">
                $5.00
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-white/45">
                Environment
              </span>

              <span className="text-[13px] font-medium text-white">
                Sandbox
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-white/45">
                Stripe
              </span>

              <span
                className={`text-[13px] font-medium ${
                  configured === true
                    ? "text-green-400"
                    : configured === false
                      ? "text-red-400"
                      : "text-white/40"
                }`}
              >
                {configured === true
                  ? "Configured"
                  : configured === false
                    ? "Not configured"
                    : "Checking..."}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-[13px] text-red-400">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePayment}
            disabled={
              loading ||
              configured !== true
            }
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2832F9] text-[14px] font-medium text-white transition hover:bg-[#3540ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="animate-spin"
                />
                Redirecting...
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  size={18}
                  strokeWidth={1.8}
                />
                Pay $5.00
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
            Sandbox testing only. No real
            payment will be processed.
          </p>
        </div>
      </div>
    </main>
  );
}