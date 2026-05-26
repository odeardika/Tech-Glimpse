import { NextRequest } from "next/server";
import { getNewsMetadata } from "@/modules/news/news";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return Response.json({ error: "url required" }, { status: 400 });
    }

    const meta = await getNewsMetadata(url);

    if ("status" in meta) {
        return Response.json({ image: null, description: null, favicon: null });
    }

    return Response.json({
        image: meta.image ?? null,
        description: meta.description ?? null,
        favicon: meta.favicon ?? null,
    });
}
