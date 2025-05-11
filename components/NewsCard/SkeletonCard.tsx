import React from 'react';
import { 
  Card,
} from "@/components/ui/card";
import { Skeleton } from '../ui/skeleton';

export default function SkelotonCard() {
  return (
    <Card className='h-full flex p-4'>
        <Skeleton className='w-full h-24 rounded-md'/>
        <Skeleton className='w-full h-6 rounded-md'/>
        <Skeleton className='w-full h-6 rounded-md'/>
    </Card>
  )
}
