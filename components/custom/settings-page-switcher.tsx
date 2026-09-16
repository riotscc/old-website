"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const tabs = [
  {
    label: "Names",
    href: "/dashboard/account/settings",
  },
  {
    label: "Security",
    href: "/dashboard/account/security",
  },
  {
    label: "Connections",
    href: "/dashboard/account/connections",
  },
  {
    label: "Sessions",
    href: "/dashboard/account/sessions",
  },
  {
    label: "Standing",
    href: "/dashboard/account/standing",
  },
  {
    label: "Danger Zone",
    href: "/dashboard/account/danger",
  },
] as const

export type SettingsTab =
  (typeof tabs)[number]["label"]

export default function SettingsPageSwitcher() {
  const pathname = usePathname()

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-0.5 rounded-[14px] border border-black/[0.08] bg-white p-1 dark:border-white/[0.07] dark:bg-[#0a0a0a]">
        {tabs.map((tab) => {
          const active =
            tab.href === "/dashboard/account/settings"
              ? pathname === tab.href
              : pathname === tab.href ||
                pathname.startsWith(`${tab.href}/`)

          const danger =
            tab.label === "Danger Zone"

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                "relative flex h-8 min-w-0 flex-1 items-center justify-center rounded-[9px] px-2 text-center text-[12px] font-medium transition-colors duration-200",
                danger
                  ? active
                    ? "text-red-500 dark:text-red-400"
                    : "text-black/45 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400"
                  : active
                    ? "text-[#2832F9] dark:text-[#7c83ff]"
                    : "text-black/50 hover:text-black/85 dark:text-white/45 dark:hover:text-white/80",
              ].join(" ")}
            >
              {active && (
                <motion.span
                  layoutId="settings-active-tab"
                  className={[
                    "absolute inset-0 rounded-[9px] border",
                    danger
                      ? "border-red-500/20 bg-red-500/[0.08]"
                      : "border-[#2832F9]/25 bg-[#2832F9]/[0.08] dark:border-[#2832F9]/30 dark:bg-[#2832F9]/10",
                  ].join(" ")}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                    mass: 0.75,
                  }}
                />
              )}

              {active && !danger && (
                <motion.span
                  layoutId="settings-active-line"
                  className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2832F9] to-transparent dark:via-[#5862ff]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                    mass: 0.75,
                  }}
                />
              )}

              <motion.span
                className="relative z-10 truncate"
                animate={{
                  scale: active ? 1 : 0.985,
                }}
                transition={{
                  duration: 0.15,
                }}
              >
                {tab.label}
              </motion.span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}