"use client";

import Image from "next/image";
import Link from "next/link";
import Dither from "@/components/Dither/Dither";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  DiscordIcon,
} from "@hugeicons/core-free-icons";

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="mx-auto w-full max-w-[1240px] px-6 pb-8 pt-8 sm:px-8 lg:px-6">
        <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0c0c0c]">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden sm:block">
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

            <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/90 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0c0c0c] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,transparent_0%,transparent_30%,rgba(12,12,12,0.12)_60%,rgba(12,12,12,0.55)_100%)]" />
          </div>

          <div className="relative z-10 flex min-h-[250px] items-center px-9 py-10 sm:px-12 lg:px-10">
            <div className="w-full max-w-[535px]">
              <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-1.5px] text-white sm:text-[35px]">
                Your page. Your identity.
              </h2>

              <p className="mt-4 max-w-[430px] text-[14px] leading-6 text-white/45">
                Bring your links, socials, and style together in one place.
              </p>

              <div className="mt-7 flex h-[52px] w-full max-w-[460px] items-center rounded-full border border-white/[0.11] bg-black/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-md">
                <div className="flex min-w-0 flex-1 items-center pl-3">
                  <span className="shrink-0 text-[12px] font-medium text-white/45">
                    carts.lol/
                  </span>

                  <input
                    type="text"
                    placeholder="yourname"
                    className="min-w-0 flex-1 bg-transparent px-2 text-[12px] font-medium text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <button
                  type="button"
                  className="group flex h-[38px] shrink-0 items-center gap-1.5 rounded-full bg-[#2832F9] px-5 text-[12px] font-semibold text-white shadow-[0_8px_25px_rgba(40,50,249,0.22)] transition-all duration-200 hover:bg-[#3943ff] hover:shadow-[0_10px_30px_rgba(40,50,249,0.3)] active:scale-[0.98]"
                >
                  Claim
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={15}
                    color="currentColor"
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-12 pb-12 pt-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.9fr_2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-[24px] font-bold tracking-[-1.2px] text-white"
            >
              <Image
                src="/images/icons/carts-white.png"
                alt="carts.lol"
                width={26}
                height={26}
                className="h-[26px] w-[26px] object-contain"
              />

              carts.lol
            </Link>

            <p className="mt-5 max-w-[300px] text-[13px] leading-[1.65] text-white/45">
              Built for your online identity.
              <br />
              One page, entirely yours.
            </p>
          </div>

          <FooterColumn
            title="General"
            links={[
              {
                label: "Login",
                href: "/login",
              },
              {
                label: "Sign up",
                href: "/signup",
              },
              {
                label: "Store",
                href: "/store",
              },
              {
                label: "Careers",
                href: "/careers",
              },
            ]}
          />

          <FooterColumn
            title="Documentation"
            links={[
              {
                label: "Security",
                href: "/security",
              },
              {
                label: "Terms",
                href: "/terms",
              },
              {
                label: "Privacy",
                href: "/privacy",
              },
            ]}
          />

          <FooterColumn
            title="Contact"
            links={[
              {
                label: "Discord",
                href: "/discord",
              },
            ]}
          />
        </div>

        <div className="h-px w-full bg-white/[0.07]" />

        <div className="flex items-center justify-between py-6">
          <p className="text-[11px] text-white/35">
            © {new Date().getFullYear()} carts.lol. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-white">{title}</p>

      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="w-fit text-[13px] text-white/45 transition-colors duration-200 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}