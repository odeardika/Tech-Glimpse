"use client"
import { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard/NewsCard";
import PopupMenu from "@/components/PopupMenu/PopupMenu";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import axios from "axios";
import News from "@/types/News";
import SkelotonCard from "@/components/NewsCard/SkeletonCard";

export default function Home() {
  const [selectedSegment, setSelectedSegment] = useState(0)
  const [news,setNews] = useState<News[] | null>()
  
  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_SERVER_ENDPOINT+"news")
    .then(r => setNews(r.data) )
  },[])

  
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

      <SegmentedControl cb={(value:number) => {setSelectedSegment(value)}}/>
      <div className={`grid gap-4 ${selectedSegment === 0? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5":"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} `}>
        { !news?   
        "12345".split("").map((_, index) => (
          <SkelotonCard key={index} />
        ))
        : 
        news.map((item) => (
          <div key={item.id} className="flex flex-col gap-4">
            <NewsCard news={item} />
          </div>
        ))}

      </div>
      
    </div>
  );
}
