import React from 'react'
import CardSkeleton from './card_skeleton'


const Subcard = () => {
  return (
    <div>
      <div className='ml-2 flex gap-2 flex-wrap overflow-hidden'>
        < CardSkeleton />
        < CardSkeleton />
        < CardSkeleton />
        < CardSkeleton />
        < CardSkeleton />
      </div>
    </div>
  )
}

export default Subcard
