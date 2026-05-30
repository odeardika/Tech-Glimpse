import nodemailer from 'nodemailer';
import News from "@/types/News";
import emailTemplate from "@/templates/newsMessage";

const BASE_URL = "https://tech-glimpse.odeardika.my.id";

const sendEmail = async (
    articles: News[],
    usersEmail: string,
    authUser: { user: string; pass: string }
): Promise<void> => {
    const recipients = usersEmail
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: authUser.user,
            pass: authUser.pass,
        },
    });

    await Promise.all(
        recipients.map((email) => {
            const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
            return transporter.sendMail({
                from: "Tech Glimpse Newsletter",
                to: email,
                subject: "Daily Newsletter",
                html: emailTemplate(articles, unsubscribeUrl),
            });
        })
    );
};

export default sendEmail;
