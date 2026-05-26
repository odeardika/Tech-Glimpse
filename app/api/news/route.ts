import { getNewsByFeed } from "@/modules/news/news";
import News from "@/types/News";
import { NextRequest } from "next/server";

const VALID_FEEDS = ["topstories", "beststories", "newstories", "askstories", "showstories", "jobstories"] as const;
type Feed = typeof VALID_FEEDS[number];

function isValidFeed(feed: string): feed is Feed {
    return VALID_FEEDS.includes(feed as Feed);
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const feedParam = searchParams.get("feed") ?? "topstories";

    const feed: Feed = isValidFeed(feedParam) ? feedParam : "topstories";

    const news: News[] = await getNewsByFeed(feed);

    if (news.length > 0) {
        return Response.json({ status: 200, message: "success", news, feed });
    }

    return Response.json({ status: 400, message: "failed to fetch news" }, { status: 400 });
}
