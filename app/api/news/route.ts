import { getNews } from "@/modules/news/news";
import News from "@/types/News";

export async function GET() {
  const news: News[] = await getNews();

  if (news.length > 0) {
    return Response.json({
      status: 200,
      message: "success",
      news: news,
    });
  }
  return Response.json({
    status : 400,
    message : "failed to fetch news"
  })
}
