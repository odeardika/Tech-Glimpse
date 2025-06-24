import sendEmail from "@/modules/email/email";
import axios from "axios";
import { getUserEmail } from "@/modules/supabase/server";
import News from "@/types/News";

export async function GET() {
    // get artcle
    const article : News[] = (await axios.get(process.env.NEXT_PUBLIC_SERVER_ENDPOINT+"news")).data;
    const fillteredArticle = article.filter(article => (article.description && (article.description.length >= 20)) && (article.image))

    // get user email
    const receiverUser = await getUserEmail();
    
    // get sender email and password
    const email = String(process.env.NEXT_PUBLIC_EMAIL);
    const pass = String(process.env.NEXT_PUBLIC_PASS);

    const info =  await sendEmail(
        fillteredArticle,
        receiverUser,
        {
            user:email,
            pass:pass
        }
    );

    // const info = await sendEmail(article);
    return Response.json(info);

}