'use client'
import { useState } from 'react';
import Image from 'next/image';
import smallerIcon from '@/public/icons/SegmentIcon-Smaller.svg';
import biggerIcon from '@/public/icons/SegmentIcon-Bigger.svg';

type props = {
    cb : (value : number) => void
}

function SegmentedControl(props : props) {

    const [segmentControlSelected,setSegmentControlSelected] = useState(0);
    
    
  return (
    <>
        <div className='flex justify-end p-4'>
            <div className={`border-2 border-gray-300 px-4 py-1 rounded-l-lg hover:cursor-pointer  ${segmentControlSelected === 1? "hover:bg-gray-200": "bg-gray-300"}`}
                onClick={() => {
                    props.cb(0)
                    setSegmentControlSelected(0)}}
            >
                <Image 
                className='w-8'
                src={smallerIcon} 
                width={0}
                height={0}
                alt='icon'
                />
            </div>
            <div className={`border-2 border-gray-300 px-4 py-1 rounded-r-lg hover:cursor-pointer  ${segmentControlSelected === 0? "hover:bg-gray-200": "bg-gray-300"}`}
            onClick={() => {
                props.cb(1)
                setSegmentControlSelected(1)}}
            >
                <Image 
                className='w-8'
                src={biggerIcon} 
                width={0}
                height={0}
                alt='icon'
                />
            </div>
        </div>
    </>
  )
}

export default SegmentedControl