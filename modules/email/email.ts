import { Resend } from "resend";
import News from "@/types/News";
import emailTemplate from "@/templates/newsMessage";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tech-glimpse.odeardika.com";

const sendEmail = async (articles: News[], usersEmail: string): Promise<void> => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = `Tech Glimpse <${process.env.RESEND_FROM_EMAIL ?? "tech-glimpse-newsletter@odeardika.com"}>`;

    const recipients = usersEmail
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

    await Promise.all(
        recipients.map((email) => {
            const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
            return resend.emails.send({
                from,
                to: email,
                subject: "Daily Newsletter",
                html: emailTemplate(articles, unsubscribeUrl),
            });
        })
    );
};

export default sendEmail;
