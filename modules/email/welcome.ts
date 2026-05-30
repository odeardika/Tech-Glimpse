import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "tech-glimpse-newsletter@odeardika.com";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tech-glimpse.odeardika.com";

const welcomeTemplate = (email: string): string => {
    const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Welcome to Tech Glimpse</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;padding:40px 0 60px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:1px solid #e8e4df;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;font-family:'Helvetica Neue',Arial,sans-serif;">Tech Glimpse</p>
          <p style="margin:4px 0 0;font-size:12px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:0.5px;text-transform:uppercase;">Your daily dose of tech, curated.</p>
        </td></tr>

        <!-- Accent band -->
        <tr><td style="background:#5b5bd6;padding:3px 0;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px 32px;">
          <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">Welcome aboard 👋</p>
          <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
            You&rsquo;re now part of <strong style="color:#1a1a2e;">Tech Glimpse</strong> — a daily digest of the best tech stories, handpicked from Hacker News and beyond.
          </p>

          <!-- What to expect box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1a1a2e;letter-spacing:0.3px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">What to expect</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#475569;font-family:'Helvetica Neue',Arial,sans-serif;">
                    <span style="color:#5b5bd6;margin-right:8px;">&#10003;</span> Daily newsletter — fresh stories every morning
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#475569;font-family:'Helvetica Neue',Arial,sans-serif;">
                    <span style="color:#5b5bd6;margin-right:8px;">&#10003;</span> No spam, no noise — only what matters
                  </td>
                </tr>
                <tr>
                  <td style="padding:5px 0;font-size:14px;color:#475569;font-family:'Helvetica Neue',Arial,sans-serif;">
                    <span style="color:#5b5bd6;margin-right:8px;">&#10003;</span> Unsubscribe anytime, instantly
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0">
            <tr><td>
              <a href="${BASE_URL}" style="display:inline-block;background:#5b5bd6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px;font-family:'Helvetica Neue',Arial,sans-serif;">
                Browse today&rsquo;s news &rarr;
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1a1a2e;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;">
            &copy; ${year} Tech Glimpse by <a href="https://odeardika.com" style="color:#8b8bbc;text-decoration:underline;">Ode Ardika</a>. All rights reserved.
          </p>
          <p style="margin:0;font-size:12px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;">
            You received this because you subscribed at <a href="${BASE_URL}" style="color:#8b8bbc;text-decoration:underline;">${BASE_URL.replace(/^https?:\/\//, "")}</a><br>
            <a href="${unsubscribeUrl}" style="color:#8b8bbc;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const sendWelcomeEmail = async (email: string): Promise<void> => {
    await resend.emails.send({
        from: `Tech Glimpse <${FROM}>`,
        to: email,
        subject: "Welcome to Tech Glimpse 👋",
        html: welcomeTemplate(email),
    });
};
