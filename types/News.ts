export default interface News {
    id: number;
    title: string;
    url: string;
    description: string | null;
    image: string | null;
    favicon: string | null;
    score?: number;
    descendants?: number;
    by?: string;
    time?: number;
    type?: "story" | "job" | "ask" | "show" | "poll";
}
