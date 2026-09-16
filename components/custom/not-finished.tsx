"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ConstructionIcon,
} from "@hugeicons/core-free-icons";

type UnderConstructionModalProps = {
  defaultOpen?: boolean;
  discordUrl?: string;
};

export default function UnderConstructionModal({
  defaultOpen = true,
  discordUrl = "https://discord.gg/yourserver",
}: UnderConstructionModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-[5px]"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 5,
            }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 w-full max-w-[320px] rounded-[13px] border border-white/[0.11] bg-[#0b0b0b] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-semibold tracking-[-0.25px] text-white">
                Under construction
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-5 w-5 items-center justify-center text-white/25 transition-colors hover:text-white/60"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={12}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
                <HugeiconsIcon
                  icon={ConstructionIcon}
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#2832F9]"
                />
              </div>

              <p className="text-[10px] leading-[16px] text-white/45">
                This area is still being worked on. Some features may be
                unavailable while we finish things up.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              <Feature text="New features are still being added" />
              <Feature text="Some options may change before release" />
              <Feature text="Updates will be posted in our Discord" />
            </div>

            <Link
              href={discordUrl}
              target="_blank"
              className="mt-4 flex h-8 w-full items-center justify-center rounded-[8px] border border-white/[0.05] bg-white/[0.035] text-[10px] font-semibold text-white/80 transition-all duration-200 hover:bg-white/[0.065] hover:text-white"
            >
              Check Discord for updates
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 flex w-full items-center justify-center py-1 text-[8px] font-medium text-white/25 transition-colors hover:text-white/45"
            >
              Continue to page
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#2832F9]" />

      <span className="text-[9px] leading-[13px] text-white/55">
        {text}
      </span>
    </div>
  );
}