import sendEmail from "@/modules/email/email";
import { getUserEmail } from "@/modules/sheets/server";
import { getNewsByFeed } from "@/modules/news/news";

export async function GET() {
    const articles = await getNewsByFeed("topstories");
    const filteredArticles = articles.filter(
        (a) => a.description && a.description.length >= 20 && a.image
    );

    const receiverUser = await getUserEmail();
    await sendEmail(filteredArticles, receiverUser);

    return Response.json({ success: true });
}
