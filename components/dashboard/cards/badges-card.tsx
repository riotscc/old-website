"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon } from "@hugeicons/core-free-icons";

type CurrentUser = {
  id: string;
  username: string;
  displayName?: string;
  globalName?: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  requirement: string;
};

type AssignedBadge = {
  badgeImage: string;
  badgeName: string;
  badgeRoleID: string;
};

type BadgesResponse = {
  success?: boolean;
  badges?: AssignedBadge[];
};

const badges: Badge[] = [
  {
    id: "staff",
    name: "Staff",
    description: "Reserved for members of the carts.lol team.",
    requirement: "Staff only",
    image: "/images/badges/staff.png",
  },
  {
    id: "verified",
    name: "Verified",
    description: "Given to notable and verified community members.",
    requirement: "Manually granted",
    image: "/images/badges/verified.png",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Unlocked by purchasing carts.lol Premium.",
    requirement: "Premium required",
    image: "/images/badges/premium.png",
  },
  {
    id: "tester",
    name: "Tester",
    description: "Given to users who help test new carts.lol features.",
    requirement: "Tester only",
    image: "/images/badges/tester.png",
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Awarded for reporting useful bugs and security issues.",
    requirement: "Manually granted",
    image: "/images/badges/bug-hunter.png",
  },
  {
    id: "early-supporter",
    name: "Early Supporter",
    description: "Given to users who supported carts.lol early on.",
    requirement: "Legacy badge",
    image: "/images/badges/early-supporter.png",
  },
  {
    id: "og",
    name: "OG",
    description: "Reserved for some of the earliest carts.lol accounts.",
    requirement: "Legacy badge",
    image: "/images/badges/og.png",
  },
  {
    id: "guild-tag",
    name: "Guild Tag",
    description: "Unlocked while using the carts.lol Discord server tag.",
    requirement: "Discord tag required",
    image: "/images/badges/guild-tag.png",
  },
  {
    id: "server-booster",
    name: "Server Booster",
    description: "Unlocked while boosting the carts.lol Discord server.",
    requirement: "Server boost required",
    image: "/images/badges/server-booster.png",
  },
];

const dominantColorCache = new Map<string, string>();

function normalizeBadgeName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDominantColor(src: string): Promise<string> {
  const cached = dominantColorCache.get(src);

  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("#5360ff");
      return;
    }

    const image = new window.Image();

    image.decoding = "async";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 40;

        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (!context) {
          resolve("#5360ff");
          return;
        }

        context.clearRect(0, 0, size, size);
        context.drawImage(image, 0, 0, size, size);

        const pixels = context.getImageData(0, 0, size, size).data;

        const buckets = new Map<
          string,
          {
            count: number;
            red: number;
            green: number;
            blue: number;
          }
        >();

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];

          if (alpha < 70) {
            continue;
          }

          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const saturation = max - min;

          if (max < 18) {
            continue;
          }

          const quantizedRed = Math.min(255, Math.round(red / 24) * 24);
          const quantizedGreen = Math.min(255, Math.round(green / 24) * 24);
          const quantizedBlue = Math.min(255, Math.round(blue / 24) * 24);

          const key = `${quantizedRed}-${quantizedGreen}-${quantizedBlue}`;

          const current = buckets.get(key) ?? {
            count: 0,
            red: 0,
            green: 0,
            blue: 0,
          };

          const weight =
            1 +
            alpha / 255 +
            Math.min(saturation / 255, 1) * 0.35;

          current.count += weight;
          current.red += red * weight;
          current.green += green * weight;
          current.blue += blue * weight;

          buckets.set(key, current);
        }

        let selected:
          | {
              count: number;
              red: number;
              green: number;
              blue: number;
            }
          | undefined;

        for (const bucket of buckets.values()) {
          if (!selected || bucket.count > selected.count) {
            selected = bucket;
          }
        }

        if (!selected || selected.count <= 0) {
          dominantColorCache.set(src, "#5360ff");
          resolve("#5360ff");
          return;
        }

        const red = Math.round(selected.red / selected.count);
        const green = Math.round(selected.green / selected.count);
        const blue = Math.round(selected.blue / selected.count);

        const color = `rgb(${red}, ${green}, ${blue})`;

        dominantColorCache.set(src, color);
        resolve(color);
      } catch {
        resolve("#5360ff");
      }
    };

    image.onerror = () => {
      resolve("#5360ff");
    };

    image.src = src;
  });
}

export default function BadgesCard() {
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [loadingBadges, setLoadingBadges] = React.useState(true);
  const [assignedBadges, setAssignedBadges] = React.useState<AssignedBadge[]>(
    []
  );
  const [monochrome, setMonochrome] = React.useState(false);
  const [showPill, setShowPill] = React.useState(false);
  const [softGlow, setSoftGlow] = React.useState(true);
  const [marquee, setMarquee] = React.useState(false);
  const [badgeColor, setBadgeColor] = React.useState("#ffffff");
  const [enabledBadges, setEnabledBadges] = React.useState<string[]>([]);
  const [visibleBadgeCount, setVisibleBadgeCount] = React.useState(0);
  const [loopPhase, setLoopPhase] = React.useState<"removing" | "adding">(
    "removing"
  );

  React.useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!mounted) {
          return;
        }

        if (data?.user) {
          setUser(data.user);
        }
      } catch {
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    }

    async function loadBadges() {
      try {
        const response = await fetch("/api/badges", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as BadgesResponse;

        if (!mounted) {
          return;
        }

        setAssignedBadges(Array.isArray(data.badges) ? data.badges : []);
      } catch {
      } finally {
        if (mounted) {
          setLoadingBadges(false);
        }
      }
    }

    loadUser();
    loadBadges();

    return () => {
      mounted = false;
    };
  }, []);

  const ownedBadges = React.useMemo(() => {
    return new Set(
      assignedBadges.map((badge) => normalizeBadgeName(badge.badgeName))
    );
  }, [assignedBadges]);

  React.useEffect(() => {
    setEnabledBadges((current) =>
      current.filter((badge) => ownedBadges.has(badge))
    );
  }, [ownedBadges]);

  function toggleBadge(id: string) {
    if (!ownedBadges.has(id)) {
      return;
    }

    setEnabledBadges((current) =>
      current.includes(id)
        ? current.filter((badge) => badge !== id)
        : [...current, id]
    );
  }

  const previewBadges = badges.filter((badge) =>
    enabledBadges.includes(badge.id)
  );

  React.useEffect(() => {
    setVisibleBadgeCount(previewBadges.length);
    setLoopPhase("removing");
  }, [previewBadges.length, marquee]);

  React.useEffect(() => {
    if (!marquee || previewBadges.length === 0) {
      setVisibleBadgeCount(previewBadges.length);
      return;
    }

    const total = previewBadges.length;
    const atFull = visibleBadgeCount >= total;
    const atEmpty = visibleBadgeCount <= 0;

    const delay = atFull || atEmpty ? 1000 : 420;

    const timeout = window.setTimeout(() => {
      if (loopPhase === "removing") {
        if (atEmpty) {
          setLoopPhase("adding");
          setVisibleBadgeCount(1);
          return;
        }

        setVisibleBadgeCount((current) => Math.max(0, current - 1));
        return;
      }

      if (atFull) {
        setLoopPhase("removing");
        setVisibleBadgeCount(Math.max(0, total - 1));
        return;
      }

      setVisibleBadgeCount((current) => Math.min(total, current + 1));
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    marquee,
    loopPhase,
    previewBadges.length,
    visibleBadgeCount,
  ]);

  const displayedPreviewBadges = marquee
    ? previewBadges.slice(0, visibleBadgeCount)
    : previewBadges;

  const loading = loadingUser || loadingBadges;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <span className="text-white/30">Dashboard</span>
          <span className="text-white/20">›</span>
          <span className="text-white/30">Account</span>
          <span className="text-white/20">›</span>
          <span className="text-white/80">Badges</span>
        </div>

        <Link
          href={user?.username ? `/${user.username}` : "/"}
          target="_blank"
          className="flex h-9 items-center gap-2 rounded-full border border-white/[0.075] bg-white/[0.025] px-4 text-[11px] font-semibold text-white/55 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
        >
          <HugeiconsIcon
            icon={Globe02Icon}
            size={14}
            color="currentColor"
            strokeWidth={1.7}
          />

          Live preview
        </Link>
      </div>

      <div className="mt-6">
        <h1 className="text-[22px] font-semibold tracking-[-0.7px] text-white">
          Badges
        </h1>

        <p className="mt-1 text-[12px] text-white/35">
          Customize how your badges appear on your profile.
        </p>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div />
        </div>

        <div className="mt-4 rounded-[20px] border border-white/[0.065] bg-[#0c0c0c] p-5">
          <div className="grid gap-4 xl:grid-cols-2">
            <SettingBlock label="Monochrome badges">
              <SettingRow
                title="Tint all badges"
                description="Use one color across every enabled badge."
                enabled={monochrome}
                onChange={() => setMonochrome((current) => !current)}
              />
            </SettingBlock>

            <SettingBlock label="Badge color">
              <div className="flex h-[52px] items-center gap-3 rounded-[14px] border border-white/[0.055] bg-black/15 px-4">
                <label
                  className="relative h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded-full border border-white/[0.12]"
                  style={{
                    backgroundColor: badgeColor,
                  }}
                >
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(event) => setBadgeColor(event.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>

                <input
                  value={badgeColor}
                  onChange={(event) => setBadgeColor(event.target.value)}
                  maxLength={7}
                  className="min-w-0 flex-1 bg-transparent text-[11px] font-semibold text-white/70 outline-none"
                />

                <span className="text-[9px] font-medium text-white/20">
                  HEX
                </span>
              </div>
            </SettingBlock>

            <SettingBlock label="Badge container">
              <SettingRow
                title="Show in pill"
                description="Display enabled badges inside a profile pill."
                enabled={showPill}
                onChange={() => setShowPill((current) => !current)}
              />
            </SettingBlock>

            <SettingBlock label="Badge movement">
              <SettingRow
                title="Loop all badges"
                description="Cycle enabled badges one at a time like a typewriter."
                enabled={marquee}
                onChange={() => setMarquee((current) => !current)}
              />
            </SettingBlock>

            <SettingBlock label="Badge glow">
              <SettingRow
                title="Soft glow"
                description="Add a color-matched glow directly behind each badge."
                enabled={softGlow}
                onChange={() => setSoftGlow((current) => !current)}
              />
            </SettingBlock>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-white">
              Preview
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              See how your enabled badges will look on your profile.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-white/[0.065] bg-[#0c0c0c]">
          <div className="flex min-h-[150px] items-center justify-center overflow-hidden px-6 py-6">
            {previewBadges.length === 0 ? (
              <div className="text-center">
                <p className="text-[11px] font-medium text-white/30">
                  No badges enabled
                </p>

                <p className="mt-1 text-[9px] text-white/20">
                  Turn on an unlocked badge below to preview it here.
                </p>
              </div>
            ) : (
              <div className="flex min-h-10 max-w-full items-center gap-2.5">
                <AnimatePresence initial={false} mode="popLayout">
                  {displayedPreviewBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      layout
                      initial={{
                        opacity: 0,
                        scale: 0.78,
                        x: -5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.78,
                        x: 5,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="shrink-0"
                    >
                      <ProfileBadge
                        badge={badge}
                        monochrome={monochrome}
                        color={badgeColor}
                        pill={showPill}
                        glow={softGlow}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {marquee && (
                  <motion.span
                    animate={{
                      opacity: [1, 1, 0, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      times: [0, 0.45, 0.5, 1],
                    }}
                    className="h-6 w-[2px] shrink-0 rounded-full bg-white/45"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-white">
              All badges
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              Badges are unlocked through account status and community roles.
            </p>
          </div>

          {!loading && (
            <span className="text-[10px] font-medium text-white/25">
              {ownedBadges.size} unlocked
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {badges.map((badge, index) => {
            const owned = ownedBadges.has(badge.id);
            const enabled = enabledBadges.includes(badge.id);

            return (
              <motion.button
                key={badge.id}
                type="button"
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.025, 0.15),
                }}
                onClick={() => toggleBadge(badge.id)}
                disabled={!owned}
                className={`group relative flex min-h-[82px] w-full items-center rounded-[18px] border px-5 text-left transition-all duration-200 ${
                  owned
                    ? enabled
                      ? "border-[#5360ff]/25 bg-[#5360ff]/[0.055] hover:bg-[#5360ff]/[0.075]"
                      : "border-white/[0.065] bg-[#0c0c0c] hover:border-white/[0.11] hover:bg-white/[0.02]"
                    : "cursor-default border-white/[0.05] bg-[#0a0a0a]"
                }`}
              >
                <div
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${
                    owned ? "" : "opacity-30 grayscale"
                  }`}
                >
                  <Image
                    src={badge.image}
                    alt={badge.name}
                    width={32}
                    height={32}
                    className="max-h-[30px] max-w-[30px] object-contain"
                  />
                </div>

                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate text-[11px] font-semibold ${
                        owned ? "text-white/85" : "text-white/35"
                      }`}
                    >
                      {badge.name}
                    </p>

                    {owned && enabled && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5360ff]" />
                    )}
                  </div>

                  <p
                    className={`mt-1 truncate text-[9px] ${
                      owned ? "text-white/25" : "text-white/15"
                    }`}
                  >
                    {badge.description}
                  </p>

                  {!owned && (
                    <p className="mt-1 text-[8px] font-medium text-white/15">
                      {badge.requirement}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex shrink-0 items-center justify-center">
                  {owned ? (
                    <Toggle enabled={enabled} />
                  ) : (
                    <LockedIcon />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function SettingBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[9px] font-semibold text-white/30">
        {label}
      </p>
      {children}
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex min-h-[52px] w-full items-center gap-4 rounded-[14px] border border-white/[0.055] bg-black/15 px-4 text-left transition-colors hover:bg-white/[0.02]"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-white/70">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[8px] text-white/20">
          {description}
        </p>
      </div>

      <Toggle enabled={enabled} />
    </button>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative block h-[22px] w-[38px] shrink-0 overflow-hidden rounded-full border transition-all duration-200 ${
        enabled
          ? "border-[#5360ff]/50 bg-[#2832F9]"
          : "border-white/[0.08] bg-[#1a1a1a]"
      }`}
    >
      <span
        className={`absolute left-[3px] top-[3px] block h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out ${
          enabled ? "translate-x-[16px]" : "translate-x-0"
        }`}
      />
    </span>
  );
}

function LockedIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.055] bg-white/[0.02]">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white/20"
      >
        <path
          d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M6 10H18C19.1046 10 20 10.8954 20 12V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V12C4 10.8954 4.89543 10 6 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

function ProfileBadge({
  badge,
  monochrome,
  color,
  pill,
  glow,
}: {
  badge: Badge;
  monochrome: boolean;
  color: string;
  pill: boolean;
  glow: boolean;
}) {
  const [dominantColor, setDominantColor] =
    React.useState("#5360ff");

  React.useEffect(() => {
    let active = true;

    getDominantColor(badge.image).then((detectedColor) => {
      if (active) {
        setDominantColor(detectedColor);
      }
    });

    return () => {
      active = false;
    };
  }, [badge.image]);

  const glowColor = monochrome ? color : dominantColor;

  return (
    <div
      className={`relative flex shrink-0 items-center gap-2 ${
        pill
          ? "rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-2"
          : ""
      }`}
    >
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        {glow && (
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[9px]"
            style={{
              backgroundColor: glowColor,
            }}
          />
        )}

        {glow && (
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[5px]"
            style={{
              backgroundColor: glowColor,
            }}
          />
        )}

        {monochrome ? (
          <span
            className="absolute inset-0 z-10"
            style={{
              backgroundColor: color,
              WebkitMaskImage: `url(${badge.image})`,
              maskImage: `url(${badge.image})`,
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        ) : (
          <Image
            src={badge.image}
            alt={badge.name}
            width={24}
            height={24}
            className="relative z-10 h-6 w-6 object-contain"
          />
        )}
      </span>

      {pill && (
        <span className="relative z-10 text-[9px] font-semibold text-white/70">
          {badge.name}
        </span>
      )}
    </div>
  );
}