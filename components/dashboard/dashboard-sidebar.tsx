"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/components/providers/auth-provider";
import UnderConstructionModal from "@/components/custom/not-finished";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Diamond02Icon,
  ExternalLinkIcon,
  Logout01Icon,
  Home01Icon,
  DiscordIcon,
  MoreVerticalIcon,
  PaintBoardIcon,
  Search01Icon,
  Settings01Icon,
  Share08Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

type HugeIconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];


type SearchItem = {
  label: string;
  href: string;
  section: string;
  icon: HugeIconType;
  underConstruction?: boolean;
};

const profileLinks = [
  {
    label: "Assets",
    href: "/dashboard/profile/assets",
    underConstruction: true,
  },
  {
    label: "Badges",
    href: "/dashboard/profile/badges",
  },
  {
    label: "Links",
    href: "/dashboard/profile/links",
  },
  {
    label: "Projects",
    href: "/dashboard/profile/projects",
    underConstruction: true,
  },
  {
    label: "Widgets",
    href: "/dashboard/profile/widgets",
    underConstruction: true,
  },
  {
    label: "Section Builder",
    href: "/dashboard/profile/section-builder",
    underConstruction: true,
  },
];

const accountLinks = [
  {
    label: "Settings",
    href: "/dashboard/account/settings",
  },
  {
    label: "Profiles",
    href: "/dashboard/account/profiles",
    underConstruction: true,
  },
  {
    label: "Domains",
    href: "/dashboard/account/domains",
    underConstruction: true,
  },
  {
    label: "Billing",
    href: "/dashboard/account/billing",
    underConstruction: true,
  },
  {
    label: "Wallet",
    href: "/dashboard/account/wallet",
    underConstruction: true,
  },
  {
    label: "Tickets",
    href: "/dashboard/account/tickets",
    underConstruction: true,
  },
];

const premiumLinks = [
  {
    label: "General",
    href: "/dashboard/premium/general",
    underConstruction: true,
  },
  {
    label: "Metadata",
    href: "/dashboard/premium/metadata",
    underConstruction: true,
  },
];

const searchItems: SearchItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    section: "Dashboard",
    icon: Home01Icon,
  },
  {
    label: "Customize",
    href: "/dashboard/customize",
    section: "Dashboard",
    icon: PaintBoardIcon,
    underConstruction: true,
  },
  ...profileLinks.map((item) => ({
    ...item,
    section: "Profile",
    icon: UserIcon,
  })),
  ...accountLinks.map((item) => ({
    ...item,
    section: "Account",
    icon: Settings01Icon,
  })),
  ...premiumLinks.map((item) => ({
    ...item,
    section: "Premium",
    icon: Diamond02Icon,
  })),
];

export default function CustomSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading: loadingUser } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const applyTheme = React.useCallback(
    (nextTheme: "light" | "dark" | "system") => {
      const root = document.documentElement;
      const resolved =
        nextTheme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : nextTheme;

      setTheme(nextTheme);
      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
    },
    [setTheme]
  );
  const [profileOpen, setProfileOpen] = React.useState(() =>
    profileLinks.some(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
  );
  const [accountOpen, setAccountOpen] = React.useState(() =>
    accountLinks.some(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
  );
  const [premiumOpen, setPremiumOpen] = React.useState(() =>
    pathname.startsWith("/dashboard/premium")
  );
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [constructionVersion, setConstructionVersion] = React.useState(0);

  const userMenuRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncSystemTheme = () => {
      const root = document.documentElement;
      const resolved = media.matches ? "dark" : "light";

      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
    };

    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);

    return () => {
      media.removeEventListener("change", syncSystemTheme);
    };
  }, [theme]);

  React.useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  React.useEffect(() => {
    if (!userMenuOpen) return;

    function handleOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [userMenuOpen]);

  React.useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");

    if (
      profileLinks.some(
        (item) =>
          pathname === item.href || pathname.startsWith(`${item.href}/`)
      )
    ) {
      setProfileOpen(true);
    }

    if (
      accountLinks.some(
        (item) =>
          pathname === item.href || pathname.startsWith(`${item.href}/`)
      )
    ) {
      setAccountOpen(true);
    }

    if (pathname.startsWith("/dashboard/premium")) {
      setPremiumOpen(true);
    }
  }, [pathname]);

  const username = user?.username || "yourname";
  const plan = user?.plan?.toLowerCase() || "free";
  const isPremium = ["premium", "pro", "business", "legacy"].includes(plan);

  const filteredItems = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const visibleItems = isPremium
      ? searchItems
      : searchItems.filter((item) => item.section !== "Premium");

    if (!query) {
      return visibleItems;
    }

    return visibleItems.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, isPremium]);

  function handleItemOpen(item: {
    href: string;
    underConstruction?: boolean;
  }) {
    if (item.underConstruction) {
      setSearchOpen(false);
      setUserMenuOpen(false);
      setConstructionVersion((value) => value + 1);
      return;
    }

    router.push(item.href);
  }

  async function handleShare() {
    const url = `${window.location.origin}/${username}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {}
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[250px] border-r border-black/[0.08] bg-white text-[#111111] lg:flex lg:flex-col dark:border-white/[0.055] dark:bg-[#080808] dark:text-white">
        <div className="flex h-[68px] shrink-0 items-center px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/icons/carts-white.png"
              alt="carts.lol"
              width={29}
              height={29}
              className="h-[29px] w-[29px] object-contain invert dark:invert-0"
              priority
            />

            <span className="text-[22px] font-bold tracking-[-1px] text-[#111111] dark:text-white">
              carts.lol
            </span>
          </Link>
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="group flex h-[42px] w-full items-center rounded-full border border-black/[0.08] bg-black/[0.025] px-3.5 text-left transition-all duration-200 hover:border-black/[0.13] hover:bg-black/[0.045] dark:border-white/[0.08] dark:bg-[#0b0b0b] dark:hover:border-white/[0.13] dark:hover:bg-[#0e0e0e]"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              color="currentColor"
              strokeWidth={1.8}
              className="shrink-0 text-black dark:text-white"
            />

            <span className="ml-3 flex-1 truncate text-[12px] font-medium text-black/40 dark:text-white/35">
              Search features...
            </span>

            <span className="flex h-[23px] items-center gap-1 rounded-[7px] border border-black/[0.08] bg-black/[0.035] px-2 text-[9px] font-medium text-black/35 transition-colors group-hover:text-black/55 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/30 dark:group-hover:text-white/45">
              Ctrl K
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1">
            <MainItem
              label="Overview"
              href="/dashboard"
              icon={Home01Icon}
              active={pathname === "/dashboard"}
            />

            <MainItem
              label="Customize"
              href="/dashboard/customize"
              icon={PaintBoardIcon}
              active={
                pathname === "/dashboard/customize" ||
                pathname.startsWith("/dashboard/customize/")
              }
              underConstruction
              onUnderConstruction={() =>
                setConstructionVersion((value) => value + 1)
              }
            />

            <SidebarGroup
              title="Profile"
              icon={UserIcon}
              open={profileOpen}
              onToggle={() => setProfileOpen((value) => !value)}
              active={profileLinks.some(
                (item) =>
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
              )}
            >
              {profileLinks.map((item, index) => (
                <NestedItem
                  key={item.href}
                  index={index}
                  label={item.label}
                  href={item.href}
                  underConstruction={item.underConstruction}
                  onUnderConstruction={() => setConstructionVersion((value) => value + 1)}
                  active={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </SidebarGroup>

            <SidebarGroup
              title="Account"
              icon={Settings01Icon}
              open={accountOpen}
              onToggle={() => setAccountOpen((value) => !value)}
              active={accountLinks.some(
                (item) =>
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
              )}
            >
              {accountLinks.map((item, index) => (
                <NestedItem
                  key={item.href}
                  index={index}
                  label={item.label}
                  href={item.href}
                  underConstruction={item.underConstruction}
                  onUnderConstruction={() => setConstructionVersion((value) => value + 1)}
                  active={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </SidebarGroup>

            {isPremium && (
              <SidebarGroup
                title="Premium"
                icon={Diamond02Icon}
                open={premiumOpen}
                onToggle={() => setPremiumOpen((value) => !value)}
                active={pathname.startsWith("/dashboard/premium")}
                premium
              >
                {premiumLinks.map((item, index) => (
                  <PremiumNestedItem
                    key={item.href}
                    index={index}
                    label={item.label}
                    active={
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                    }
                    onClick={() => handleItemOpen(item)}
                  />
                ))}
              </SidebarGroup>
            )}
          </div>
        </nav>

        <div className="shrink-0 space-y-2 px-3 pb-3">
          <Link
            href={`/${username}`}
            target="_blank"
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[14px] bg-black/[0.055] text-[12px] font-semibold text-black/80 transition-colors duration-200 hover:bg-black/[0.09] hover:text-black dark:bg-white/[0.075] dark:text-white/85 dark:hover:bg-white/[0.105] dark:hover:text-white"
          >
            <HugeiconsIcon
              icon={ExternalLinkIcon}
              size={14}
              color="currentColor"
              strokeWidth={1.8}
            />
            My Page
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#2832F9] text-[12px] font-semibold text-white shadow-[0_8px_28px_rgba(40,50,249,0.18)] transition-all duration-200 hover:bg-[#3943ff] hover:shadow-[0_10px_32px_rgba(40,50,249,0.25)] active:scale-[0.985]"
          >
            <HugeiconsIcon
              icon={Share08Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.9}
            />

            {copied ? "Link copied" : "Share your profile"}
          </button>

          <div ref={userMenuRef} className="relative">
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-[calc(100%+8px)] left-0 w-full overflow-hidden rounded-[17px] border border-black/[0.08] bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.16)] dark:border-white/[0.075] dark:bg-[#0d0d0d] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                >
                  <ThemeModeSelector
                    theme={theme}
                    resolvedTheme={resolvedTheme}
                    onThemeChange={applyTheme}
                  />

                  <div className="mt-1 border-t border-black/[0.07] pt-1 dark:border-white/[0.055]">
                    <Link
                      href="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="group flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-[11px] font-semibold text-black/70 transition-colors hover:bg-black/[0.045] hover:text-black dark:text-white/75 dark:hover:bg-white/[0.045] dark:hover:text-white"
                    >
                      <HugeiconsIcon
                        icon={Home01Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.8}
                        className="text-black/55 transition-colors group-hover:text-black dark:text-white/65 dark:group-hover:text-white"
                      />

                      Home
                    </Link>

                    <Link
                      href="/discord"
                      onClick={() => setUserMenuOpen(false)}
                      className="group flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-[11px] font-semibold text-black/70 transition-colors hover:bg-black/[0.045] hover:text-black dark:text-white/75 dark:hover:bg-white/[0.045] dark:hover:text-white"
                    >
                      <HugeiconsIcon
                        icon={DiscordIcon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.8}
                        className="text-black/55 transition-colors group-hover:text-black dark:text-white/65 dark:group-hover:text-white"
                      />

                      Discord Server
                    </Link>

                    <Link
                      href="/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="group flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-[11px] font-semibold text-black/70 transition-colors hover:bg-black/[0.045] hover:text-black dark:text-white/75 dark:hover:bg-white/[0.045] dark:hover:text-white"
                    >
                      <HelpIcon />

                      Help Center
                    </Link>
                  </div>

                  <div className="mt-1 border-t border-black/[0.07] pt-1 dark:border-white/[0.055]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex h-10 w-full items-center gap-2.5 rounded-[10px] px-3 text-left text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-500/[0.07] hover:text-red-300"
                    >
                      <HugeiconsIcon
                        icon={Logout01Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.8}
                      />

                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex h-[54px] w-full items-center gap-2.5 rounded-[15px] border border-black/[0.08] bg-black/[0.02] px-2.5 text-left transition-all duration-200 hover:border-black/[0.12] hover:bg-black/[0.045] dark:border-white/[0.065] dark:bg-[#0b0b0b] dark:hover:border-white/[0.1] dark:hover:bg-[#0e0e0e]"
            >
              <UserAvatar
                avatar={user?.avatar}
                displayName={user?.displayName}
                loading={loadingUser}
              />

              <span className="min-w-0 flex-1">
                {loadingUser ? (
                  <>
                    <span className="block h-2.5 w-20 animate-pulse rounded bg-black/[0.08] dark:bg-white/[0.08]" />

                    <span className="mt-1.5 block h-2 w-12 animate-pulse rounded bg-black/[0.05] dark:bg-white/[0.05]" />
                  </>
                ) : (
                  <>
                    <span className="block truncate text-[11px] font-semibold text-black/90 dark:text-white/90">
                      {user?.displayName || "User"}
                    </span>

                    <span className="mt-0.5 block truncate text-[9px] font-medium uppercase tracking-[0.02em] text-black/35 dark:text-white/30">
                      {user?.plan || "Free"}
                    </span>
                  </>
                )}
              </span>

              <HugeiconsIcon
                icon={MoreVerticalIcon}
                size={15}
                color="currentColor"
                strokeWidth={1.8}
                className="shrink-0 text-black/45 dark:text-white/45"
              />
            </button>
          </div>
        </div>
      </aside>

      {constructionVersion > 0 && (
        <UnderConstructionModal
          key={constructionVersion}
          discordUrl="https://discord.gg/carts"
        />
      )}

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.15,
            }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-[6px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSearchOpen(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              transition={{
                duration: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-[540px] overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.18)] dark:border-white/[0.09] dark:bg-[#0c0c0c] dark:shadow-[0_30px_100px_rgba(0,0,0,0.75)]"
            >
              <div className="flex h-[58px] items-center border-b border-black/[0.07] px-4 dark:border-white/[0.07]">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.8}
                  className="shrink-0 text-black/45 dark:text-white/45"
                />

                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filteredItems[0]) {
                      handleItemOpen(filteredItems[0]);
                    }
                  }}
                  placeholder="Search features..."
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/25"
                />

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-black/40 transition-colors hover:bg-black/[0.05] hover:text-black dark:text-white/35 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              <div className="max-h-[380px] overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <AnimatePresence mode="popLayout">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <SearchResult
                        key={item.href}
                        item={item}
                        index={index}
                        onClick={() => handleItemOpen(item)}
                      />
                    ))
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{
                        opacity: 0,
                        y: 4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="flex h-[120px] items-center justify-center text-[12px] text-black/35 dark:text-white/30"
                    >
                      No features found.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex h-[38px] items-center gap-4 border-t border-black/[0.07] px-4 text-[9px] text-black/35 dark:border-white/[0.06] dark:text-white/25">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-black/[0.08] bg-black/[0.035] px-1.5 py-0.5 dark:border-white/[0.08] dark:bg-white/[0.035]">
                    ↵
                  </kbd>

                  Open
                </span>

                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-black/[0.08] bg-black/[0.035] px-1.5 py-0.5 dark:border-white/[0.08] dark:bg-white/[0.035]">
                    esc
                  </kbd>

                  Close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarGroup({
  title,
  icon,
  open,
  onToggle,
  children,
  className = "",
  active = false,
  premium = false,
}: {
  title: string;
  icon: HugeIconType;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  premium?: boolean;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`group flex h-[40px] w-full items-center rounded-[10px] px-1.5 text-left transition-colors duration-200 ${
          active
            ? "bg-black/[0.055] text-black dark:bg-white/[0.055] dark:text-white"
            : "text-black/80 hover:bg-black/[0.025] hover:text-black dark:text-white/80 dark:hover:bg-white/[0.025] dark:hover:text-white"
        }`}
      >
        <HugeiconsIcon
          icon={icon}
          size={15}
          color="currentColor"
          strokeWidth={1.8}
          className={`shrink-0 transition-colors ${
            premium
              ? "text-[#d6bd00] dark:text-[#ffe600]"
              : active
                ? "text-black dark:text-white"
                : "text-black/60 group-hover:text-black dark:text-white/65 dark:group-hover:text-white"
          }`}
        />

        <span className="ml-2.5 flex-1 text-[12px] font-semibold">
          {title}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 28,
            mass: 0.6,
          }}
          className="flex items-center justify-center"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={13}
            color="currentColor"
            strokeWidth={1.7}
            className="text-black/35 transition-colors group-hover:text-black/55 dark:text-white/30 dark:group-hover:text-white/50"
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.26,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.18,
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{
                y: -8,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: -6,
              }}
              transition={{
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="ml-[8px] border-l border-black/[0.1] pb-1 pl-[18px] dark:border-white/[0.08]"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NestedItem({
  label,
  href,
  active,
  index,
  underConstruction = false,
  onUnderConstruction,
}: {
  label: string;
  href: string;
  active: boolean;
  index: number;
  underConstruction?: boolean;
  onUnderConstruction: () => void;
}) {
  const content = (
    <>
      {active && (
        <motion.span
          layoutId="sidebar-nested-active"
          className="absolute -left-[19px] h-[16px] w-px rounded-full bg-black/55 dark:bg-white/60"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}

      {label}
    </>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -6,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.22,
        delay: index * 0.025,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {underConstruction ? (
        <button
          type="button"
          onClick={onUnderConstruction}
          className={`relative flex h-[30px] w-full items-center text-left text-[11px] font-medium transition-colors duration-150 ${
            active
              ? "text-black dark:text-white"
              : "text-black/40 hover:text-black/75 dark:text-white/35 dark:hover:text-white/75"
          }`}
        >
          {content}
        </button>
      ) : (
        <Link
          href={href}
          className={`relative flex h-[30px] items-center text-[11px] font-medium transition-colors duration-150 ${
            active
              ? "text-black dark:text-white"
              : "text-black/40 hover:text-black/75 dark:text-white/35 dark:hover:text-white/75"
          }`}
        >
          {content}
        </Link>
      )}
    </motion.div>
  );
}

function PremiumNestedItem({
  label,
  active,
  index,
  onClick,
}: {
  label: string;
  active: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -6,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.22,
        delay: index * 0.025,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className={`relative flex h-[30px] w-full items-center text-left text-[11px] font-medium transition-colors duration-150 ${
          active ? "text-white" : "text-white/35 hover:text-white/75"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-premium-nested-active"
            className="absolute -left-[19px] h-[16px] w-px rounded-full bg-black/55 dark:bg-white/60"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        {label}
      </button>
    </motion.div>
  );
}

function MainItem({
  label,
  href,
  icon,
  active,
  premium,
  trailing,
  underConstruction = false,
  onUnderConstruction,
}: {
  label: string;
  href: string;
  icon: HugeIconType;
  active: boolean;
  premium?: boolean;
  trailing?: React.ReactNode;
  underConstruction?: boolean;
  onUnderConstruction?: () => void;
}) {
  const className = `group flex h-[40px] w-full items-center rounded-[10px] px-1.5 text-left transition-colors duration-150 ${
    active
      ? "bg-black/[0.055] text-black dark:bg-white/[0.055] dark:text-white"
      : "text-black/80 hover:bg-black/[0.025] hover:text-black dark:text-white/80 dark:hover:bg-white/[0.025] dark:hover:text-white"
  }`;

  const content = (
    <>
      <HugeiconsIcon
        icon={icon}
        size={15}
        color="currentColor"
        strokeWidth={1.8}
        className={`shrink-0 transition-colors ${
          premium
            ? "text-[#d6bd00] dark:text-[#ffe600]"
            : active
              ? "text-black dark:text-white"
              : "text-black/60 group-hover:text-black dark:text-white/65 dark:group-hover:text-white"
        }`}
      />

      <span className="ml-2.5 flex-1 text-[12px] font-semibold">
        {label}
      </span>

      {trailing}
    </>
  );

  if (underConstruction) {
    return (
      <button
        type="button"
        onClick={onUnderConstruction}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function SearchResult({
  item,
  index,
  onClick,
}: {
  item: SearchItem;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      initial={{
        opacity: 0,
        y: 5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -4,
      }}
      transition={{
        duration: 0.16,
        delay: Math.min(index * 0.02, 0.1),
      }}
      type="button"
      onClick={onClick}
      className="group flex h-[52px] w-full items-center gap-3 rounded-[13px] px-3 text-left transition-colors hover:bg-black/[0.045] dark:hover:bg-white/[0.055]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-black/[0.08] bg-black/[0.035] text-black/45 transition-colors group-hover:text-black/80 dark:border-white/[0.06] dark:bg-white/[0.035] dark:text-white/45 dark:group-hover:text-white/80">
        <HugeiconsIcon
          icon={item.icon}
          size={15}
          color="currentColor"
          strokeWidth={1.8}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-black/85 dark:text-white/85">
          {item.label}
        </span>

        <span className="mt-0.5 block truncate text-[10px] text-black/35 dark:text-white/30">
          {item.section}
        </span>
      </span>

      <span className="text-[10px] text-black/25 dark:text-white/20">↵</span>
    </motion.button>
  );
}


function ThemeModeSelector({
  theme,
  resolvedTheme,
  onThemeChange,
}: {
  theme?: string;
  resolvedTheme?: string;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme || "system" : "system";
  const resolved = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="grid grid-cols-3 gap-1 rounded-[12px] bg-black/[0.045] p-1 dark:bg-black/30">
      <ThemeOption
        label="System"
        active={currentTheme === "system"}
        onClick={() => onThemeChange("system")}
        icon={<SystemThemeIcon />}
      />

      <div className="relative">
        <ThemeOption
          label="Light"
          active={currentTheme === "light"}
          onClick={() => onThemeChange("light")}
          icon={<LightThemeIcon />}
        />

        {mounted && resolved === "dark" && currentTheme !== "light" && (
          <AnimatedThemeToggler
            theme="dark"
            onThemeChange={() => onThemeChange("light")}
            duration={450}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
        )}
      </div>

      <div className="relative">
        <ThemeOption
          label="Dark"
          active={currentTheme === "dark"}
          onClick={() => onThemeChange("dark")}
          icon={<DarkThemeIcon />}
        />

        {mounted && resolved === "light" && currentTheme !== "dark" && (
          <AnimatedThemeToggler
            theme="light"
            onThemeChange={() => onThemeChange("dark")}
            duration={450}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
        )}
      </div>
    </div>
  );
}

function ThemeOption({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-[46px] w-full flex-col items-center justify-center gap-1 rounded-[10px] text-[9px] font-semibold transition-colors ${
        active
          ? "bg-[#2832F9]/10 text-[#2832F9] dark:bg-[#2832F9]/20 dark:text-[#7c83ff]"
          : "text-black/40 hover:bg-black/[0.04] hover:text-black/70 dark:text-white/40 dark:hover:bg-white/[0.04] dark:hover:text-white/70"
      }`}
    >
      <span
        className={`flex h-[17px] items-center justify-center ${
          active
            ? "text-[#2832F9] dark:text-[#7c83ff]"
            : "text-black/35 dark:text-white/35"
        }`}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

function SystemThemeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function LightThemeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.42 1.42" />
      <path d="m17.65 17.65 1.42 1.42" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.35 17.65-1.42 1.42" />
      <path d="m19.07 4.93-1.42 1.42" />
    </svg>
  );
}

function DarkThemeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.5 14.1A8.4 8.4 0 0 1 9.9 3.5a8.6 8.6 0 1 0 10.6 10.6Z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black/55 dark:text-white/65"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.75 9a2.35 2.35 0 1 1 3.7 1.92c-.86.62-1.45 1.04-1.45 2.08" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function UserAvatar({
  avatar,
  displayName,
  loading,
}: {
  avatar?: string | null;
  displayName?: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <span className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-black/[0.07] dark:bg-white/[0.07]" />
    );
  }

  if (avatar) {
    return (
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.04]">
        <img
          src={avatar}
          alt={displayName || "User"}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.05] text-[11px] font-semibold text-black/70 dark:border-white/[0.08] dark:bg-[#151515] dark:text-white/70">
      {initial}
    </span>
  );
}