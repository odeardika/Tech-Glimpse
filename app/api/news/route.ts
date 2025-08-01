import { getNews } from "@/modules/news/news"
import News from "@/types/News"

export async function GET() {
    const news : News[] = await getNews();

    return Response.json({
        status : 200,
        message : "success",
        news : news
    })
}