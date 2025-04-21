import Image from "next/image";
import NewsCard from "@/components/NewsCard/NewsCard";

export default function Home() {
  return (
    <div className="px-8 md:px-24">
      <header className="flex flex-col items-start gap-2 justify-between py-8 ">
        <h1 className="text-4xl font-semibold">Tech Glimpse</h1>
        <h2 className="text-xl text-slate-600">Stay updated with the latest technology news every day</h2>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 ">
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <NewsCard />

      </div>
    </div>
  );
}
