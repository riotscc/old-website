import Stripe from "stripe";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const secretKey =
      process.env
        .SANDBOX_TESTING_STRIPE_API_KEY_SECRET;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe secret key is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const stripe =
      new Stripe(secretKey);

    const body =
      await request.json();

    const amount =
      typeof body.amount === "number"
        ? Math.round(body.amount)
        : 500;

    if (
      amount < 50 ||
      amount > 100000
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    const origin =
      request.nextUrl.origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        managed_payments: {
          enabled: false,
        },

        payment_method_types: [
          "card",
        ],

        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amount,
              product_data: {
                name:
                  "carts.lol Sandbox Test",
                description:
                  "Stripe sandbox payment testing",
              },
            },
          },
        ],

        success_url:
          `${origin}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/stripe?canceled=true`,

        metadata: {
          environment:
            "sandbox",
          source:
            "stripe-testing-page",
        },
      });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error(
      "STRIPE_CHECKOUT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Stripe checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}