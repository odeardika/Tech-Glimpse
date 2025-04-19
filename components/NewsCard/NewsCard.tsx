import React from 'react';
import { 
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from 'next/image';

export default function NewsCard() {
  return (
    <Card className=''>
      <CardContent className='flex flex-col gap-2'>
        <Image
          src="/placeholder.png" // Replace with your image path
          alt="News Image"
          width={500}
          height={300}
          className="rounded-md"
        />
        <CardTitle>News Title</CardTitle>
        <CardDescription>Brief description of the news article.</CardDescription>
      </CardContent>
    </Card>
  )
}
