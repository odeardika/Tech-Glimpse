import News from "@/types/News";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

const articleCard = (article: News | undefined): string => {
    if (!article) return "";
    return `
<tr><td style="padding-bottom:16px;">
  <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8e4df;border-radius:12px;overflow:hidden;">
    <tr><td style="padding:0;line-height:0;font-size:0;">
      ${article.image
        ? `<img src="${article.image}" alt="${(article.title ?? "").replace(/"/g, "&quot;")}" width="560" style="display:block;width:100%;height:auto;border-radius:12px 12px 0 0;">`
        : ""}
    </td></tr>
    <tr><td style="padding:20px 20px 20px;">
      <p style="margin:0 0 8px;font-size:17px;font-weight:700;line-height:1.4;color:#1a1a2e;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:-0.3px;">${article.title ?? ""}</p>
      <p style="margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.65;font-family:'Helvetica Neue',Arial,sans-serif;">${article.description ?? ""}</p>
      <a href="${article.url ?? "#"}" style="display:inline-block;background:#5b5bd6;color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;padding:9px 18px;border-radius:6px;font-family:'Helvetica Neue',Arial,sans-serif;mso-padding-alt:9px 18px;">Read article &rarr;</a>
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</td></tr>`;
};

export default function template(articles: News[], unsubscribeUrl: string): string {
    const year = new Date().getFullYear();
    const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Tech Glimpse — Daily Newsletter</title>
  <style>
    @media only screen and (max-width:620px) {
      .container { width:100% !important; }
      .inner-pad { padding:16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#ffffff;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
  <tr><td align="center" style="padding:40px 20px 60px;">

    <table class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;border:1px solid #e8e4df;border-radius:12px;overflow:hidden;">

      <!-- HEADER -->
      <tr><td style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;font-family:'Helvetica Neue',Arial,sans-serif;">Tech Glimpse</p>
              <p style="margin:3px 0 0;font-size:11px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Daily Newsletter</p>
            </td>
            <td align="right" valign="middle">
              <p style="margin:0;font-size:12px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;">${dateStr}</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- ACCENT BAND -->
      <tr><td style="background:#5b5bd6;padding:14px 28px;">
        <p style="margin:0;font-size:13px;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.5;">Your curated dose of tech &mdash; the stories worth reading today.</p>
      </td></tr>

      <!-- ARTICLES -->
      <tr><td style="background:#ffffff;padding:24px 20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${articleCard(articles[0])}
          ${articleCard(articles[1])}
          ${articleCard(articles[2])}
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="background:#ffffff;padding:8px 20px 28px;text-align:center;">
        <a href="${BASE_URL}" style="display:inline-block;border:1.5px solid #1a1a2e;color:#1a1a2e;text-decoration:none;font-size:13px;font-weight:500;padding:10px 24px;border-radius:6px;font-family:'Helvetica Neue',Arial,sans-serif;">Browse all news &rarr;</a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#1a1a2e;border-radius:0 0 12px 12px;padding:20px 28px;text-align:center;">
        <p style="margin:0 0 6px;font-size:11px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;">
          &copy; ${year} Tech Glimpse by <a href="https://odeardika.com" style="color:#8b8bbc;">Ode Ardika</a>. All rights reserved.
        </p>
        <p style="margin:0;font-size:11px;color:#8b8bbc;font-family:'Helvetica Neue',Arial,sans-serif;">
          <a href="${unsubscribeUrl}" style="color:#8b8bbc;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
