"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CursorPointer02Icon,
  Diamond02Icon,
  EyeIcon,
  Globe02Icon,
  HashtagIcon,
  SmartPhone01Icon,
  Tablet01Icon,
  Time02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import Dither from "@/components/Dither/Dither";
import ProfileViewsChart from "@/components/dashboard/charts/profile-views-chart";

type AnalyticsRange = 1 | 7 | 30 | 90;

type CurrentUser = {
  id: string;
  username: string;
  displayName?: string;
  globalName?: string;
  plan?: string;
};

type AnalyticsPoint = {
  date: string;
  views: number;
};

type CountryPoint = {
  code: string;
  count: number;
};

type AnalyticsData = {
  profileViews: number;
  uniqueVisitors: number;
  linkClicks: number;
  averageVisitSeconds: number;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
    unknown: number;
  };
  timeline: AnalyticsPoint[];
  countries: CountryPoint[];
};

type AnalyticsResponse = {
  analytics?: Partial<AnalyticsData>;
};

const ranges: AnalyticsRange[] = [1, 7, 30, 90];

const emptyAnalytics: AnalyticsData = {
  profileViews: 0,
  uniqueVisitors: 0,
  linkClicks: 0,
  averageVisitSeconds: 0,
  devices: {
    desktop: 0,
    mobile: 0,
    tablet: 0,
    unknown: 0,
  },
  timeline: [],
  countries: [],
};

export default function OverviewCard() {
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [analytics, setAnalytics] =
    React.useState<AnalyticsData>(emptyAnalytics);
  const [range, setRange] = React.useState<AnalyticsRange>(7);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState(true);

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

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!user?.username) {
      return;
    }

    let mounted = true;

    async function loadAnalytics() {
      setLoadingAnalytics(true);

      try {
        const response = await fetch(
          `/api/analytics/view?username=${encodeURIComponent(
            user!.username
          )}&days=${range}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as AnalyticsResponse;

        if (!mounted) {
          return;
        }

        const incoming = data.analytics ?? {};

        setAnalytics({
          profileViews: Number(incoming.profileViews ?? 0),
          uniqueVisitors: Number(incoming.uniqueVisitors ?? 0),
          linkClicks: Number(incoming.linkClicks ?? 0),
          averageVisitSeconds: Number(
            incoming.averageVisitSeconds ?? 0
          ),
          devices: {
            desktop: Number(incoming.devices?.desktop ?? 0),
            mobile: Number(incoming.devices?.mobile ?? 0),
            tablet: Number(incoming.devices?.tablet ?? 0),
            unknown: Number(incoming.devices?.unknown ?? 0),
          },
          timeline: Array.isArray(incoming.timeline)
            ? incoming.timeline.map((point) => ({
                date: point.date,
                views: Number(point.views ?? 0),
              }))
            : [],
          countries: Array.isArray(incoming.countries)
            ? incoming.countries.map((country) => ({
                code: country.code,
                count: Number(country.count ?? 0),
              }))
            : [],
        });
      } catch {
      } finally {
        if (mounted) {
          setLoadingAnalytics(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, [user?.username, range]);

  const plan = user?.plan?.toLowerCase() || "free";
  const isFree = plan === "free";

  const displayName =
    user?.displayName ||
    user?.globalName ||
    user?.username ||
    "User";

  const periodLabel =
    range === 1 ? "Today" : `Last ${range} days`;

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
          <span className="text-white/80">Account</span>
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
          Overview
        </h1>

        <p className="mt-1 text-[12px] text-white/35">
          Your account identity and profile traffic.
        </p>
      </div>

      {isFree && !loadingUser && (
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
            delay: 0.05,
            duration: 0.35,
          }}
          className="relative mt-8 min-h-[92px] overflow-hidden rounded-[20px] border border-white/[0.075] bg-[#0b0b0b]"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[68%] overflow-hidden">
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

            <div className="absolute inset-y-0 left-0 w-[48%] bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/95 to-transparent" />
          </div>

          <div className="relative z-10 flex min-h-[92px] flex-col justify-between gap-5 px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={Diamond02Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.8}
                  className="text-[#5360ff]"
                />

                <h2 className="text-[15px] font-semibold tracking-[-0.3px] text-white">
                  Purchase Premium
                </h2>
              </div>

              <p className="mt-2 text-[11px] text-white/40">
                Unlock premium customization and more ways to make your
                profile yours.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/store"
                className="flex h-9 items-center justify-center rounded-full border border-white/[0.12] bg-black/15 px-4 text-[11px] font-semibold text-white/75 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white"
              >
                Learn more
              </Link>

              <Link
                href="/store"
                className="flex h-9 items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.08] px-4 text-[11px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/[0.13]"
              >
                Upgrade

                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={13}
                  color="currentColor"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Profile Views"
          icon={EyeIcon}
          value={analytics.profileViews}
          detail={periodLabel}
          loading={loadingAnalytics}
        />

        <MetricCard
          label="Link Clicks"
          icon={CursorPointer02Icon}
          value={analytics.linkClicks}
          detail={periodLabel}
          loading={loadingAnalytics}
        />

        <MetricCard
          label="Unique Visitors"
          icon={Globe02Icon}
          value={analytics.uniqueVisitors}
          detail={periodLabel}
          loading={loadingAnalytics}
        />

        <MetricCard
          label="Avg Visit"
          icon={Time02Icon}
          value={
            analytics.averageVisitSeconds > 0
              ? `${analytics.averageVisitSeconds}s`
              : "0"
          }
          detail={periodLabel}
          loading={loadingAnalytics}
          raw
        />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <IdentityCard
          icon={UserIcon}
          label="Username"
          value={user?.username ? `@${user.username}` : "—"}
          loading={loadingUser}
        />

        <IdentityCard
          icon={Globe02Icon}
          label="Display name"
          value={displayName}
          loading={loadingUser}
        />

        <IdentityCard
          icon={HashtagIcon}
          label="UID"
          value={user?.id || "—"}
          loading={loadingUser}
        />
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-white">
              Account analytics
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              Traffic, devices, and visitor locations.
            </p>
          </div>

          <AnalyticsRangePicker
            range={range}
            onChange={setRange}
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <DeviceAnalytics
            analytics={analytics}
            loading={loadingAnalytics}
            range={range}
          />

          <ProfileViewsChart
            points={analytics.timeline}
            loading={loadingAnalytics}
            range={range}
          />
        </div>

        <div className="mt-4">
          <CountryAnalytics
            countries={analytics.countries}
            loading={loadingAnalytics}
            range={range}
          />
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsRangePicker({
  range,
  onChange,
}: {
  range: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
}) {
  return (
    <div className="flex w-fit items-center rounded-[11px] border border-white/[0.07] bg-[#0c0c0c] p-1">
      {ranges.map((value) => {
        const active = range === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`relative flex h-7 min-w-[42px] items-center justify-center rounded-[8px] px-2 text-[10px] font-semibold transition-colors duration-150 ${
              active
                ? "text-white"
                : "text-white/30 hover:text-white/65"
            }`}
          >
            {active && (
              <motion.span
                layoutId="analytics-range"
                transition={{
                  type: "spring",
                  stiffness: 430,
                  damping: 34,
                }}
                className="absolute inset-0 rounded-[8px] border border-white/[0.07] bg-white/[0.065]"
              />
            )}

            <span className="relative z-10">
              {value}D
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({
  label,
  icon,
  value,
  detail,
  loading,
  raw = false,
}: {
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  value: number | string;
  detail: string;
  loading: boolean;
  raw?: boolean;
}) {
  return (
    <div className="min-h-[104px] rounded-[18px] border border-white/[0.065] bg-[#0c0c0c] px-5 py-4">
      <div className="flex items-center gap-2 text-[10px] font-medium text-white/30">
        <HugeiconsIcon
          icon={icon}
          size={13}
          color="currentColor"
          strokeWidth={1.8}
          className="text-white/45"
        />

        {label}
      </div>

      {loading ? (
        <div className="mt-4 h-5 w-14 animate-pulse rounded bg-white/[0.06]" />
      ) : (
        <p className="mt-3 text-[22px] font-semibold leading-none tracking-[-0.7px] text-white">
          {raw ? value : formatNumber(Number(value))}
        </p>
      )}

      <p className="mt-2 text-[9px] text-white/25">
        {loading ? " " : detail}
      </p>
    </div>
  );
}

function IdentityCard({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  loading: boolean;
}) {
  return (
    <div className="min-h-[82px] rounded-[18px] border border-white/[0.065] bg-[#0c0c0c] px-5 py-4">
      <div className="flex items-center gap-2 text-[10px] font-medium text-white/30">
        <HugeiconsIcon
          icon={icon}
          size={13}
          color="currentColor"
          strokeWidth={1.8}
          className="text-white/45"
        />

        {label}
      </div>

      {loading ? (
        <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
      ) : (
        <p className="mt-3 truncate text-[13px] font-semibold text-white/90">
          {value}
        </p>
      )}
    </div>
  );
}

function DeviceAnalytics({
  analytics,
  loading,
  range,
}: {
  analytics: AnalyticsData;
  loading: boolean;
  range: AnalyticsRange;
}) {
  const desktop = analytics.devices.desktop;
  const mobile = analytics.devices.mobile;
  const tablet = analytics.devices.tablet;
  const unknown = analytics.devices.unknown;

  const total = desktop + mobile + tablet + unknown;

  const desktopPercent = percentage(desktop, total);
  const mobilePercent = percentage(mobile, total);
  const tabletPercent = percentage(tablet, total);
  const unknownPercent = percentage(unknown, total);

  return (
    <div className="min-h-[270px] rounded-[20px] border border-white/[0.065] bg-[#0c0c0c] p-5">
      <p className="text-[11px] font-semibold text-white/80">
        Visitor Devices in the last{" "}
        <span className="text-[#5360ff]">
          {range} {range === 1 ? "day" : "days"}
        </span>
      </p>

      <div className="mt-7 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex h-[138px] w-[138px] shrink-0 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                total === 0
                  ? "conic-gradient(rgba(255,255,255,0.06) 0deg 360deg)"
                  : createDeviceGradient({
                      desktopPercent,
                      mobilePercent,
                      tabletPercent,
                      unknownPercent,
                    }),
            }}
          />

          <div className="absolute inset-[17px] rounded-full bg-[#0c0c0c]" />

          <div className="relative text-center">
            <p className="text-[22px] font-semibold tracking-[-0.7px] text-white">
              {loading ? "—" : formatNumber(total)}
            </p>

            <p className="mt-1 text-[9px] text-white/25">
              visitors
            </p>
          </div>
        </div>

        <div className="w-full max-w-[290px] space-y-4">
          <DeviceRow
            label="Desktop"
            icon={Globe02Icon}
            count={desktop}
            percent={desktopPercent}
          />

          <DeviceRow
            label="Mobile"
            icon={SmartPhone01Icon}
            count={mobile}
            percent={mobilePercent}
          />

          <DeviceRow
            label="Tablet"
            icon={Tablet01Icon}
            count={tablet}
            percent={tabletPercent}
          />

          {unknown > 0 && (
            <DeviceRow
              label="Unknown"
              icon={Globe02Icon}
              count={unknown}
              percent={unknownPercent}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DeviceRow({
  label,
  count,
  percent,
  icon,
}: {
  label: string;
  count: number;
  percent: number;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={12}
            color="currentColor"
            strokeWidth={1.7}
            className="text-white/30"
          />

          <span className="text-[10px] font-medium text-white/70">
            {label}
          </span>
        </div>

        <span className="text-[10px] text-white/35">
          {percent}%{" "}
          <span className="text-white/20">
            ({formatNumber(count)})
          </span>
        </span>
      </div>

      <div className="h-[6px] overflow-hidden rounded-full bg-white/[0.055]">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percent}%`,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-[#2832F9]"
        />
      </div>
    </div>
  );
}

function CountryAnalytics({
  countries,
  loading,
  range,
}: {
  countries: CountryPoint[];
  loading: boolean;
  range: AnalyticsRange;
}) {
  const total = countries.reduce(
    (sum, country) => sum + country.count,
    0
  );

  const displayedCountries = countries.slice(0, 8);

  return (
    <div className="rounded-[20px] border border-white/[0.065] bg-[#0c0c0c] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Globe02Icon}
              size={14}
              color="currentColor"
              strokeWidth={1.8}
              className="text-white/40"
            />

            <p className="text-[11px] font-semibold text-white/80">
              Visitor Countries
            </p>
          </div>

          <p className="mt-1 text-[9px] text-white/25">
            Top locations from the last{" "}
            {range} {range === 1 ? "day" : "days"}.
          </p>
        </div>

        {!loading && (
          <span className="text-[10px] font-medium text-white/25">
            {formatNumber(total)} visitors
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[54px] animate-pulse rounded-[12px] bg-white/[0.025]"
            />
          ))}
        </div>
      ) : displayedCountries.length === 0 ? (
        <div className="mt-6 flex min-h-[120px] items-center justify-center rounded-[14px] border border-dashed border-white/[0.06] bg-black/10">
          <div className="text-center">
            <HugeiconsIcon
              icon={Globe02Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.6}
              className="mx-auto text-white/15"
            />

            <p className="mt-2 text-[10px] text-white/25">
              No country data for this period.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {displayedCountries.map((country, index) => {
            const percent = percentage(country.count, total);

            return (
              <motion.div
                key={`${country.code}-${index}`}
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
                  delay: index * 0.025,
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 min-w-8 items-center justify-center rounded-[7px] border border-white/[0.06] bg-white/[0.025] px-1.5 text-[8px] font-semibold tracking-[0.04em] text-white/35">
                      {country.code}
                    </span>

                    <span className="truncate text-[10px] font-medium text-white/65">
                      {getCountryName(country.code)}
                    </span>
                  </div>

                  <span className="shrink-0 text-[9px] text-white/30">
                    {percent}%{" "}
                    <span className="text-white/15">
                      ({formatNumber(country.count)})
                    </span>
                  </span>
                </div>

                <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.045]">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${percent}%`,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.025,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-[#2832F9]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function percentage(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getCountryName(code: string) {
  if (!code || code === "UNKNOWN") {
    return "Unknown";
  }

  if (code === "LOCAL") {
    return "Local development";
  }

  try {
    const names = new Intl.DisplayNames(["en"], {
      type: "region",
    });

    return names.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function createDeviceGradient({
  desktopPercent,
  mobilePercent,
  tabletPercent,
  unknownPercent,
}: {
  desktopPercent: number;
  mobilePercent: number;
  tabletPercent: number;
  unknownPercent: number;
}) {
  const desktopEnd = desktopPercent * 3.6;
  const mobileEnd =
    (desktopPercent + mobilePercent) * 3.6;
  const tabletEnd =
    (desktopPercent + mobilePercent + tabletPercent) *
    3.6;
  const unknownEnd =
    (desktopPercent +
      mobilePercent +
      tabletPercent +
      unknownPercent) *
    3.6;

  return `conic-gradient(
    #2832F9 0deg ${desktopEnd}deg,
    rgba(40,50,249,0.72) ${desktopEnd}deg ${mobileEnd}deg,
    rgba(40,50,249,0.42) ${mobileEnd}deg ${tabletEnd}deg,
    rgba(255,255,255,0.14) ${tabletEnd}deg ${unknownEnd}deg
  )`;
}