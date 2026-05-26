import { NextRequest } from "next/server";
import { getNewsByIds } from "@/modules/news/news";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const idsParam = searchParams.get("ids") ?? "";
    const feed = searchParams.get("feed") ?? "topstories";

    const ids = idsParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0)
        .slice(0, 10); // hard cap per batch

    if (ids.length === 0) {
        return Response.json({ error: "no valid ids" }, { status: 400 });
    }

    const news = await getNewsByIds(ids, false); // always bare — client enriches lazily

    return Response.json({ news });
}
