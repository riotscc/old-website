"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    motion,
    useMotionValueEvent,
    useScroll,
} from "framer-motion";

type UserProfile = {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
};

export default function Header() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 32);
    });

    useEffect(() => {
        let mounted = true;

        fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        })
            .then(async (response) => {
                if (!response.ok) return null;
                return response.json();
            })
            .then((data) => {
                if (!mounted) return;

                if (data?.user) {
                    setUser(data.user);
                }

                setAuthLoaded(true);
            })
            .catch(() => {
                if (mounted) {
                    setAuthLoaded(true);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-4">
            <motion.nav
                initial={false}
                animate={{
                    marginTop: scrolled ? 16 : 0,
                    maxWidth: scrolled ? 1120 : 1240,
                    height: scrolled ? 72 : 78,
                    borderRadius: scrolled ? 15 : 0,
                    backgroundColor: scrolled
                        ? "rgba(8, 8, 8, 0.68)"
                        : "rgba(8, 8, 8, 0)",
                    borderColor: scrolled
                        ? "rgba(255, 255, 255, 0.10)"
                        : "rgba(255, 255, 255, 0)",
                    boxShadow: scrolled
                        ? "0 14px 45px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255,255,255,0.045)"
                        : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 29,
                    mass: 0.85,
                }}
                className="pointer-events-auto relative flex w-full items-center border px-9"
                style={{
                    backdropFilter: scrolled
                        ? "blur(20px) saturate(160%)"
                        : "blur(0px)",
                    WebkitBackdropFilter: scrolled
                        ? "blur(20px) saturate(160%)"
                        : "blur(0px)",
                }}
            >
                {scrolled && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                    >
                        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-black/[0.05]" />
                        <div className="absolute left-[12%] top-[-45px] h-[90px] w-[260px] rounded-full bg-white/[0.025] blur-[50px]" />
                        <div className="absolute right-[8%] top-[-45px] h-[90px] w-[220px] rounded-full bg-white/[0.02] blur-[50px]" />
                    </motion.div>
                )}

                <Link
                    href="/"
                    className="relative z-10 shrink-0 text-[42px] font-extrabold leading-none tracking-[-2.5px] text-white"
                >
                    hushd.lol
                </Link>

                <div className="absolute left-1/2 z-10 flex h-full -translate-x-1/2 items-center justify-center gap-2">
                    <NavItem href="/discord" label="Community" />
                    <NavItem href="/store" label="Store" />
                    <NavItem href="/leaderboard" label="Leaderboard" />
                </div>

                <div className="relative z-10 ml-auto flex items-center justify-center">
                    {authLoaded && (
                        <Link
                            href={user ? "/dashboard" : "/login"}
                            className="flex h-[42px] min-w-[112px] items-center justify-center rounded-full bg-[#2832f9] px-5 text-center text-[14px] font-semibold leading-none tracking-[-0.2px] text-white transition-all duration-200 hover:bg-[#3640ff] active:scale-[0.98]"
                        >
                            <span className="flex h-full w-full items-center justify-center text-center leading-none">
                                {user ? "Dashboard" : "Get started"}
                            </span>
                        </Link>
                    )}
                </div>
            </motion.nav>
        </header>
    );
}

function NavItem({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="flex h-10 items-center justify-center rounded-[9px] px-4 text-center text-[14px] font-semibold text-white/65 transition-all duration-200 hover:bg-white/[0.045] hover:text-white"
        >
            <span className="leading-none">{label}</span>
        </Link>
    );
}