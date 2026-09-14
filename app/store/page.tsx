"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  GiftIcon,
  HashtagIcon,
  SparklesIcon,
  CheckmarkBadge02Icon,
  MinusSignIcon,
  Image03Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import Header from "@/components/header";
import Footer from "@/components/footer";

type AddonId =
  | "alias-token"
  | "custom-badge"
  | "image-host";

type QuantityState = Record<AddonId, number>;

const premiumFeatures = [
  "Premium badge",
  "1 free alias token",
  "10 alias slots",
  "No profile watermark",
  "Click sounds",
  "Background themes",
  "Border animations",
  "550 MB file uploads",
  "Up to 10 links",
  "Unlimited music uploads",
  "Email service",
  "Custom metadata",
  "Claim banned usernames",
  "Upload your own fonts",
];

const freeFeatures = [
  "Your carts.lol profile",
  "Links, layouts & widgets",
  "Themes & customization",
];

const addons = [
  {
    id: "alias-token" as const,
    name: "Alias Token",
    price: "$1.49",
    description: "Claim another username on carts.lol.",
    icon: HashtagIcon,
    features: [
      "One Alias Token",
      "Points to your main profile",
      "Lifetime — no renewal",
    ],
    quantity: true,
  },
  {
    id: "custom-badge" as const,
    name: "Custom Badge",
    price: "$2.49",
    description:
      "Create your own custom badge with a unique icon and name.",
    icon: SparklesIcon,
    badge: "POPULAR",
    features: [
      "Custom icon & name",
      "Exclusive appearance",
      "Editable anytime",
    ],
    quantity: true,
  },
  {
    id: "image-host" as const,
    name: "Image Host",
    price: "$4.99",
    description:
      "Unlock premium image hosting with expanded storage, larger uploads, and exclusive perks.",
    icon: Image03Icon,
    features: [
      "Exclusive Image Host Badge",
      "Special Discord Server Role",
      "File size limit (250 MB)",
      "Expanded storage (100 GB)",
    ],
    quantity: false,
    primary: true,
  },
];

export default function StorePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [quantities, setQuantities] =
    useState<QuantityState>({
      "alias-token": 1,
      "custom-badge": 1,
      "image-host": 1,
    });

  function updateQuantity(
    product: AddonId,
    amount: number
  ) {
    setQuantities((current) => ({
      ...current,
      [product]: Math.max(
        1,
        Math.min(
          10,
          current[product] + amount
        )
      ),
    }));
  }

  async function checkout(
    product: string,
    quantity = 1
  ) {
    try {
      setLoading(product);
      setError("");

      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            product,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to start checkout."
        );
      }

      if (!data.url) {
        throw new Error(
          "Checkout URL was not returned."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#060608] text-white">
      <Header />

      <section className="mx-auto w-full max-w-[1180px] px-6 pb-28 pt-20">
        <div className="text-center">
          <h1 className="text-[42px] font-semibold leading-none tracking-[-2px] text-white sm:text-[48px]">
            Pricing
          </h1>

          <p className="mt-5 text-[14px] font-medium text-white/35">
            One-time payment. Lifetime access. Start free and upgrade
            when you&apos;re ready.
          </p>
        </div>

        {error && (
          <div className="mx-auto mt-10 max-w-[620px] rounded-xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-center text-[13px] text-red-400">
            {error}
          </div>
        )}

        <div className="mx-auto mt-16 grid max-w-[850px] items-end gap-5 lg:grid-cols-2">
          <div className="rounded-[20px] border border-white/[0.09] bg-[#0a0a0d] p-5">
            <div>
              <h2 className="text-[16px] font-semibold text-white">
                Free
              </h2>

              <p className="mt-1 text-[30px] font-semibold tracking-[-1px] text-white">
                $0
              </p>

              <p className="mt-1 text-[12px] text-white/35">
                For getting started — link everything in one place.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-5 flex h-[42px] w-full items-center justify-center rounded-[11px] border border-white/[0.11] bg-white/[0.015] text-[13px] font-semibold text-white transition hover:bg-white/[0.04]"
            >
              Go to dashboard
            </Link>

            <div className="mt-5 border-t border-dashed border-white/[0.08] pt-4">
              <div className="space-y-3">
                {freeFeatures.map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 text-[12px] text-white/45"
                    >
                      <HugeiconsIcon
                        icon={
                          CheckmarkCircle02Icon
                        }
                        size={14}
                        strokeWidth={1.7}
                        className="text-white/25"
                      />

                      <span>
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="relative rounded-[20px] border border-white/[0.13] bg-[#111114] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
            <div className="absolute -top-[10px] right-5 rounded-full border border-[#2832F9]/30 bg-[#111114] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.04em] text-white/55">
              Most popular
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-semibold text-white">
                  Premium
                </h2>

                <p className="mt-1 text-[34px] font-semibold tracking-[-1.4px] text-white">
                  $5.99
                </p>

                <p className="mt-1 text-[12px] text-white/35">
                  Pay once. Keep it forever. More room to customize.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  checkout("premium")
                }
                disabled={loading !== null}
                className="flex h-[42px] flex-1 items-center justify-center rounded-[12px] bg-[#2832F9] text-[13px] font-semibold text-white transition hover:bg-[#3540ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === "premium"
                  ? "Loading..."
                  : "Purchase"}
              </button>

              <button
                type="button"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-white/[0.11] bg-white/[0.03] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                <HugeiconsIcon
                  icon={GiftIcon}
                  size={17}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            <div className="mt-5 border-t border-dashed border-white/[0.08] pt-5">
              <div className="space-y-[13px]">
                {premiumFeatures.map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 text-[12px] text-white/55"
                    >
                      <HugeiconsIcon
                        icon={
                          CheckmarkCircle02Icon
                        }
                        size={15}
                        strokeWidth={1.8}
                        className="text-[#2832F9]"
                      />

                      <span>
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28 text-center">
          <h2 className="text-[30px] font-semibold tracking-[-1.2px] text-white">
            Discover more of our products
          </h2>

          <p className="mt-2 text-[13px] text-white/35">
            One-time add-ons for your account
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {addons.map((product) => {
            const quantity =
              quantities[product.id];

            return (
              <div
                key={product.id}
                className="relative flex min-h-[405px] flex-col rounded-[20px] border border-white/[0.09] bg-[#0b0b0e] p-6 transition duration-200 hover:border-white/[0.14]"
              >
                {product.badge && (
                  <div className="absolute right-5 top-5 rounded-full bg-[#2832F9]/20 px-2.5 py-1 text-[9px] font-semibold tracking-[0.05em] text-[#8890ff]">
                    {product.badge}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.025]">
                    <HugeiconsIcon
                      icon={product.icon}
                      size={18}
                      strokeWidth={1.7}
                      className="text-[#4e59ff]"
                    />
                  </div>

                  <h3 className="text-[17px] font-semibold tracking-[-0.4px] text-white">
                    {product.name}
                  </h3>
                </div>

                <p className="mt-5 text-[31px] font-semibold tracking-[-1px] text-white">
                  {product.price}
                </p>

                <p className="mt-2 max-w-[280px] text-[12px] leading-5 text-white/35">
                  {product.description}
                </p>

                <div className="mt-5 space-y-3">
                  {product.features.map(
                    (feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 text-[12px] text-white/50"
                      >
                        <HugeiconsIcon
                          icon={
                            CheckmarkCircle02Icon
                          }
                          size={14}
                          strokeWidth={1.8}
                          className="text-[#2832F9]"
                        />

                        <span>
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-auto pt-7">
                  {product.quantity && (
                    <div className="mb-4 flex h-[46px] items-center justify-between rounded-[12px] border border-white/[0.08] bg-black/10 px-3">
                      <span className="text-[11px] font-medium text-white/35">
                        Quantity
                      </span>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              -1
                            )
                          }
                          disabled={
                            quantity <= 1
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-white/30 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-30"
                        >
                          <HugeiconsIcon
                            icon={
                              MinusSignIcon
                            }
                            size={13}
                            strokeWidth={1.8}
                          />
                        </button>

                        <span className="min-w-3 text-center text-[13px] font-semibold text-white">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              product.id,
                              1
                            )
                          }
                          disabled={
                            quantity >= 10
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-white/45 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-30"
                        >
                          <HugeiconsIcon
                            icon={
                              PlusSignIcon
                            }
                            size={13}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        checkout(
                          product.id,
                          quantity
                        )
                      }
                      disabled={
                        loading !== null
                      }
                      className={`flex h-[42px] flex-1 items-center justify-center rounded-[11px] text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        product.primary
                          ? "bg-[#2832F9] text-white hover:bg-[#3540ff]"
                          : "border border-white/[0.09] bg-white/[0.035] text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {loading ===
                      product.id
                        ? "Loading..."
                        : "Purchase"}
                    </button>

                    <button
                      type="button"
                      className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-white/[0.1] bg-white/[0.025] text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <HugeiconsIcon
                        icon={GiftIcon}
                        size={17}
                        strokeWidth={1.7}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      <Footer />
    </main>
  );
}