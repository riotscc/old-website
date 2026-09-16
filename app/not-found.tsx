import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 text-white">
      <div className="w-full max-w-[420px] text-center">
        <p className="text-[11px] font-medium text-white/25">404</p>

        <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.6px] text-white">
          Page not found
        </h1>

        <p className="mx-auto mt-2 max-w-[320px] text-[11px] leading-5 text-white/30">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/"
            className="rounded-[10px] bg-[#2832F9] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#3540ff]"
          >
            Go home
          </Link>

          <Link
            href="/dashboard"
            className="rounded-[10px] border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-semibold text-white/50 transition hover:bg-white/[0.04] hover:text-white/75"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}