import Link from "next/link";

export default function StripeSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6">
      <div className="w-full max-w-[460px] text-center">
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-[22px] text-green-400">
            ✓
          </div>

          <h1 className="mt-6 text-[30px] font-semibold tracking-[-1px] text-white">
            Payment successful
          </h1>

          <p className="mt-3 text-[14px] leading-6 text-white/45">
            Your Stripe sandbox payment was
            completed successfully.
          </p>

          <Link
            href="/stripe"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#2832F9] px-6 text-[13px] font-medium text-white transition hover:bg-[#3540ff]"
          >
            Test another payment
          </Link>
        </div>
      </div>
    </main>
  );
}