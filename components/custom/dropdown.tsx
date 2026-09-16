"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

export type DropdownOption = {
  label: string
  value: string
  icon?: React.ComponentProps<
    typeof HugeiconsIcon
  >["icon"]
  disabled?: boolean
}

type CustomDropdownProps = {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  align?: "left" | "right"
  width?: number
  trigger?: ReactNode
}

export default function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
  align = "left",
  width = 180,
  trigger,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false)

  const containerRef =
    useRef<HTMLDivElement | null>(null)

  const selectedOption =
    options.find(
      (option) => option.value === value
    ) ?? null

  useEffect(() => {
    function handleMouseDown(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleMouseDown
    )

    document.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      )

      document.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [])

  function handleSelect(
    option: DropdownOption
  ) {
    if (option.disabled) {
      return
    }

    onChange(option.value)
    setOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      {trigger ? (
        <button
          type="button"
          onClick={() =>
            setOpen((current) => !current)
          }
        >
          {trigger}
        </button>
      ) : (
        <button
          type="button"
          onClick={() =>
            setOpen((current) => !current)
          }
          aria-expanded={open}
          className="flex h-[38px] w-full items-center justify-between gap-3 rounded-[11px] border border-black/[0.08] bg-white px-3 text-left transition hover:border-black/[0.14] hover:bg-black/[0.02] dark:border-white/[0.065] dark:bg-[#0a0a0a] dark:hover:border-white/[0.1] dark:hover:bg-white/[0.018]"
        >
          <div className="flex min-w-0 items-center gap-2">
            {selectedOption?.icon && (
              <HugeiconsIcon
                icon={selectedOption.icon}
                size={14}
                color="currentColor"
                strokeWidth={1.8}
                className="shrink-0 text-black/40 dark:text-white/35"
              />
            )}

            <span className="truncate text-[10px] font-medium text-black/65 dark:text-white/65">
              {selectedOption?.label ??
                placeholder}
            </span>
          </div>

          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            color="currentColor"
            strokeWidth={1.8}
            className={`shrink-0 text-black/35 transition-transform duration-200 dark:text-white/30 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.985,
            }}
            transition={{
              duration: 0.14,
              ease: "easeOut",
            }}
            style={{
              width,
            }}
            className={`absolute top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-black/[0.08] bg-white p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.16)] backdrop-blur-xl dark:border-white/[0.075] dark:bg-[#0b0b0b] dark:shadow-[0_18px_55px_rgba(0,0,0,0.6)] ${
              align === "right"
                ? "right-0"
                : "left-0"
            }`}
          >
            <div className="space-y-0.5">
              {options.map((option) => {
                const selected =
                  option.value === value

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() =>
                      handleSelect(option)
                    }
                    className={`flex h-[36px] w-full items-center gap-2 rounded-[9px] px-2.5 text-left transition ${
                      selected
                        ? "bg-[#2832F9]/[0.08] text-black dark:bg-[#2832F9]/10 dark:text-white"
                        : "text-black/50 hover:bg-black/[0.04] hover:text-black/80 dark:text-white/45 dark:hover:bg-white/[0.04] dark:hover:text-white/80"
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    {option.icon && (
                      <HugeiconsIcon
                        icon={option.icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={1.8}
                        className={
                          selected
                            ? "text-[#2832F9] dark:text-[#7279ff]"
                            : "text-black/35 dark:text-white/30"
                        }
                      />
                    )}

                    <span className="min-w-0 flex-1 truncate text-[10px] font-medium">
                      {option.label}
                    </span>

                    {selected && (
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={2}
                        className="text-[#2832F9] dark:text-[#7279ff]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}