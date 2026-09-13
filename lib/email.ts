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
        from: "hushd.lol <noreply@emails.austricomms.org>",
        to: [email],
        subject: `${code} is your hushd.lol sign-in code`,
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
                    <title>Your hushd.lol sign-in code</title>
                </head>

                <body
                    style="
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f7;
                        font-family:
                            -apple-system,
                            BlinkMacSystemFont,
                            'Segoe UI',
                            Roboto,
                            Helvetica,
                            Arial,
                            sans-serif;
                        color: #171717;
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
                        ${code} is your hushd.lol sign-in code. It expires in 10 minutes.
                    </div>

                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            background-color: #f5f5f7;
                        "
                    >
                        <tr>
                            <td
                                align="center"
                                style="
                                    padding: 28px 16px 18px;
                                "
                            >
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        width: 100%;
                                        max-width: 560px;
                                        background-color: #ffffff;
                                        border: 1px solid #dedee3;
                                        border-top: 6px solid #2832f9;
                                        border-radius: 3px;
                                    "
                                >
                                    <tr>
                                        <td
                                            style="
                                                padding: 30px 40px 32px;
                                            "
                                        >
                                            <div
                                                style="
                                                    margin: 0 0 24px;
                                                    font-size: 27px;
                                                    line-height: 1;
                                                    font-weight: 800;
                                                    letter-spacing: -1.2px;
                                                    color: #2832f9;
                                                "
                                            >
                                                hushd.lol
                                            </div>

                                            <h1
                                                style="
                                                    margin: 0 0 14px;
                                                    font-size: 24px;
                                                    line-height: 1.3;
                                                    font-weight: 700;
                                                    letter-spacing: -0.65px;
                                                    color: #171717;
                                                "
                                            >
                                                Your
                                                <span
                                                    style="
                                                        background-color: #e7e7eb;
                                                        padding: 1px 4px;
                                                        border-radius: 2px;
                                                    "
                                                >
                                                    hushd.lol
                                                </span>
                                                sign-in code
                                            </h1>

                                            <p
                                                style="
                                                    margin: 0 0 26px;
                                                    font-size: 14px;
                                                    line-height: 1.5;
                                                    color: #62626a;
                                                "
                                            >
                                                Enter this 6-digit code to finish
                                                signing in. It expires in
                                                <strong style="color: #171717;">
                                                    10 minutes.
                                                </strong>
                                            </p>

                                            <div
                                                style="
                                                    margin: 0 0 24px;
                                                    font-size: 27px;
                                                    line-height: 1.3;
                                                    font-weight: 700;
                                                    letter-spacing: 8px;
                                                    color: #171717;
                                                "
                                            >
                                                ${code}
                                            </div>

                                            <p
                                                style="
                                                    margin: 0;
                                                    font-size: 12px;
                                                    line-height: 1.5;
                                                    color: #85858d;
                                                "
                                            >
                                                If you didn't try to sign in, you
                                                can ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        width: 100%;
                                        max-width: 560px;
                                    "
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                padding: 20px 16px 0;
                                                font-size: 11px;
                                                line-height: 1.8;
                                                color: #77777f;
                                            "
                                        >
                                            <span
                                                style="
                                                    font-weight: 700;
                                                    color: #5f5f67;
                                                "
                                            >
                                                hushd.lol
                                            </span>

                                            <span
                                                style="
                                                    margin: 0 8px;
                                                    color: #b1b1b6;
                                                "
                                            >
                                                ·
                                            </span>

                                            <a
                                                href="https://hushd.lol"
                                                style="
                                                    color: #77777f;
                                                    text-decoration: none;
                                                "
                                            >
                                                Open Dashboard
                                            </a>

                                            <span
                                                style="
                                                    margin: 0 8px;
                                                    color: #b1b1b6;
                                                "
                                            >
                                                ·
                                            </span>

                                            <a
                                                href="https://hushd.lol/docs"
                                                style="
                                                    color: #77777f;
                                                    text-decoration: none;
                                                "
                                            >
                                                Docs
                                            </a>

                                            <div
                                                style="
                                                    margin-top: 6px;
                                                    color: #9a9aa1;
                                                "
                                            >
                                                © ${new Date().getFullYear()} hushd.lol
                                            </div>
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