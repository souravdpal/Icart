import React from 'react'

const CardSkeleton = () => {
    return (
        <div
            aria-busy="true"
            aria-label="Loading product"
            className='gap-3 max-w-sm rounded-xl border border-slate-200 p-6 shadow-sm bg-white animate-pulse'
        >
            {/* Image placeholder (same size as the real card: h-60 w-60) */}
            <div className='ml-8 h-60 w-60 rounded-2xl bg-slate-200' />

            {/* Title placeholder */}
            <div className='p-2 flex justify-center'>
                <div className='h-4 w-40 rounded bg-slate-200' />
            </div>

            {/* Rating placeholder */}
            <div className='translate-x-27 m-2 flex gap-3 items-center'>
                <div className='h-6 w-6 rounded-full bg-slate-200' />
                <div className='h-4 w-8 rounded bg-slate-200' />
            </div>

            {/* Price placeholder */}
            <div className='flex gap-1 p-3 translate-x-27 items-center'>
                <div className='h-5 w-5 rounded-full bg-slate-200' />
                <div className='h-5 w-16 rounded bg-slate-200' />
            </div>

            {/* Description placeholder (two lines) */}
            <div className='p-2 flex flex-col items-center gap-2'>
                <div className='h-3 w-56 rounded bg-slate-200' />
                <div className='h-3 w-40 rounded bg-slate-200' />
            </div>
        </div>
    )
}

export default CardSkeleton