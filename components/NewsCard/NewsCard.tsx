import React from 'react';
import { 
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from 'next/image';
import News from "@/types/News";
import Link from 'next/link';

export default function NewsCard({ news }: { news: News }) {
  let imagePreview = '';
  if (news.image) {
    imagePreview = news.image;
  }
  else if (news.favicon) {
    imagePreview = news.favicon;
  }
  else {
    imagePreview = '/placeholder.png'; // Default image if none is available
  }
  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-2'>
        <Link href={news.url || ''} target="_blank" rel="noopener noreferrer" className=''>
          <Image
            src={imagePreview} // Replace with your image path
            alt="News Image"
            width={500}
            height={300}
            className="rounded-md"
            unoptimized={true} 
          />
        </Link>
        <CardTitle>{news.title}</CardTitle>
        <CardDescription className="line-clamp-3">{(news.description)? news.description : news.title}</CardDescription>
      </CardContent>
    </Card>
  )
}
