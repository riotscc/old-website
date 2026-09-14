"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Award01Icon,
  Cancel01Icon,
  Diamond02Icon,
  ExternalLinkIcon,
  Layout01Icon,
  Link01Icon,
  Logout01Icon,
  Home01Icon,
  DiscordIcon,
  MoreVerticalIcon,
  PaintBoardIcon,
  Search01Icon,
  Settings01Icon,
  Share08Icon,
  UserIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import NoPremium from "@/components/dashboard/no-premium";

type HugeIconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];

type CurrentUser = {
  id?: string;
  username: string;
  displayName: string;
  avatar: string | null;
  plan?: string;
};

type SearchItem = {
  label: string;
  href: string;
  section: string;
  icon: HugeIconType;
};

const accountLinks = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Badges",
    href: "/dashboard/badges",
  },
  {
    label: "Aliases",
    href: "/dashboard/aliases",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

const customizeLinks = [
  {
    label: "General",
    href: "/dashboard/customize/general",
  },
  {
    label: "Layout",
    href: "/dashboard/customize/layout",
  },
];

const premiumLinks = [
  {
    label: "General",
    href: "/dashboard/premium/general",
  },
  {
    label: "Metadata",
    href: "/dashboard/premium/metadata",
  },
];

const searchItems: SearchItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    section: "Account",
    icon: UserIcon,
  },
  {
    label: "Badges",
    href: "/dashboard/badges",
    section: "Account",
    icon: Award01Icon,
  },
  {
    label: "Aliases",
    href: "/dashboard/aliases",
    section: "Account",
    icon: UserSwitchIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    section: "Account",
    icon: Settings01Icon,
  },
  {
    label: "General",
    href: "/dashboard/customize/general",
    section: "Customize",
    icon: PaintBoardIcon,
  },
  {
    label: "Layout",
    href: "/dashboard/customize/layout",
    section: "Customize",
    icon: Layout01Icon,
  },
  {
    label: "Links",
    href: "/dashboard/links",
    section: "Dashboard",
    icon: Link01Icon,
  },
  {
    label: "Templates",
    href: "/dashboard/templates",
    section: "Dashboard",
    icon: Layout01Icon,
  },
  {
    label: "General",
    href: "/dashboard/premium/general",
    section: "Premium",
    icon: Diamond02Icon,
  },
  {
    label: "Metadata",
    href: "/dashboard/premium/metadata",
    section: "Premium",
    icon: Diamond02Icon,
  },
];

export default function CustomSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [accountOpen, setAccountOpen] = React.useState(true);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const [premiumOpen, setPremiumOpen] = React.useState(() =>
    pathname.startsWith("/dashboard/premium")
  );
  const [noPremiumOpen, setNoPremiumOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const [authResponse, planResponse] = await Promise.all([
          fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/account/plan", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (!authResponse.ok || !mounted) {
          return;
        }

        const authData = await authResponse.json();
        const planData = planResponse.ok
          ? await planResponse.json()
          : null;

        if (!mounted || !authData?.user) {
          return;
        }

        setUser({
          id: authData.user.id,
          username:
            authData.user.username ||
            authData.user.name ||
            authData.user.displayName ||
            "user",
          displayName:
            authData.user.displayName ||
            authData.user.globalName ||
            authData.user.name ||
            authData.user.username ||
            "User",
          avatar: authData.user.avatar || null,
          plan: planData?.plan || "free",
        });
      } catch {
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setNoPremiumOpen(false);
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

    if (pathname.startsWith("/dashboard/premium")) {
      setPremiumOpen(true);
    }
  }, [pathname]);

  const filteredItems = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchItems;
    }

    return searchItems.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const username = user?.username || "yourname";
  const isPremium = user?.plan?.toLowerCase() === "premium";

  function handlePremiumItem(href: string) {
    if (loadingUser) return;

    if (!isPremium) {
      setNoPremiumOpen(true);
      return;
    }

    router.push(href);
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
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[250px] border-r border-white/[0.055] bg-[#080808] lg:flex lg:flex-col">
        <div className="flex h-[68px] shrink-0 items-center px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/icons/carts-white.png"
              alt="carts.lol"
              width={29}
              height={29}
              className="h-[29px] w-[29px] object-contain"
              priority
            />

            <span className="text-[22px] font-bold tracking-[-1px] text-white">
              carts.lol
            </span>
          </Link>
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="group flex h-[42px] w-full items-center rounded-full border border-white/[0.08] bg-[#0b0b0b] px-3.5 text-left transition-all duration-200 hover:border-white/[0.13] hover:bg-[#0e0e0e]"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              color="currentColor"
              strokeWidth={1.8}
              className="shrink-0 text-white"
            />

            <span className="ml-3 flex-1 truncate text-[12px] font-medium text-white/35">
              Search features...
            </span>

            <span className="flex h-[23px] items-center gap-1 rounded-[7px] border border-white/[0.08] bg-white/[0.035] px-2 text-[9px] font-medium text-white/30 transition-colors group-hover:text-white/45">
              Ctrl K
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1">
            <SidebarGroup
              title="Account"
              icon={UserIcon}
              open={accountOpen}
              onToggle={() => setAccountOpen((value) => !value)}
            >
              {accountLinks.map((item, index) => (
                <NestedItem
                  key={item.href}
                  index={index}
                  label={item.label}
                  href={item.href}
                  active={
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </SidebarGroup>

            <SidebarGroup
              title="Customize"
              icon={PaintBoardIcon}
              open={customizeOpen}
              onToggle={() => setCustomizeOpen((value) => !value)}
            >
              {customizeLinks.map((item, index) => (
                <NestedItem
                  key={item.href}
                  index={index}
                  label={item.label}
                  href={item.href}
                  active={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </SidebarGroup>

            <MainItem
              label="Links"
              href="/dashboard/links"
              icon={Link01Icon}
              active={
                pathname === "/dashboard/links" ||
                pathname.startsWith("/dashboard/links/")
              }
            />

            <MainItem
              label="Templates"
              href="/dashboard/templates"
              icon={Layout01Icon}
              active={
                pathname === "/dashboard/templates" ||
                pathname.startsWith("/dashboard/templates/")
              }
            />

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
                  onClick={() => handlePremiumItem(item.href)}
                />
              ))}
            </SidebarGroup>
          </div>
        </nav>

        <div className="shrink-0 space-y-2 px-3 pb-3">
          <Link
            href={`/${username}`}
            target="_blank"
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[14px] bg-white/[0.075] text-[12px] font-semibold text-white/85 transition-colors duration-200 hover:bg-white/[0.105] hover:text-white"
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
                  className="absolute bottom-[calc(100%+8px)] left-0 w-full overflow-hidden rounded-[15px] border border-white/[0.08] bg-[#111111] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
                >
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-[12px] font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={Home01Icon}
                      size={14}
                      color="currentColor"
                      strokeWidth={1.8}
                    />

                    Home
                  </Link>

                  <Link
                    href="/discord"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex h-10 items-center gap-2.5 rounded-[10px] px-3 text-[12px] font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={DiscordIcon}
                      size={14}
                      color="currentColor"
                      strokeWidth={1.8}
                    />

                    Discord Server
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-10 w-full items-center gap-2.5 rounded-[10px] px-3 text-left text-[12px] font-medium text-red-400/80 transition-colors hover:bg-red-500/[0.07] hover:text-red-400"
                  >
                    <HugeiconsIcon
                      icon={Logout01Icon}
                      size={14}
                      color="currentColor"
                      strokeWidth={1.8}
                    />

                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex h-[54px] w-full items-center gap-2.5 rounded-[15px] border border-white/[0.065] bg-[#0b0b0b] px-2.5 text-left transition-all duration-200 hover:border-white/[0.1] hover:bg-[#0e0e0e]"
            >
              <UserAvatar
                avatar={user?.avatar}
                displayName={user?.displayName}
                loading={loadingUser}
              />

              <span className="min-w-0 flex-1">
                {loadingUser ? (
                  <>
                    <span className="block h-2.5 w-20 animate-pulse rounded bg-white/[0.08]" />

                    <span className="mt-1.5 block h-2 w-12 animate-pulse rounded bg-white/[0.05]" />
                  </>
                ) : (
                  <>
                    <span className="block truncate text-[11px] font-semibold text-white/90">
                      {user?.displayName || "User"}
                    </span>

                    <span className="mt-0.5 block truncate text-[9px] font-medium uppercase tracking-[0.02em] text-white/30">
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
                className="shrink-0 text-white/45"
              />
            </button>
          </div>
        </div>
      </aside>

      <NoPremium
        open={noPremiumOpen}
        onClose={() => setNoPremiumOpen(false)}
      />

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
              className="w-full max-w-[540px] overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#0c0c0c] shadow-[0_30px_100px_rgba(0,0,0,0.75)]"
            >
              <div className="flex h-[58px] items-center border-b border-white/[0.07] px-4">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.8}
                  className="shrink-0 text-white/45"
                />

                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filteredItems[0]) {
                      router.push(filteredItems[0].href);
                    }
                  }}
                  placeholder="Search features..."
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-white/25"
                />

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[9px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white"
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
                        onClick={() => {
                          if (item.section === "Premium") {
                            setSearchOpen(false);
                            handlePremiumItem(item.href);
                            return;
                          }

                          router.push(item.href);
                        }}
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
                      className="flex h-[120px] items-center justify-center text-[12px] text-white/30"
                    >
                      No features found.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex h-[38px] items-center gap-4 border-t border-white/[0.06] px-4 text-[9px] text-white/25">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/[0.08] bg-white/[0.035] px-1.5 py-0.5">
                    ↵
                  </kbd>

                  Open
                </span>

                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/[0.08] bg-white/[0.035] px-1.5 py-0.5">
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
            ? "bg-white/[0.055] text-white"
            : "text-white/80 hover:bg-white/[0.025] hover:text-white"
        }`}
      >
        <HugeiconsIcon
          icon={icon}
          size={15}
          color="currentColor"
          strokeWidth={1.8}
          className={`shrink-0 transition-colors ${
            premium
              ? "text-[#ffe600]"
              : active
                ? "text-white"
                : "text-white/65 group-hover:text-white"
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
            className="text-white/30 transition-colors group-hover:text-white/50"
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
              className="ml-[8px] border-l border-white/[0.08] pb-1 pl-[18px]"
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
}: {
  label: string;
  href: string;
  active: boolean;
  index: number;
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
      <Link
        href={href}
        className={`relative flex h-[30px] items-center text-[11px] font-medium transition-colors duration-150 ${
          active ? "text-white" : "text-white/35 hover:text-white/75"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-nested-active"
            className="absolute -left-[19px] h-[16px] w-px rounded-full bg-white/60"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
        )}

        {label}
      </Link>
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
            className="absolute -left-[19px] h-[16px] w-px rounded-full bg-white/60"
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
}: {
  label: string;
  href: string;
  icon: HugeIconType;
  active: boolean;
  premium?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-[40px] items-center rounded-[10px] px-1.5 transition-colors duration-150 ${
        active
          ? "bg-white/[0.055] text-white"
          : "text-white/80 hover:bg-white/[0.025] hover:text-white"
      }`}
    >
      <HugeiconsIcon
        icon={icon}
        size={15}
        color="currentColor"
        strokeWidth={1.8}
        className={`shrink-0 transition-colors ${
          premium
            ? "text-[#ffe600]"
            : active
              ? "text-white"
              : "text-white/65 group-hover:text-white"
        }`}
      />

      <span className="ml-2.5 flex-1 text-[12px] font-semibold">
        {label}
      </span>

      {trailing}
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
      className="group flex h-[52px] w-full items-center gap-3 rounded-[13px] px-3 text-left transition-colors hover:bg-white/[0.055]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.06] bg-white/[0.035] text-white/45 transition-colors group-hover:text-white/80">
        <HugeiconsIcon
          icon={item.icon}
          size={15}
          color="currentColor"
          strokeWidth={1.8}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white/85">
          {item.label}
        </span>

        <span className="mt-0.5 block truncate text-[10px] text-white/30">
          {item.section}
        </span>
      </span>

      <span className="text-[10px] text-white/20">↵</span>
    </motion.button>
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
      <span className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/[0.07]" />
    );
  }

  if (avatar) {
    return (
      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.04]">
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
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#151515] text-[11px] font-semibold text-white/70">
      {initial}
    </span>
  );
}