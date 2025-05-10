import NewsCard from "@/components/NewsCard/NewsCard";
import PopupMenu from "@/components/PopupMenu/PopupMenu";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import { getTodayNews } from "./get-news";

export default async function Home() {
  const news = await getTodayNews();

  return (
    <div className="px-8 md:px-24">
      <header className="flex justify-between py-8 items-start md:items-center ">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl md:text-4xl font-semibold">Tech Glimpse</h1>
          <h2 className="text-base md:text-xl text-slate-600">Stay updated with the latest technology news every day</h2>
        </div>
        <div className="pt-2 md:pt-0">
          <PopupMenu />
        </div>

      </header>

      <SegmentedControl selected={1} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 ">
        {news.map((item) => (
          <div key={item.id} className="flex flex-col gap-4">
            <NewsCard news={item} />
          </div>
        ))}

      </div>
      
    </div>
  );
}
