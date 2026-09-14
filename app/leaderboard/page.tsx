"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  EyeIcon,
  FavouriteIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import Header from "@/components/header";
import Footer from "@/components/footer";

type LeaderboardSort = "views" | "likes" | "followers";

type LeaderboardRange = "all" | "30" | "7" | "1";

type LeaderboardUser = {
  id: string;
  username: string;
  displayName?: string | null;
  globalName?: string | null;
  avatar?: string | null;
  views: number;
  likes: number;
  followers: number;
  plan?: string | null;
};

type LeaderboardResponse = {
  users?: LeaderboardUser[];
};

const ITEMS_PER_PAGE = 10;

const sortOptions: {
  id: LeaderboardSort;
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
}[] = [
  {
    id: "views",
    label: "Views",
    icon: EyeIcon,
  },
  {
    id: "likes",
    label: "Likes",
    icon: FavouriteIcon,
  },
  {
    id: "followers",
    label: "Followers",
    icon: UserGroupIcon,
  },
];

const rangeOptions: {
  id: LeaderboardRange;
  label: string;
}[] = [
  {
    id: "all",
    label: "All time",
  },
  {
    id: "30",
    label: "Last 30 days",
  },
  {
    id: "7",
    label: "Last 7 days",
  },
  {
    id: "1",
    label: "Today",
  },
];

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [sort, setSort] = useState<LeaderboardSort>("views");
  const [range, setRange] = useState<LeaderboardRange>("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [sortOpen, setSortOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const rangeDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setSortOpen(false);
      }

      if (
        rangeDropdownRef.current &&
        !rangeDropdownRef.current.contains(target)
      ) {
        setRangeOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSortOpen(false);
        setRangeOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadLeaderboard() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/leaderboard?sort=${encodeURIComponent(
            sort
          )}&range=${encodeURIComponent(range)}&limit=all`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (mounted) {
            setUsers([]);
          }

          return;
        }

        const data = (await response.json()) as LeaderboardResponse;

        if (!mounted) {
          return;
        }

        setUsers(
          Array.isArray(data.users)
            ? data.users.map((user) => ({
                ...user,
                views: Number(user.views ?? 0),
                likes: Number(user.likes ?? 0),
                followers: Number(user.followers ?? 0),
              }))
            : []
        );
      } catch {
        if (mounted) {
          setUsers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      mounted = false;
    };
  }, [sort, range]);

  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [sort, range]);

  const rankedUsers = useMemo(() => {
    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }, [users]);

  const totalPages = Math.max(
    1,
    Math.ceil(rankedUsers.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [page, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return rankedUsers.slice(start, end);
  }, [rankedUsers, page]);

  const selectedSort =
    sortOptions.find((option) => option.id === sort) ??
    sortOptions[0];

  const selectedRange =
    rangeOptions.find((option) => option.id === range) ??
    rangeOptions[0];

  const startEntry =
    rankedUsers.length === 0
      ? 0
      : (page - 1) * ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(
    page * ITEMS_PER_PAGE,
    rankedUsers.length
  );

  function goToPage(nextPage: number) {
    const safePage = Math.max(
      1,
      Math.min(totalPages, nextPage)
    );

    setPage(safePage);
    setPageInput(String(safePage));
  }

  function submitPage() {
    const parsed = Number.parseInt(pageInput, 10);

    if (!Number.isFinite(parsed)) {
      setPageInput(String(page));
      return;
    }

    goToPage(parsed);
  }

  return (
    <main className="min-h-screen bg-[#060608] text-white">
      <Header />

      <section className="mx-auto w-full max-w-[1180px] px-6 pb-28 pt-20">
        <div className="text-center">
          <h1 className="text-[42px] font-semibold leading-none tracking-[-2px] text-white sm:text-[48px]">
            Leaderboard
          </h1>

          <p className="mt-5 text-[14px] font-medium text-white/35">
            Discover the most popular profiles across carts.lol.
          </p>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-center gap-3">
            <div
              ref={sortDropdownRef}
              className="relative z-20"
            >
              <button
                type="button"
                onClick={() => {
                  setSortOpen((current) => !current);
                  setRangeOpen(false);
                }}
                className={`flex h-[42px] min-w-[190px] items-center justify-between rounded-[12px] border px-4 text-[12px] font-medium transition ${
                  sortOpen
                    ? "border-white/[0.14] bg-[#0d0d10] text-white"
                    : "border-white/[0.09] bg-[#0a0a0d] text-white/70 hover:border-white/[0.14] hover:bg-white/[0.025]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={selectedSort.icon}
                    size={15}
                    strokeWidth={1.7}
                    className="text-white/45"
                  />

                  {selectedSort.label}
                </span>

                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  strokeWidth={1.8}
                  className={`text-white/30 transition-transform duration-200 ${
                    sortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortOpen && (
                <div className="absolute left-0 top-[48px] w-full overflow-hidden rounded-[12px] border border-white/[0.1] bg-[#0d0d10] p-1.5 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
                  {sortOptions.map((option) => {
                    const active = option.id === sort;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSort(option.id);
                          setSortOpen(false);
                        }}
                        className={`flex h-10 w-full items-center gap-2.5 rounded-[8px] px-3 text-left text-[11px] font-medium transition ${
                          active
                            ? "bg-white/[0.07] text-white"
                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={option.icon}
                          size={14}
                          strokeWidth={1.7}
                          className={
                            active
                              ? "text-white/65"
                              : "text-white/30"
                          }
                        />

                        <span className="flex-1">
                          {option.label}
                        </span>

                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2832F9]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              ref={rangeDropdownRef}
              className="relative z-20"
            >
              <button
                type="button"
                onClick={() => {
                  setRangeOpen((current) => !current);
                  setSortOpen(false);
                }}
                className={`flex h-[42px] min-w-[190px] items-center justify-between rounded-[12px] border px-4 text-[12px] font-medium transition ${
                  rangeOpen
                    ? "border-white/[0.14] bg-[#0d0d10] text-white"
                    : "border-white/[0.09] bg-[#0a0a0d] text-white/70 hover:border-white/[0.14] hover:bg-white/[0.025]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={15}
                    strokeWidth={1.7}
                    className="text-white/45"
                  />

                  {selectedRange.label}
                </span>

                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  strokeWidth={1.8}
                  className={`text-white/30 transition-transform duration-200 ${
                    rangeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {rangeOpen && (
                <div className="absolute left-0 top-[48px] w-full overflow-hidden rounded-[12px] border border-white/[0.1] bg-[#0d0d10] p-1.5 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
                  {rangeOptions.map((option) => {
                    const active = option.id === range;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setRange(option.id);
                          setRangeOpen(false);
                        }}
                        className={`flex h-10 w-full items-center gap-2.5 rounded-[8px] px-3 text-left text-[11px] font-medium transition ${
                          active
                            ? "bg-white/[0.07] text-white"
                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          size={14}
                          strokeWidth={1.7}
                          className={
                            active
                              ? "text-white/65"
                              : "text-white/30"
                          }
                        />

                        <span className="flex-1">
                          {option.label}
                        </span>

                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2832F9]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-visible rounded-[20px] border border-white/[0.09] bg-[#0a0a0d]">
            <div className="grid h-[48px] grid-cols-[58px_minmax(0,1fr)_120px] items-center border-b border-white/[0.065] px-4 sm:grid-cols-[72px_minmax(0,1fr)_150px] sm:px-5">
              <span className="text-[10px] font-medium text-white/35">
                Rank
              </span>

              <span className="text-[10px] font-medium text-white/35">
                User
              </span>

              <span className="text-right text-[10px] font-medium text-white/35">
                Score
              </span>
            </div>

            {loading ? (
              <div>
                {Array.from({
                  length: ITEMS_PER_PAGE,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="grid min-h-[68px] grid-cols-[58px_minmax(0,1fr)_120px] items-center border-b border-white/[0.05] px-4 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_150px] sm:px-5"
                  >
                    <div className="h-3 w-6 animate-pulse rounded bg-white/[0.04]" />

                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.045]" />

                      <div>
                        <div className="h-3 w-24 animate-pulse rounded bg-white/[0.045]" />
                        <div className="mt-2 h-2 w-16 animate-pulse rounded bg-white/[0.03]" />
                      </div>
                    </div>

                    <div className="ml-auto h-3 w-12 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <LeaderboardRow
                  key={user.id}
                  user={user}
                  rank={user.rank}
                  sort={sort}
                />
              ))
            ) : (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[12px] border border-white/[0.07] bg-white/[0.02]">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={18}
                      strokeWidth={1.7}
                      className="text-white/20"
                    />
                  </div>

                  <p className="mt-4 text-[12px] font-semibold text-white/45">
                    No users found
                  </p>

                  <p className="mt-1 text-[10px] text-white/20">
                    Leaderboard users will appear here.
                  </p>
                </div>
              </div>
            )}

            <div className="flex min-h-[62px] flex-col gap-4 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-[10px] text-white/30">
                Showing {formatNumber(startEntry)}–
                {formatNumber(endEntry)} of{" "}
                {formatNumber(rankedUsers.length)} entries
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex h-9 items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.015] px-3 text-[11px] font-medium text-white/45 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={13}
                    strokeWidth={1.8}
                  />

                  Previous
                </button>

                <div className="flex h-9 items-center rounded-[10px] border border-white/[0.07] bg-white/[0.02]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={pageInput}
                    onChange={(event) => {
                      const value = event.target.value.replace(
                        /\D/g,
                        ""
                      );

                      setPageInput(value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        submitPage();
                        event.currentTarget.blur();
                      }
                    }}
                    onBlur={submitPage}
                    aria-label="Page number"
                    className="h-full w-[48px] bg-transparent px-2 text-center text-[11px] font-semibold text-white outline-none"
                  />

                  <span className="border-l border-white/[0.06] px-3 text-[10px] text-white/25">
                    / {formatNumber(totalPages)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex h-9 items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.015] px-3 text-[11px] font-medium text-white/70 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next

                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={13}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function LeaderboardRow({
  user,
  rank,
  sort,
}: {
  user: LeaderboardUser;
  rank: number;
  sort: LeaderboardSort;
}) {
  const displayName =
    user.displayName ||
    user.globalName ||
    user.username;

  const score =
    sort === "views"
      ? user.views
      : sort === "likes"
        ? user.likes
        : user.followers;

  return (
    <div className="grid min-h-[68px] grid-cols-[58px_minmax(0,1fr)_120px] items-center border-b border-white/[0.05] px-4 transition hover:bg-white/[0.012] last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_150px] sm:px-5">
      <span className="text-[11px] font-semibold text-white/75">
        #{rank}
      </span>

      <Link
        href={`/${user.username}`}
        className="group flex min-w-0 items-center gap-3"
      >
        <ProfileAvatar user={user} />

                <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-[12px] font-semibold text-white/85 transition group-hover:text-white">
                    {displayName}
                    </p>

                    {user.plan?.toLowerCase() === "premium" && (
                    <span className="hidden shrink-0 items-center gap-1 rounded-full border border-[#f1c40f]/25 bg-[#f1c40f]/10 px-2 py-[3px] text-[8px] font-semibold text-[#f1c40f] sm:flex">
                        <span className="text-[9px]">★</span>
                        Premium
                    </span>
                    )}
                </div>

          <p className="mt-0.5 truncate text-[9px] text-white/30">
            @{user.username}
          </p>
        </div>
      </Link>

      <span className="text-right text-[11px] font-semibold text-white/85">
        {formatNumber(score)}
      </span>
    </div>
  );
}

function ProfileAvatar({
  user,
}: {
  user: LeaderboardUser;
}) {
  if (user.avatar) {
    return (
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/[0.07] bg-white/[0.025]">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.025]">
      <HugeiconsIcon
        icon={UserIcon}
        size={15}
        strokeWidth={1.7}
        className="text-white/25"
      />
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}