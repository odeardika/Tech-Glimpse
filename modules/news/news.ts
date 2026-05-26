import News from "@/types/News";
import * as cheerio from 'cheerio';
import axios from "axios";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

function getFavicon(url: string, favicon: string) {
    const urlParts = url.split('/');
    return urlParts[0] + '//' + urlParts[2] + favicon;
}

export async function getNewsMetadata(url: string) {
    try {
        const html = await axios.get(url);
        const $ = cheerio.load(html.data);

        const title = $('meta[property="og:title"]').attr('content');
        const description = $('meta[property="og:description"]').attr('content');
        const tempImage = $('meta[property="og:image"]').attr('content');
        const favicon = $('link[rel="shortcut icon"]').attr('href');

        const image = tempImage ? (tempImage.startsWith('http') ? tempImage : new URL(tempImage, url).href) : null;

        return {
            title,
            description,
            image,
            favicon: favicon ? getFavicon(url, favicon) : null,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // network error — expected for many HN links
        } else if (error instanceof TypeError && error.message === 'Invalid URL') {
            // invalid url
        } else if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'ECONNRESET') {
            // connection reset
        }
        return { status: 500, message: 'Error fetching metadata' };
    }
}

export async function getListNews(url: string) {
    const data = await fetch(url);
    return data.json();
}

interface HNItem {
    id: number;
    title?: string;
    url?: string;
    score?: number;
    descendants?: number;
    by?: string;
    time?: number;
    type?: string;
    text?: string;
}

function mapType(type: string | undefined): News["type"] {
    if (type === "job") return "job";
    if (type === "poll") return "poll";
    return "story";
}

async function fetchHNItem(id: number): Promise<HNItem> {
    const res = await axios.get(`${HN_BASE}/item/${id}.json?print=pretty`);
    return res.data as HNItem;
}

async function buildNewsItem(item: HNItem, fetchMeta = true): Promise<News> {
    const url = item.url ?? "";
    const base: News = {
        id: item.id,
        title: item.title ?? item.text?.replace(/<[^>]+>/g, "").slice(0, 120) ?? "",
        url,
        description: null,
        image: null,
        favicon: null,
        score: item.score,
        descendants: item.descendants,
        by: item.by,
        time: item.time,
        type: mapType(item.type),
    };

    if (!fetchMeta || !url) return base;

    const metadata = await getNewsMetadata(url);
    if ("status" in metadata) return base;

    return {
        ...base,
        description: metadata.description ?? null,
        image: metadata.image ?? null,
        favicon: metadata.favicon ?? null,
    };
}

export async function getNews(): Promise<News[]> {
    const ids: number[] = await getListNews(`${HN_BASE}/topstories.json?print=pretty`);
    return Promise.all(ids.slice(0, 30).map((id) => fetchHNItem(id).then((item) => buildNewsItem(item, true))));
}

export async function getNewsByIds(
    ids: number[],
    fetchMeta = true
): Promise<News[]> {
    return Promise.all(
        ids.map((id) => fetchHNItem(id).then((item) => buildNewsItem(item, fetchMeta)))
    );
}

export async function getNewsByFeed(
    feed: "topstories" | "beststories" | "newstories" | "askstories" | "showstories" | "jobstories",
    limit = 30
): Promise<News[]> {
    const ids: number[] = await getListNews(`${HN_BASE}/${feed}.json?print=pretty`);
    const isAskOrJob = feed === "askstories" || feed === "jobstories" || feed === "showstories";
    return Promise.all(
        ids.slice(0, limit).map((id) =>
            fetchHNItem(id).then((item) => buildNewsItem(item, !isAskOrJob))
        )
    );
}
