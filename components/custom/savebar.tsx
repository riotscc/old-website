"use client";

import { useEffect } from "react";
import { RotateCcw, Save } from "lucide-react";

type SaveBarProps = {
    open: boolean;
    saving?: boolean;
    onUndo: () => void;
    onSave: () => void;
};

export default function SaveBar({
    open,
    saving = false,
    onUndo,
    onSave,
}: SaveBarProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (!open || saving || !event.ctrlKey) {
                return;
            }

            const key = event.key.toLowerCase();

            if (key === "z") {
                event.preventDefault();
                onUndo();
            }

            if (key === "s") {
                event.preventDefault();
                onSave();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, saving, onUndo, onSave]);

    return (
        <div
            className={[
                "fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-[520px]",
                "-translate-x-1/2 transition-all duration-300 ease-out",
                open
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-[140%] opacity-0",
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-4 rounded-[14px] border border-black/[0.08] bg-white/95 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0a0a0d]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <div className="min-w-0 px-2">
                    <p className="text-[10px] font-semibold text-black/80 dark:text-white/80">
                        Unsaved changes
                    </p>

                    <p className="mt-0.5 text-[8px] text-black/40 dark:text-white/30">
                        Save your changes before leaving this page.
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onUndo}
                        disabled={saving}
                        className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-black/[0.08] bg-black/[0.025] px-3 text-[9px] font-medium text-black/50 transition-all hover:border-black/[0.14] hover:bg-black/[0.05] hover:text-black/80 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-white/45 dark:hover:border-white/[0.12] dark:hover:bg-white/[0.04] dark:hover:text-white/80"
                    >
                        <RotateCcw size={12} />
                        Undo
                        <span className="ml-1 text-[7px] text-black/30 dark:text-white/20">
                            Ctrl Z
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="flex h-[34px] items-center gap-1.5 rounded-[8px] bg-[#2832F9] px-3.5 text-[9px] font-semibold text-white transition-all hover:bg-[#3540ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={12} />
                        {saving ? "Saving..." : "Save Changes"}
                        {!saving && (
                            <span className="ml-1 text-[7px] text-white/55">
                                Ctrl S
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}