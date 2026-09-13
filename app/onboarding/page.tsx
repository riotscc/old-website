export default function OnboardingPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-black px-4">
      <div className="w-full max-w-[420px] rounded-[26px] border border-white/[0.09] bg-[#080809] p-8 text-center">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04]">
          <div className="size-2.5 rounded-full bg-[#2832F9]" />
        </div>

        <h1 className="text-[26px] font-semibold tracking-[-0.8px] text-white">
          Welcome
        </h1>

        <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-6 text-white/45">
          Your account is ready. We just need a few more details before you
          can continue.
        </p>

        <div className="mt-7 rounded-[16px] border border-white/[0.08] bg-white/[0.025] px-4 py-4">
          <p className="text-[13px] text-white/40">
            Onboarding coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}