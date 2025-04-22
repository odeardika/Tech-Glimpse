export default interface News {
    id: number;
    title: string;
    url: string;
    description: string | null;
    image: string | null;
    favicon: string | null;
}