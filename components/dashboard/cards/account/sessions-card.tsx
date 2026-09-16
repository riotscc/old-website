"use client"

import * as React from "react"
import { motion } from "framer-motion"
import SettingsPageSwitcher from "@/components/custom/settings-page-switcher"

type Session = {
  id: string
  browser: string
  os: string
  device: string
  ip: string | null
  createdAt: string
  lastActiveAt: string
  current: boolean
}

type SessionsResponse = {
  success: boolean
  sessions?: Session[]
  error?: string
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Unknown"
  }

  return date.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  })
}

export default function SessionsSettingsCard() {
  const [sessions, setSessions] = React.useState<Session[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [revealedIps, setRevealedIps] = React.useState<Set<string>>(
    new Set()
  )
  const [endingId, setEndingId] = React.useState<string | null>(null)
  const [signingOutOthers, setSigningOutOthers] = React.useState(false)

  async function loadSessions() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/account/sessions", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })

      const data = (await response.json()) as SessionsResponse

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load sessions.")
      }

      setSessions(Array.isArray(data.sessions) ? data.sessions : [])
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load sessions."
      )
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    void loadSessions()
  }, [])

  function toggleIp(id: string) {
    setRevealedIps((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  async function endSession(session: Session) {
    if (session.current || endingId) {
      return
    }

    try {
      setEndingId(session.id)
      setError("")

      const response = await fetch("/api/account/sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: session.id,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to sign out session.")
      }

      setSessions((current) =>
        current.filter((item) => item.id !== session.id)
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign out session."
      )
    } finally {
      setEndingId(null)
    }
  }

  async function signOutOthers() {
    if (signingOutOthers) {
      return
    }

    try {
      setSigningOutOthers(true)
      setError("")

      const response = await fetch("/api/account/sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          others: true,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to sign out other sessions."
        )
      }

      setSessions((current) =>
        current.filter((session) => session.current)
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign out other sessions."
      )
    } finally {
      setSigningOutOthers(false)
    }
  }

  const otherSessions = sessions.filter(
    (session) => !session.current
  ).length

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

        <span className="text-black/25 dark:text-white/20">›</span>

        <span className="text-black/35 dark:text-white/30">
          Account
        </span>

        <span className="text-black/25 dark:text-white/20">›</span>

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
        <section className="overflow-hidden rounded-[18px] border border-black/[0.08] bg-white dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.25px] text-black/90 dark:text-white/90">
                Security & Sessions
              </h2>

              <p className="mt-1.5 text-[10px] text-black/45 dark:text-white/35">
                Review active sessions and manage signed-in devices.
              </p>
            </div>

            <button
              type="button"
              disabled={signingOutOthers || otherSessions === 0}
              onClick={() => void signOutOthers()}
              className="flex h-[35px] shrink-0 items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.015] px-4 text-[10px] font-semibold text-black/45 transition hover:border-black/[0.14] hover:bg-black/[0.04] hover:text-black/75 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.07] dark:bg-white/[0.01] dark:text-white/40 dark:hover:border-white/[0.12] dark:hover:bg-white/[0.03] dark:hover:text-white/70"
            >
              <SignOutIcon />

              {signingOutOthers
                ? "Signing Out..."
                : "Sign Out Others"}
            </button>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex min-h-[135px] items-center justify-center rounded-[15px] border border-black/[0.08] bg-black/[0.015] dark:border-white/[0.06] dark:bg-black/15">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-black/45 dark:border-white/10 dark:border-t-white/45" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex min-h-[135px] items-center justify-center rounded-[15px] border border-dashed border-black/[0.08] bg-black/[0.015] px-5 dark:border-white/[0.06] dark:bg-black/15">
                <div className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center text-black/35 dark:text-white/30">
                    <DeviceIcon />
                  </div>

                  <p className="mt-2 text-[10px] font-semibold text-black/75 dark:text-white/70">
                    No sessions found
                  </p>

                  <p className="mt-1 text-[9px] text-black/35 dark:text-white/25">
                    Your active sessions will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const revealed = revealedIps.has(session.id)

                  return (
                    <div
                      key={session.id}
                      className="flex flex-col gap-4 rounded-[15px] border border-black/[0.08] bg-black/[0.015] px-4 py-4 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-black/15"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.09] dark:text-emerald-400">
                          <DeviceIcon />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold text-black/85 dark:text-white/85">
                              {session.browser} on {session.os}
                            </p>

                            {session.current && (
                              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[8px] font-semibold text-emerald-600 dark:text-emerald-400">
                                Current
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[9px] text-black/45 dark:text-white/35">
                            {session.device} - Last active{" "}
                            {formatDate(session.lastActiveAt)}
                          </p>

                          <p className="mt-1 text-[9px] text-black/35 dark:text-white/25">
                            Signed in {formatDate(session.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                        <button
                          type="button"
                          onClick={() => toggleIp(session.id)}
                          className="flex h-[36px] min-w-[124px] items-center justify-center rounded-[11px] border border-black/[0.1] bg-black/[0.02] px-3 text-[9px] font-medium text-black/50 transition hover:border-black/[0.16] hover:bg-black/[0.04] hover:text-black/75 dark:border-white/[0.09] dark:bg-white/[0.015] dark:text-white/40 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.03] dark:hover:text-white/70"
                        >
                          {revealed
                            ? session.ip || "Unknown IP"
                            : "Click to reveal IP"}
                        </button>

                        {session.current ? (
                          <div className="flex h-[35px] min-w-[124px] items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.015] px-3 text-[9px] font-semibold text-black/45 dark:border-white/[0.07] dark:bg-white/[0.01] dark:text-white/40">
                            <SignOutIcon />
                            Current session
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={endingId === session.id}
                            onClick={() => void endSession(session)}
                            className="flex h-[35px] min-w-[124px] items-center justify-center gap-2 rounded-full border border-red-500/15 bg-red-500/[0.05] px-3 text-[9px] font-semibold text-red-500/80 transition hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400/75 dark:hover:text-red-400"
                          >
                            <SignOutIcon />

                            {endingId === session.id
                              ? "Signing Out..."
                              : "Sign Out"}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 flex min-h-[54px] items-center gap-3 rounded-[13px] border border-black/[0.08] bg-black/[0.015] px-4 dark:border-white/[0.06] dark:bg-white/[0.015]">
              <div className="shrink-0 text-amber-500">
                <WarningIcon />
              </div>

              <p className="text-[9px] leading-[15px] text-black/45 dark:text-white/35">
                If you do not recognize a session, end it immediately and
                change your password.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-[11px] border border-red-500/10 bg-red-500/[0.04] px-3 py-2.5 text-[9px] font-medium text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

function DeviceIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  )
}

function SignOutIcon() {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}