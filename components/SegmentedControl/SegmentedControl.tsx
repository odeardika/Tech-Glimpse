import React from 'react';
import Image from 'next/image';
import smallerIcon from '@/public/icons/SegmentIcon-Smaller.svg';
import biggerIcon from '@/public/icons/SegmentIcon-Bigger.svg';
type props = {
    selected : number
}

function SegmentedControl(props : props) {
  return (
    <>
        <div className='flex justify-end p-4'>
            <div className={`border-2 border-gray-300 px-4 py-1 rounded-l-lg hover:cursor-pointer  ${props.selected === 1? "hover:bg-gray-200": "bg-gray-300"}`}>
                <Image 
                className='w-8'
                src={smallerIcon} 
                width={0}
                height={0}
                alt='icon'
                />
            </div>
            <div className={`border-2 border-gray-300 px-4 py-1 rounded-r-lg hover:cursor-pointer  ${props.selected === 0? "hover:bg-gray-200": "bg-gray-300"}`}>
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