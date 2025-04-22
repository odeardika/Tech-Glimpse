'use server'
import { getNews } from "@/lib/api/getNews/getNews"
 
export async function getTodayNews() {

    const news = await getNews();
    return news;
}