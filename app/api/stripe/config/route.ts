import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const publishableKey =
    process.env
      .SANDBOX_TESTING_STRIPE_API_KEY_PUBLISHABLE;

  if (!publishableKey) {
    return NextResponse.json(
      {
        error:
          "Stripe publishable key is missing.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    publishableKey,
  });
}