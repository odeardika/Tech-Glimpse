import { NextRequest } from "next/server";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

const VALID_FEEDS = ["topstories", "beststories", "newstories", "askstories", "showstories", "jobstories"] as const;
type Feed = typeof VALID_FEEDS[number];

function isValidFeed(feed: string): feed is Feed {
    return (VALID_FEEDS as readonly string[]).includes(feed);
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const feedParam = searchParams.get("feed") ?? "topstories";
    const feed: Feed = isValidFeed(feedParam) ? feedParam : "topstories";

    try {
        const res = await fetch(`${HN_BASE}/${feed}.json?print=pretty`, {
            next: { revalidate: 300 }, // cache 5 min — ID list changes slowly
        });
        const ids: number[] = await res.json();
        return Response.json({ ids, feed });
    } catch {
        return Response.json({ error: "failed to fetch IDs" }, { status: 500 });
    }
}
