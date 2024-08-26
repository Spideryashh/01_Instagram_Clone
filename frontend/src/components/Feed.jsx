import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1  flex flex-col items-center pl-[20%] max-md:pl-[10%]'>
        <Posts />
    </div>
  )
}

export default Feed