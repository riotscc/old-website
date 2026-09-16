"use client"

import * as React from "react"
import { motion } from "framer-motion"
import SettingsPageSwitcher from "@/components/custom/settings-page-switcher"
import SaveBar from "@/components/custom/savebar"

type SecurityResponse = {
  success?: boolean
  email?: string | null
  discordBotVisible?: boolean
  publicApiVisible?: boolean
  error?: string
}

type SecuritySettingsCardProps = {
  onRequestEmailChange?: () => void
  onUpdatePassword?: (
    newPassword: string
  ) => Promise<void> | void
  onDiscordBotVisibleChange?: (enabled: boolean) => Promise<void> | void
  onPublicApiVisibleChange?: (enabled: boolean) => Promise<void> | void
}

export default function SecuritySettingsCard({
  onRequestEmailChange,
  onUpdatePassword,
  onDiscordBotVisibleChange,
  onPublicApiVisibleChange,
}: SecuritySettingsCardProps) {
  const [email, setEmail] = React.useState<string | null>(null)
  const [loadingSecurity, setLoadingSecurity] = React.useState(true)
  const [securityError, setSecurityError] = React.useState("")

  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [showNewPassword, setShowNewPassword] =
    React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState(false)

  const [savingChanges, setSavingChanges] =
    React.useState(false)

  const [emailHovered, setEmailHovered] =
    React.useState(false)

  const [discordVisible, setDiscordVisible] =
    React.useState(true)

  const [apiVisible, setApiVisible] =
    React.useState(true)

  const [originalDiscordVisible, setOriginalDiscordVisible] =
    React.useState<boolean | null>(null)

  const [originalApiVisible, setOriginalApiVisible] =
    React.useState<boolean | null>(null)

  const passwordsMatch =
    newPassword === confirmPassword

  const passwordChanged =
    newPassword.length > 0 ||
    confirmPassword.length > 0

  const visibilityChanged =
    (originalDiscordVisible !== null &&
      discordVisible !== originalDiscordVisible) ||
    (originalApiVisible !== null &&
      apiVisible !== originalApiVisible)

  const hasChanges =
    passwordChanged ||
    visibilityChanged

  React.useEffect(() => {
    let mounted = true

    async function loadSecurity() {
      try {
        setLoadingSecurity(true)
        setSecurityError("")

        const response = await fetch("/api/account/security", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })

        const data =
          (await response.json()) as SecurityResponse

        if (!mounted) {
          return
        }

        if (!response.ok || !data.success) {
          setSecurityError(
            data.error || "Failed to load security settings."
          )
          return
        }

        setEmail(data.email ?? null)
        const nextDiscordVisible =
          data.discordBotVisible ?? true

        const nextApiVisible =
          data.publicApiVisible ?? true

        setDiscordVisible(nextDiscordVisible)
        setApiVisible(nextApiVisible)
        setOriginalDiscordVisible(nextDiscordVisible)
        setOriginalApiVisible(nextApiVisible)
      } catch {
        if (mounted) {
          setSecurityError(
            "Failed to load security settings."
          )
        }
      } finally {
        if (mounted) {
          setLoadingSecurity(false)
        }
      }
    }

    void loadSecurity()

    return () => {
      mounted = false
    }
  }, [])

  function handleUndo() {
    setNewPassword("")
    setConfirmPassword("")
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setSecurityError("")

    if (originalDiscordVisible !== null) {
      setDiscordVisible(originalDiscordVisible)
    }

    if (originalApiVisible !== null) {
      setApiVisible(originalApiVisible)
    }
  }

  async function handleSave() {
    if (!hasChanges || savingChanges) {
      return
    }

    if (
      passwordChanged &&
      (
        newPassword.length === 0 ||
        confirmPassword.length === 0
      )
    ) {
      setSecurityError(
        "Enter and confirm your new password."
      )
      return
    }

    if (
      passwordChanged &&
      !passwordsMatch
    ) {
      setSecurityError(
        "Passwords do not match."
      )
      return
    }

    try {
      setSavingChanges(true)
      setSecurityError("")

      if (passwordChanged) {
        if (onUpdatePassword) {
          await onUpdatePassword(newPassword)
        } else {
          const response = await fetch(
            "/api/account/security/password",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                newPassword,
              }),
            }
          )

          const data = await response.json()

          if (!response.ok) {
            throw new Error(
              data?.error ||
                "Failed to update password."
            )
          }
        }
      }

      const visibilityBody: {
        discordBotVisible?: boolean
        publicApiVisible?: boolean
      } = {}

      if (
        originalDiscordVisible !== null &&
        discordVisible !== originalDiscordVisible
      ) {
        if (onDiscordBotVisibleChange) {
          await onDiscordBotVisibleChange(
            discordVisible
          )
        } else {
          visibilityBody.discordBotVisible =
            discordVisible
        }
      }

      if (
        originalApiVisible !== null &&
        apiVisible !== originalApiVisible
      ) {
        if (onPublicApiVisibleChange) {
          await onPublicApiVisibleChange(
            apiVisible
          )
        } else {
          visibilityBody.publicApiVisible =
            apiVisible
        }
      }

      if (
        Object.keys(visibilityBody).length > 0
      ) {
        const response = await fetch(
          "/api/account/security",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              visibilityBody
            ),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to update security settings."
          )
        }
      }

      setOriginalDiscordVisible(
        discordVisible
      )
      setOriginalApiVisible(
        apiVisible
      )
      setNewPassword("")
      setConfirmPassword("")
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      setSecurityError(
        error instanceof Error
          ? error.message
          : "Failed to save security settings."
      )
    } finally {
      setSavingChanges(false)
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

      <div className="mt-5 space-y-4">
        <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div>
            <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
              Email
            </h2>

            <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
              Used for login and account notifications.
            </p>
          </div>

          <label className="mt-5 block text-[9px] font-semibold text-black/55 dark:text-white/55">
            Email
          </label>

          <div className="mt-2 flex h-[44px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-black/[0.02] dark:border-white/[0.07] dark:bg-black/20">
            <div className="flex h-full w-[42px] shrink-0 items-center justify-center text-black/40 dark:text-white/30">
              <MailIcon />
            </div>

            <div
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              className="flex min-w-0 flex-1 items-center pr-3"
            >
              {loadingSecurity ? (
                <div className="h-3 w-40 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.06]" />
              ) : (
                <span
                  className={`truncate text-[11px] font-medium text-black/60 transition-[filter] duration-200 dark:text-white/55 ${
                    email && !emailHovered
                      ? "select-none blur-[5px]"
                      : "select-text blur-0"
                  }`}
                >
                  {email || "No email connected"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onRequestEmailChange}
              className="m-1 min-w-[132px] rounded-[10px] border border-[#2832F9]/15 bg-[#2832F9]/[0.07] px-4 text-[10px] font-semibold text-[#2832F9] transition hover:border-[#2832F9]/30 hover:bg-[#2832F9]/10 hover:text-[#1d27e8] dark:text-[#7c83ff] dark:hover:text-[#9ba0ff]"
            >
              Request email change
            </button>
          </div>
        </section>

        <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div>
            <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
              Password
            </h2>

            <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
              Use a strong password you don&apos;t use anywhere else.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <PasswordField
              label="New password"
              value={newPassword}
              show={showNewPassword}
              onShowChange={setShowNewPassword}
              onChange={setNewPassword}
            />

            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              show={showConfirmPassword}
              onShowChange={setShowConfirmPassword}
              onChange={setConfirmPassword}
            />

            {confirmPassword &&
              !passwordsMatch && (
                <p className="text-[10px] font-medium text-red-500 dark:text-red-400">
                  Passwords do not match.
                </p>
              )}
          </div>
        </section>

        <section className="rounded-[18px] border border-black/[0.08] bg-white p-4 sm:p-5 dark:border-white/[0.065] dark:bg-[#0b0b0b]">
          <div>
            <h2 className="text-[13px] font-semibold text-black/90 dark:text-white/90">
              API visibility
            </h2>

            <p className="mt-1 text-[10px] leading-[16px] text-black/40 dark:text-white/30">
              Choose whether the carts.lol bot and public API may share your profile.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <VisibilityRow
              icon={<BotIcon />}
              title="Discord bot"
              description="The bot may show you in lookups, leaderboards and profile cards."
              enabled={discordVisible}
              disabled={
                loadingSecurity ||
                savingChanges
              }
              onChange={setDiscordVisible}
            />

            <VisibilityRow
              icon={<CodeIcon />}
              title="Public API"
              description="Apps with an API key can look up your profile."
              enabled={apiVisible}
              disabled={
                loadingSecurity ||
                savingChanges
              }
              onChange={setApiVisible}
            />
          </div>

          <p className="mt-3 text-[9px] leading-[15px] text-black/30 dark:text-white/20">
            Neither switch changes your public page. Your carts.lol page stays reachable either way.
          </p>
        </section>

        {securityError && (
          <div className="rounded-[12px] border border-red-500/10 bg-red-500/[0.04] px-3 py-2.5 text-[10px] font-medium text-red-500 dark:text-red-400">
            {securityError}
          </div>
        )}
      </div>

      <SaveBar
        open={hasChanges}
        saving={savingChanges}
        onUndo={handleUndo}
        onSave={() => void handleSave()}
      />
    </motion.div>
  )
}

function PasswordField({
  label,
  value,
  show,
  onShowChange,
  onChange,
}: {
  label: string
  value: string
  show: boolean
  onShowChange: (show: boolean) => void
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-[9px] font-semibold text-black/55 dark:text-white/55">
        {label}
      </label>

      <div className="mt-2 flex h-[44px] overflow-hidden rounded-[12px] border border-black/[0.08] bg-black/[0.02] transition focus-within:border-black/[0.14] dark:border-white/[0.07] dark:bg-black/20 dark:focus-within:border-white/[0.13]">
        <div className="flex h-full w-[42px] shrink-0 items-center justify-center text-black/40 dark:text-white/30">
          <LockIcon />
        </div>

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="••••••••"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[11px] font-medium text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/20"
        />

        <button
          type="button"
          onClick={() =>
            onShowChange(!show)
          }
          className="flex h-full w-[42px] shrink-0 items-center justify-center text-black/40 transition hover:text-black/70 dark:text-white/30 dark:hover:text-white/65"
        >
          <EyeIcon open={show} />
        </button>

      </div>
    </div>
  )
}

function VisibilityRow({
  icon,
  title,
  description,
  enabled,
  disabled,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  enabled: boolean
  disabled?: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div className="flex min-h-[58px] items-center gap-3 rounded-[13px] border border-black/[0.08] bg-black/[0.02] px-4 dark:border-white/[0.06] dark:bg-black/15">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-black/[0.08] bg-black/[0.025] text-black/40 dark:border-white/[0.055] dark:bg-white/[0.025] dark:text-white/35">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-black/80 dark:text-white/80">
          {title}
        </p>

        <p className="mt-0.5 text-[9px] leading-[14px] text-black/35 dark:text-white/25">
          {description}
        </p>
      </div>

      <Toggle
        enabled={enabled}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  )
}

function Toggle({
  enabled,
  disabled,
  onChange,
}: {
  enabled: boolean
  disabled?: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-[20px] w-[36px] shrink-0 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-45 ${
        enabled
          ? "border-[#2832F9]/35 bg-[#2832F9]/70"
          : "border-black/[0.12] bg-black/[0.08] dark:border-white/[0.08] dark:bg-white/[0.06]"
      }`}
    >
      <motion.span
        animate={{
          x: enabled ? 17 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className="absolute left-0 top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm"
      />
    </button>
  )
}

function MailIcon() {
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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
      />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
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
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="3"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function EyeIcon({
  open,
}: {
  open: boolean
}) {
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
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />

      {!open && (
        <path d="M4 4 20 20" />
      )}
    </svg>
  )
}

function BotIcon() {
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
      <rect
        x="4"
        y="7"
        width="16"
        height="12"
        rx="4"
      />
      <path d="M12 3v4" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
      <path d="M9 16h6" />
    </svg>
  )
}

function CodeIcon() {
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
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  )
}
