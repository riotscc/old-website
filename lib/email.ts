import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailOptions {
    email: string;
    code: string;
}

export async function sendVerificationEmail({
    email,
    code,
}: SendVerificationEmailOptions) {
    const { data, error } = await resend.emails.send({
        from: "carts.lol <noreply@carts.lol>",
        to: [email],
        subject: `${code} is your carts.lol sign-in code`,
        text: `${code} is your carts.lol sign-in code. It expires in 10 minutes.`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <meta name="color-scheme" content="light" />
                    <meta name="supported-color-schemes" content="light" />

                    <title>Your carts.lol sign-in code</title>

                    <style>
                        @media only screen and (max-width: 600px) {
                            .wrapper {
                                padding: 24px 16px !important;
                            }

                            .content {
                                padding: 28px !important;
                            }

                            .code {
                                font-size: 30px !important;
                                letter-spacing: 7px !important;
                            }
                        }
                    </style>
                </head>

                <body
                    style="
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f8;
                        font-family:
                            Inter,
                            -apple-system,
                            BlinkMacSystemFont,
                            'Segoe UI',
                            Helvetica,
                            Arial,
                            sans-serif;
                        color: #171717;
                        -webkit-font-smoothing: antialiased;
                    "
                >
                    <div
                        style="
                            display: none;
                            max-height: 0;
                            overflow: hidden;
                            opacity: 0;
                        "
                    >
                        ${code} is your carts.lol sign-in code.
                    </div>

                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        role="presentation"
                        style="
                            width: 100%;
                            background-color: #f7f7f8;
                        "
                    >
                        <tr>
                            <td
                                align="center"
                                class="wrapper"
                                style="
                                    padding: 48px 20px;
                                "
                            >
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    role="presentation"
                                    style="
                                        width: 100%;
                                        max-width: 520px;
                                    "
                                >
                                    <tr>
                                        <td
                                            style="
                                                padding: 0 4px 18px;
                                                font-size: 19px;
                                                line-height: 1;
                                                font-weight: 700;
                                                letter-spacing: -0.6px;
                                                color: #171717;
                                            "
                                        >
                                            carts<span style="color: #2832f9;">.lol</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            style="
                                                background-color: #ffffff;
                                                border: 1px solid #e5e5e7;
                                                border-radius: 14px;
                                            "
                                        >
                                            <table
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                border="0"
                                                role="presentation"
                                            >
                                                <tr>
                                                    <td
                                                        class="content"
                                                        style="
                                                            padding: 38px 40px 36px;
                                                        "
                                                    >
                                                        <div
                                                            style="
                                                                margin-bottom: 18px;
                                                                font-size: 12px;
                                                                line-height: 1;
                                                                font-weight: 600;
                                                                color: #77777f;
                                                            "
                                                        >
                                                            Sign in to carts.lol
                                                        </div>

                                                        <h1
                                                            style="
                                                                margin: 0;
                                                                padding: 0;
                                                                font-size: 25px;
                                                                line-height: 1.25;
                                                                font-weight: 650;
                                                                letter-spacing: -0.8px;
                                                                color: #171717;
                                                            "
                                                        >
                                                            Here's your sign-in code.
                                                        </h1>

                                                        <p
                                                            style="
                                                                margin: 12px 0 0;
                                                                padding: 0;
                                                                font-size: 14px;
                                                                line-height: 1.6;
                                                                color: #707078;
                                                            "
                                                        >
                                                            Enter this code to continue signing in.
                                                            It expires in 10 minutes.
                                                        </p>

                                                        <div
                                                            style="
                                                                margin: 30px 0;
                                                                height: 1px;
                                                                background-color: #eeeeef;
                                                            "
                                                        ></div>

                                                        <div
                                                            class="code"
                                                            style="
                                                                font-family:
                                                                    'SFMono-Regular',
                                                                    Consolas,
                                                                    'Liberation Mono',
                                                                    Menlo,
                                                                    monospace;
                                                                font-size: 34px;
                                                                line-height: 1;
                                                                font-weight: 600;
                                                                letter-spacing: 9px;
                                                                color: #171717;
                                                            "
                                                        >
                                                            ${code}
                                                        </div>

                                                        <div
                                                            style="
                                                                margin: 30px 0;
                                                                height: 1px;
                                                                background-color: #eeeeef;
                                                            "
                                                        ></div>

                                                        <p
                                                            style="
                                                                margin: 0;
                                                                font-size: 12px;
                                                                line-height: 1.6;
                                                                color: #94949b;
                                                            "
                                                        >
                                                            If you didn't request this code, you can
                                                            safely ignore this email.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td
                                            style="
                                                padding: 18px 4px 0;
                                            "
                                        >
                                            <table
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                border="0"
                                                role="presentation"
                                            >
                                                <tr>
                                                    <td
                                                        style="
                                                            font-size: 11px;
                                                            line-height: 1.6;
                                                            color: #a0a0a6;
                                                        "
                                                    >
                                                        © ${new Date().getFullYear()} carts.lol
                                                    </td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            font-size: 11px;
                                                            line-height: 1.6;
                                                        "
                                                    >
                                                        <a
                                                            href="https://carts.lol"
                                                            style="
                                                                color: #8a8a91;
                                                                text-decoration: none;
                                                            "
                                                        >
                                                            carts.lol
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `,
    });

    if (error) {
        console.error("RESEND_EMAIL_ERROR:", error);
        throw new Error("Failed to send verification email.");
    }

    return data;
}