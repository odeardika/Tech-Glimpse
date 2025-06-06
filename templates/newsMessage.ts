import News from "@/types/News";

export default function template (article : News[]) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Newsletter Email</title>
</head>
<body style="margin:0; padding:0; background:#fff;">
    <table width="100%" bgcolor="#fff" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:40px auto; padding:24px; border-collapse:collapse;">
                    <tr>
                        <td align="center" style="font-size:24px; font-weight:bold; color:#2d3a4a; font-family:Arial, sans-serif; padding-bottom:4px;">
                            Tech Glimpse
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="color:#4a5a6a; font-family:Arial, sans-serif; font-size:16px; padding-bottom:3rem;">
                            Stay updated with the latest technology news every day
                        </td>
                    </tr>
                    <tr>
                        <td style="font-family:Arial, sans-serif; font-size:16px; color:#444444; padding-right: 1.5rem; padding-left: 1.5rem;">
                            <!-- Article 1 -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #cccccc;border-radius: 1rem; margin-bottom:16px;">
                                <tr>
                                    <td style="padding:16px;">
                                        <h2 style="font-size:18px; margin:0 0 8px 0; color:#2d3a4a; font-family:Arial, sans-serif;">${article[0]?.title}</h2>
                                        <img src="${article[0]?.image}" alt="Article's Image" style="display:block; max-width:100%; height:auto; margin:0 0 12px 0;">
                                        <p style="margin:0; color:#444444;">${article[0]?.description}</p>
                                        <span style="color:#444444;">For full article <a href="${article[0]?.url}" style="margin-top:1px; text-decoration:none; color:#7d7d7d">Click Here</a></span>
                                    </td>
                                </tr>
                            </table>
                            <!-- Article 2 -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #cccccc; border-radius: 1rem; margin-bottom:16px;">
                                <tr>
                                    <td style="padding:16px;">
                                        <h2 style="font-size:18px; margin:0 0 8px 0; color:#2d3a4a; font-family:Arial, sans-serif;">${article[1]?.title}</h2>
                                        <img src="${article[1]?.image}" alt="Article's Image" style="display:block; max-width:100%; height:auto; margin:0 0 12px 0;">
                                        <p style="margin:0; color:#444444;">${article[1]?.description}</p>
                                        <span style="color:#444444;">For full article <a href="${article[1]?.url}" style="margin-top:1px; text-decoration:none; color:#7d7d7d">Click Here</a></span>
                                    </td>
                                </tr>
                            </table>
                            <!-- Article 3 -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #cccccc; border-radius: 1rem; margin-bottom:16px;">
                                <tr>
                                    <td style="padding:16px;">
                                        <h2 style="font-size:18px; margin:0 0 8px 0; color:#2d3a4a; font-family:Arial, sans-serif;">${article[2]?.title}</h2>
                                        <img src="${article[2]?.image}" alt="Article's Image" style="display:block; max-width:100%; height:auto; margin:0 0 12px 0;">
                                        <p style="margin:0; color:#444444;">${article[2]?.description}</p>
                                        <span style="color:#444444;">For full article <a href="${article[2]?.url}" style="margin-top:1px; text-decoration:none; color:#7d7d7d">Click Here</a></span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:12px; color:#888888; font-family:Arial, sans-serif; padding-top:2rem; padding-bottom:2rem;">
                            &copy; 2025 Ode Ardika. All rights reserved.<br>
                            If you want more news <a href="https://tech-glimpse.odeardika.my.id/" style="color:#888888;">click here</a>.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>    
`
}