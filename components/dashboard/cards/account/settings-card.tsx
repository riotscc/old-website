"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import SettingsPageSwitcher from "@/components/custom/settings-page-switcher";
import { useAuth } from "@/components/providers/auth-provider";
import CustomDropdown from "@/components/custom/dropdown";
import SaveBar from "@/components/custom/savebar";

type Alias = {
  id: string;
  username: string;
};

type AliasesResponse = {
  success?: boolean;
  aliases?: Alias[];
  aliasTokens?: number;
  maxSlots?: number;
  isPremium?: boolean;
  alias?: Alias;
  removedAlias?: Alias;
  error?: string;
};

type AliasSort = "shortest" | "longest" | "alphabetical";

export default function SettingsPageCard() {
  const { user, loading: loadingUser, refreshUser } = useAuth();

  const [username, setUsername] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [originalUsername, setOriginalUsername] = React.useState("");
  const [originalDisplayName, setOriginalDisplayName] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [aliases, setAliases] = React.useState<Alias[]>([]);
  const [aliasInput, setAliasInput] = React.useState("");
  const [aliasSearch, setAliasSearch] = React.useState("");
  const [aliasSort, setAliasSort] = React.useState<AliasSort>("shortest");
  const [creating, setCreating] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [showAliasInput, setShowAliasInput] = React.useState(false);
  const [credits, setCredits] = React.useState(0);
  const [maxSlots, setMaxSlots] = React.useState(5);
  const [loadingAliases, setLoadingAliases] = React.useState(true);
  const [error, setError] = React.useState("");

  const aliasInputRef = React.useRef<HTMLInputElement | null>(null);

  const usedSlots = aliases.length;

  const hasProfileChanges =
    username !== originalUsername ||
    displayName !== originalDisplayName;

  const canCreate =
    aliasInput.trim().length > 0 &&
    credits > 0 &&
    usedSlots < maxSlots &&
    !creating &&
    !loadingAliases;

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const nextUsername = user.username || "";
    const nextDisplayName = user.displayName || "";

    setUsername(nextUsername);
    setDisplayName(nextDisplayName);
    setOriginalUsername(nextUsername);
    setOriginalDisplayName(nextDisplayName);
  }, [user]);

  React.useEffect(() => {
    let mounted = true;

    async function loadAliases() {
      try {
        const response = await fetch("/api/account/aliases", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json()) as AliasesResponse;

        if (!mounted) {
          return;
        }

        if (!response.ok || !data.success) {
          setError(data.error || "Failed to load aliases.");
          return;
        }

        setAliases(
          Array.isArray(data.aliases)
            ? data.aliases
            : []
        );

        setCredits(
          Number(data.aliasTokens ?? 0)
        );

        setMaxSlots(
          Number(data.maxSlots ?? 5)
        );
      } catch {
        if (mounted) {
          setError("Failed to load aliases.");
        }
      } finally {
        if (mounted) {
          setLoadingAliases(false);
        }
      }
    }

    loadAliases();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!showAliasInput) {
      return;
    }

    requestAnimationFrame(() => {
      aliasInputRef.current?.focus();
    });
  }, [showAliasInput]);

  const filteredAliases = React.useMemo(() => {
    const query = aliasSearch.trim().toLowerCase();

    const next = aliases.filter((alias) =>
      alias.username.toLowerCase().includes(query)
    );

    return [...next].sort((a, b) => {
      if (aliasSort === "longest") {
        return b.username.length - a.username.length;
      }

      if (aliasSort === "alphabetical") {
        return a.username.localeCompare(b.username);
      }

      return a.username.length - b.username.length;
    });
  }, [aliases, aliasSearch, aliasSort]);

  function handleUndoProfile() {
    setUsername(originalUsername);
    setDisplayName(originalDisplayName);
    setError("");
  }

  async function handleSaveProfile() {
    if (!hasProfileChanges || savingProfile) {
      return;
    }

    try {
      setSavingProfile(true);
      setError("");

      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          displayName: displayName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.error || "Failed to save profile settings."
        );
      }

      const savedUsername =
        data?.user?.username ??
        username.trim().toLowerCase();

      const savedDisplayName =
        data?.user?.displayName ??
        displayName.trim();

      await refreshUser();

      setUsername(savedUsername);
      setDisplayName(savedDisplayName);
      setOriginalUsername(savedUsername);
      setOriginalDisplayName(savedDisplayName);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save profile settings."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCreate() {
    const value = aliasInput
      .trim()
      .toLowerCase();

    if (!value || !canCreate) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "/api/account/aliases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: value,
          }),
        }
      );

      const data = (await response.json()) as AliasesResponse;

      if (!response.ok || !data.success || !data.alias) {
        setError(
          data.error ||
            "Failed to create alias."
        );
        return;
      }

      setAliases((current) => [
        ...current,
        data.alias!,
      ]);

      setCredits(
        Number(data.aliasTokens ?? 0)
      );

      setAliasInput("");
      setShowAliasInput(false);
    } catch {
      setError("Failed to create alias.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(alias: Alias) {
    if (removingId) {
      return;
    }

    try {
      setRemovingId(alias.id);
      setError("");

      const response = await fetch(
        "/api/account/aliases",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: alias.id,
          }),
        }
      );

      const data = (await response.json()) as AliasesResponse;

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Failed to remove alias."
        );
        return;
      }

      setAliases((current) =>
        current.filter(
          (item) => item.id !== alias.id
        )
      );

      setCredits(
        Number(data.aliasTokens ?? 0)
      );
    } catch {
      setError("Failed to remove alias.");
    } finally {
      setRemovingId(null);
    }
  }

  function renderNamesPage() {
    return (
      <>
        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
            <div>
              <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
                Username
              </h2>

              <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
                Your handle on carts.lol/{username || "username"}.
              </p>
            </div>

            <label className="mt-5 block text-[9px] font-semibold text-black/55 dark:text-white/55">
              Username
            </label>

            <div className="mt-2 flex h-[44px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-black/[0.02] transition focus-within:border-black/[0.14] dark:border-white/[0.07] dark:bg-black/20 dark:focus-within:border-white/[0.13]">
              <div className="flex h-full w-[42px] shrink-0 items-center justify-center text-[12px] font-medium text-black/45 dark:text-white/35">
                @
              </div>

              <input
                value={username}
                disabled={loadingUser}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_.-]/g, "")
                  )
                }
                maxLength={32}
                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[11px] font-medium text-black outline-none placeholder:text-black/30 disabled:opacity-50 dark:text-white dark:placeholder:text-white/20"
              />

            </div>
          </section>

          <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
            <div>
              <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
                Display name
              </h2>

              <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
                Shown next to your profile. Leave empty to show no name at all.
              </p>
            </div>

            <label className="mt-5 block text-[9px] font-semibold text-black/55 dark:text-white/55">
              Display name
            </label>

            <div className="mt-2 flex h-[44px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-black/[0.02] transition focus-within:border-black/[0.14] dark:border-white/[0.07] dark:bg-black/20 dark:focus-within:border-white/[0.13]">
              <div className="flex h-full w-[42px] shrink-0 items-center justify-center text-black/45 dark:text-white/35">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={14}
                  color="currentColor"
                  strokeWidth={1.8}
                />
              </div>

              <input
                value={displayName}
                disabled={loadingUser}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
                maxLength={64}
                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[11px] font-medium text-black outline-none placeholder:text-black/30 disabled:opacity-50 dark:text-white dark:placeholder:text-white/20"
              />

            </div>
          </section>
        </div>

        <section className="mt-4 rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
                Aliases ({usedSlots}), {Math.max(credits, 0)} alias{" "}
                {Math.max(credits, 0) === 1 ? "token" : "tokens"} available
              </h2>

              <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
                Extra handles that point to your profile. {usedSlots}/{maxSlots} used.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAliasInput((current) => !current)}
              className="flex h-[34px] shrink-0 items-center justify-center gap-1.5 rounded-[10px] border border-[#2832F9]/20 bg-[#2832F9]/10 px-3.5 text-[10px] font-semibold text-[#2832F9] transition hover:border-[#2832F9]/35 hover:bg-[#2832F9]/15 hover:text-[#1d27e8] dark:text-[#7c83ff] dark:hover:text-[#9ca1ff]"
            >
              <span className="text-[14px] font-normal leading-none">
                +
              </span>

              Add alias
            </button>
          </div>

          {showAliasInput && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-[40px] min-w-0 flex-1 overflow-hidden rounded-[11px] border border-black/[0.08] bg-black/[0.02] transition focus-within:border-[#2832F9]/25 dark:border-white/[0.07] dark:bg-black/20">
                  <div className="flex h-full shrink-0 items-center border-r border-black/[0.08] px-3 text-[10px] font-medium text-black/40 dark:border-white/[0.06] dark:text-white/30">
                    carts.lol/
                  </div>

                  <input
                    ref={aliasInputRef}
                    value={aliasInput}
                    onChange={(event) =>
                      setAliasInput(
                        event.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_.-]/g, "")
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void handleCreate();
                      }
                    }}
                    placeholder="alias"
                    maxLength={32}
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-[10px] font-medium text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/20"
                  />
                </div>

                <button
                  type="button"
                  disabled={!canCreate}
                  onClick={() => void handleCreate()}
                  className="h-[40px] rounded-[11px] bg-[#2832F9] px-5 text-[10px] font-semibold text-white transition hover:bg-[#3540ff] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {creating ? "Creating..." : "Create alias"}
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <p className="mt-3 text-[10px] font-medium text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="flex h-[38px] min-w-0 flex-1 items-center rounded-[11px] border border-black/[0.08] bg-black/[0.02] px-3 transition focus-within:border-black/[0.14] dark:border-white/[0.065] dark:bg-black/20 dark:focus-within:border-white/[0.12]">
              <span className="mr-2 text-[13px] text-black/35 dark:text-white/25">
                ⌕
              </span>

              <input
                value={aliasSearch}
                onChange={(event) => setAliasSearch(event.target.value)}
                placeholder="Search aliases..."
                className="h-full min-w-0 flex-1 bg-transparent text-[10px] font-medium text-black outline-none placeholder:text-black/35 dark:text-white dark:placeholder:text-white/25"
              />
            </div>

            <CustomDropdown
              value={aliasSort}
              onChange={(value) =>
                setAliasSort(value as AliasSort)
              }
              align="right"
              width={170}
              className="w-full sm:w-[170px]"
              options={[
                {
                  label: "Shortest first",
                  value: "shortest",
                },
                {
                  label: "Longest first",
                  value: "longest",
                },
                {
                  label: "Alphabetical",
                  value: "alphabetical",
                },
              ]}
            />
          </div>

          <div className="mt-3">
            {loadingAliases ? (
              <div className="flex min-h-[164px] items-center justify-center rounded-[14px] border border-dashed border-black/[0.08] bg-black/[0.02] dark:border-white/[0.07] dark:bg-black/20">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-black/45 dark:border-white/10 dark:border-t-white/45" />
              </div>
            ) : filteredAliases.length === 0 ? (
              <div className="flex min-h-[164px] items-center justify-center rounded-[14px] border border-dashed border-black/[0.08] bg-black/[0.02] px-5 dark:border-white/[0.07] dark:bg-black/20">
                <div className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center text-black/45 dark:text-white/45">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={27}
                      color="currentColor"
                      strokeWidth={1.6}
                    />
                  </div>

                  <p className="mt-2 text-[10px] font-semibold text-black/80 dark:text-white/80">
                    {aliasSearch ? "No aliases found." : "No aliases yet."}
                  </p>

                  <p className="mx-auto mt-1 max-w-[250px] text-[9px] leading-[15px] text-black/35 dark:text-white/25">
                    {aliasSearch
                      ? "Try searching for a different handle."
                      : "Aliases let you share a different handle that lands on your profile."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAliases.map((alias) => (
                  <div
                    key={alias.id}
                    className="flex min-h-[58px] items-center gap-3 rounded-[13px] border border-black/[0.08] bg-black/[0.02] px-4 dark:border-white/[0.06] dark:bg-black/15"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-black/[0.08] bg-black/[0.025] text-black/45 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/40">
                      <HugeiconsIcon
                        icon={Link01Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-black/80 dark:text-white/80">
                        carts.lol/{alias.username}
                      </p>

                      <p className="mt-0.5 text-[9px] text-black/35 dark:text-white/25">
                        Redirects to your profile
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={removingId === alias.id}
                      onClick={() => void handleRemove(alias)}
                      className="rounded-[9px] border border-black/[0.08] bg-black/[0.025] px-3 py-2 text-[9px] font-semibold text-black/45 transition hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-white/40 dark:hover:text-red-400"
                    >
                      {removingId === alias.id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

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
      className="w-full pt-5 text-[#111111] dark:text-white"
    >
      <div className="flex items-center gap-2 text-[11px] font-medium">
        <span className="text-black/35 dark:text-white/30">
          Dashboard
        </span>

        <span className="text-black/25 dark:text-white/20">
          ›
        </span>

        <span className="text-black/35 dark:text-white/30">
          Account
        </span>

        <span className="text-black/25 dark:text-white/20">
          ›
        </span>

        <span className="text-black/80 dark:text-white/80">
          Settings
        </span>
      </div>

      <div className="mt-8">
        <h1 className="text-[22px] font-semibold tracking-[-0.6px] text-[#111111] dark:text-white">
          Account Settings
        </h1>

        <p className="mt-1.5 max-w-[620px] text-[11px] leading-[18px] text-black/45 dark:text-white/35">
          Manage your name, security, connections, and sessions.
        </p>
      </div>

      <div className="mt-6 max-w-[700px]">
        <SettingsPageSwitcher />
      </div>

      <div className="mt-5">
        {renderNamesPage()}
      </div>

      <SaveBar
        open={hasProfileChanges}
        saving={savingProfile}
        onUndo={handleUndoProfile}
        onSave={() => void handleSaveProfile()}
      />
    </motion.div>
  );
}
