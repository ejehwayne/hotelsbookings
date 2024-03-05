import { getHotelByUserId } from '@/actions/getHotelsByUserId'
import HotelList from '@/components/hotel/HotelList'
import React from 'react'

const MyHotels = async () => {

    const hotels = await getHotelByUserId()

    if(!hotels) return <div className="">No Hotel Found</div>
  return (
    <div>
        <h2 className='text-2xl font-semibold'>Here are your hotels</h2>
         <HotelList hotels={hotels} />
    </div>
  )
}

export default MyHotels