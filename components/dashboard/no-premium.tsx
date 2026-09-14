"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Diamond02Icon,
} from "@hugeicons/core-free-icons";

type NoPremiumProps = {
  open: boolean;
  onClose: () => void;
};

const features = [
  "Background themes & border animations",
  "No profile watermark",
  "Click sounds & custom metadata",
  "Larger uploads, more links, and unlimited music",
];

export default function NoPremium({ open, onClose }: NoPremiumProps) {
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[404px] rounded-[18px] border border-white/[0.13] bg-[#0b0b0b] p-[18px] shadow-[0_28px_90px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold tracking-[-0.35px] text-white">
                Get Premium
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-[9px] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                aria-label="Close"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-3">
              <HugeiconsIcon
                icon={Diamond02Icon}
                size={25}
                color="currentColor"
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-[#2832F9]"
              />

              <p className="max-w-[315px] text-[12px] leading-[20px] text-white/45">
                One-time payment for lifetime access. Unlock premium
                customization and support carts.lol.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-[#2832F9]" />
                  <span className="text-[12px] font-medium text-white/65">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/store"
              onClick={onClose}
              className="mt-5 flex h-[40px] w-full items-center justify-center rounded-[13px] bg-white/[0.055] text-[12px] font-semibold text-white transition-colors hover:bg-white/[0.085]"
            >
              Purchase
            </Link>

            <Link
              href="/store"
              onClick={onClose}
              className="mt-2.5 flex items-center justify-center text-[10px] font-medium text-white/30 transition-colors hover:text-white/55"
            >
              View full Premium details
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
