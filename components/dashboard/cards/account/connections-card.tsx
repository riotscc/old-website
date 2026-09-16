"use client"

import * as React from "react"
import { motion } from "framer-motion"
import SettingsPageSwitcher from "@/components/custom/settings-page-switcher"
import { useAuth } from "@/components/providers/auth-provider"

export default function ConnectionsSettingsCard() {
  const {
    connections,
    loading,
    refreshUser,
  } = useAuth()

  const [disconnecting, setDisconnecting] =
    React.useState(false)

  const [error, setError] =
    React.useState("")

  const connection =
    connections?.discord ?? null

  const connected =
    Boolean(connection?.connected)

  async function handleDisconnect() {
    if (
      !connected ||
      disconnecting
    ) {
      return
    }

    try {
      setDisconnecting(true)
      setError("")

      const response = await fetch(
        "/api/connections/discord",
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.error ||
            "Failed to disconnect Discord."
        )
      }

      await refreshUser()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to disconnect Discord."
      )
    } finally {
      setDisconnecting(false)
    }
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
        duration: 0.3,
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
        <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div>
            <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
              Connections
            </h2>

            <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
              Manage accounts connected to your carts.lol account.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-[13px] border border-black/[0.08] bg-black/[0.02] dark:border-white/[0.06] dark:bg-black/15">
            <div className="flex min-h-[58px] items-center gap-3 px-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-black/[0.08] bg-black/[0.025] text-black/50 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/45">
                <DiscordIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-black/85 dark:text-white/85">
                  Discord
                </p>

                {loading ? (
                  <div className="mt-1 h-2.5 w-40 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.05]" />
                ) : connected &&
                  connection ? (
                  <p className="mt-0.5 truncate text-[9px] text-black/40 dark:text-white/30">
                    Connected as{" "}
                    <span className="font-medium text-black/55 dark:text-white/45">
                      {connection.displayName ||
                        connection.username ||
                        "Unknown User"}
                    </span>{" "}
                    {connection.id && (
                      <span className="text-black/25 dark:text-white/20">
                        ({connection.id})
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[9px] text-black/40 dark:text-white/30">
                    Sign in with your Discord account.
                  </p>
                )}
              </div>

              {!loading &&
                (connected ? (
                  <button
                    type="button"
                    disabled={disconnecting}
                    onClick={() =>
                      void handleDisconnect()
                    }
                    aria-label="Disconnect Discord"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-red-500/15 bg-red-500/[0.06] text-red-500/80 transition hover:border-red-500/30 hover:bg-red-500/[0.1] hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400/75 dark:hover:text-red-400"
                  >
                    {disconnecting ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-red-400/20 border-t-red-400" />
                    ) : (
                      <UnlinkIcon />
                    )}
                  </button>
                ) : (
                  <a
                    href="/api/auth/discord"
                    className="flex h-[32px] shrink-0 items-center gap-1.5 rounded-[9px] border border-[#2832F9]/20 bg-[#2832F9]/10 px-3 text-[9px] font-semibold text-[#2832F9] transition hover:border-[#2832F9]/35 hover:bg-[#2832F9]/15 hover:text-[#1d27e8] dark:text-[#7c83ff] dark:hover:text-[#9ca1ff]"
                  >
                    <LinkIcon />
                    Connect
                  </a>
                ))}
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-[11px] border border-red-500/10 bg-red-500/[0.04] px-3 py-2.5 text-[9px] font-medium text-red-500 dark:text-red-400">
              {error}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  )
}

function DiscordIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.77-.551 1.116a18.27 18.27 0 0 0-5.668 0A11.64 11.64 0 0 0 9.114 3 19.736 19.736 0 0 0 4.68 4.37C1.879 8.602 1.118 12.73 1.499 16.8a19.947 19.947 0 0 0 5.427 2.771c.439-.598.83-1.232 1.167-1.897-.643-.244-1.255-.544-1.831-.892.153-.112.302-.229.446-.349 3.531 1.658 7.365 1.658 10.855 0 .146.12.295.237.446.35a11.73 11.73 0 0 1-1.834.893c.338.664.728 1.297 1.168 1.895a19.86 19.86 0 0 0 5.43-2.771c.447-4.723-.763-8.813-3.46-12.432ZM8.02 14.315c-1.06 0-1.932-.98-1.932-2.184 0-1.205.853-2.184 1.932-2.184 1.088 0 1.95.989 1.932 2.184 0 1.204-.853 2.184-1.932 2.184Zm7.143 0c-1.06 0-1.932-.98-1.932-2.184 0-1.205.853-2.184 1.932-2.184 1.088 0 1.95.989 1.932 2.184 0 1.204-.844 2.184-1.932 2.184Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function UnlinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18.84 12.25 1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="m5.17 11.75-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      <path d="M8 2v3" />
      <path d="M2 8h3" />
      <path d="M16 19v3" />
      <path d="M19 16h3" />
    </svg>
  )
}