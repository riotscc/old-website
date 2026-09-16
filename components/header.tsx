"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";


const navigation = [
  {
    label: "Community",
    href: "/discord",
  },
  {
    label: "Store",
    href: "/store",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const authLoaded = !loading;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });


  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-[1240px]">
        <motion.nav
          initial={false}
          animate={{
            marginTop: scrolled ? 14 : 0,
            height: scrolled ? 64 : 82,
            borderRadius: scrolled ? 18 : 0,
            backgroundColor: scrolled
              ? "rgba(10, 10, 10, 0.78)"
              : "rgba(0, 0, 0, 0)",
            borderColor: scrolled
              ? "rgba(255, 255, 255, 0.09)"
              : "rgba(255, 255, 255, 0)",
            boxShadow: scrolled
              ? "0 18px 60px rgba(0, 0, 0, 0.45)"
              : "0 0 0 rgba(0, 0, 0, 0)",
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 30,
            mass: 0.8,
          }}
          className="pointer-events-auto relative flex w-full items-center border px-4 sm:px-5 lg:px-6"
          style={{
            backdropFilter: scrolled
              ? "blur(22px) saturate(155%)"
              : "blur(0px)",
            WebkitBackdropFilter: scrolled
              ? "blur(22px) saturate(155%)"
              : "blur(0px)",
          }}
        >
          <AnimatePresence>
            {scrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
              >
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black/[0.08]" />

                <div className="absolute -top-12 left-[8%] h-24 w-64 rounded-full bg-[#2832F9]/[0.045] blur-[55px]" />

                <div className="absolute -top-10 right-[5%] h-24 w-56 rounded-full bg-[#2832F9]/[0.035] blur-[50px]" />
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-2.5"
          >
            <Image
              src="/images/icons/carts-white.png"
              alt="carts.lol"
              width={28}
              height={28}
              className="h-[28px] w-[28px] object-contain"
              priority
            />

            <span className="text-[22px] font-bold leading-none tracking-[-1.15px] text-white">
              carts.lol
            </span>
          </Link>

          <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-9 items-center justify-center rounded-[9px] px-3.5 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/[0.055] text-white"
                      : "text-white/50 hover:bg-white/[0.035] hover:text-white/85"
                  }`}
                >
                  {item.label}

                  {active && (
                    <motion.span
                      layoutId="header-active"
                      className="absolute bottom-[3px] h-[2px] w-3 rounded-full bg-[#2832F9]"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2">
            {authLoaded && (
              <Link
                href={user ? "/dashboard" : "/login"}
                className="group hidden h-10 items-center justify-center gap-1.5 rounded-full bg-[#2832F9] px-5 text-[13px] font-semibold text-white shadow-[0_8px_30px_rgba(40,50,249,0.18)] transition-all duration-200 hover:bg-[#3842ff] hover:shadow-[0_10px_35px_rgba(40,50,249,0.28)] active:scale-[0.98] sm:flex"
              >
                {user ? "Dashboard" : "Get started"}

                {!user && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                )}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label="Toggle navigation"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/70 transition-all duration-200 hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <HugeiconsIcon
                icon={mobileOpen ? Cancel01Icon : Menu01Icon}
                size={19}
                color="currentColor"
                strokeWidth={1.7}
              />
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.985,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              className="pointer-events-auto mt-2 overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#0a0a0a]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:hidden"
            >
              <div className="flex flex-col">
                {navigation.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex h-12 items-center rounded-[12px] px-4 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-white/[0.055] text-white"
                          : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {authLoaded && (
                  <>
                    <div className="my-2 h-px bg-white/[0.07]" />

                    <Link
                      href={user ? "/dashboard" : "/login"}
                      className="flex h-12 items-center justify-between rounded-[12px] bg-[#2832F9] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#3842ff]"
                    >
                      {user ? "Dashboard" : "Get started"}

                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={16}
                        color="currentColor"
                        strokeWidth={2}
                      />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}