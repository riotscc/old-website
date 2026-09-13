"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleIcon,
  Github01Icon,
  DiscordIcon,
} from "@hugeicons/core-free-icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#080808]">
      <div className="mx-auto w-full max-w-[1540px] px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.7fr_0.75fr_0.75fr_0.75fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-block text-[38px] font-extrabold leading-none tracking-[-2.5px] text-white"
            >
              hushd.lol
            </Link>

            <p className="mt-5 max-w-[390px] text-[14px] leading-6 text-white/55">
              Manage your orders, track progress, and keep everything
              organized from one focused dashboard.
            </p>
          </div>

          <FooterColumn
            title="PRODUCT"
            links={[
              {
                label: "Pricing",
                href: "/pricing",
              },
              {
                label: "Store",
                href: "/store",
              },
            ]}
          />

          <FooterColumn
            title="RESOURCES"
            links={[
              {
                label: "Documentation",
                href: "/docs",
              },
              {
                label: "Support",
                href: "/support",
              },
            ]}
          />

          <FooterColumn
            title="LEGAL"
            links={[
              {
                label: "Privacy Policy",
                href: "/privacy",
              },
              {
                label: "Terms of Service",
                href: "/terms",
              },
              {
                label: "Security",
                href: "/security",
              },
            ]}
          />
        </div>

        <div className="mt-16 h-px w-full bg-white/[0.07]" />

        <div className="flex flex-col gap-6 pt-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/50">
            © {new Date().getFullYear()} hushd.lol. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-7 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 text-[11px] font-medium text-white/55">
              <HugeiconsIcon
                icon={CircleIcon}
                size={7}
                color="currentColor"
                strokeWidth={1.5}
              />
              v1.0.0 · Stable
            </div>

            <div className="flex h-7 items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.05] px-3 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Operational
            </div>

            <Link
              href="/github"
              aria-label="GitHub"
              className="ml-1 flex h-8 w-8 items-center justify-center text-white/45 transition-colors duration-200 hover:text-white"
            >
              <HugeiconsIcon
                icon={Github01Icon}
                size={19}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>

            <Link
              href="/discord"
              aria-label="Discord"
              className="flex h-8 w-8 items-center justify-center text-white/45 transition-colors duration-200 hover:text-white"
            >
              <HugeiconsIcon
                icon={DiscordIcon}
                size={19}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Link>
          </div>
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
      <p className="text-[11px] font-semibold tracking-[0.04em] text-white/45">
        {title}
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="w-fit text-[14px] font-medium text-white/75 transition-colors duration-200 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}