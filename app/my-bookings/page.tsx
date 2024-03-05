import { getBookingsByHotelOwnerId } from '@/actions/getBookingsByHotelOwnerId'
import { getBookingsByUserId } from '@/actions/getBookingsByUserId'
import MyBookingsClient from '@/components/booking/MyBookingsClient'

const MyBookings =async  () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId()
   const bookingsIHaveMade = await getBookingsByUserId()
  return (
    <div className='flex flex-col gap-10'>
      {!!bookingsIHaveMade?.length && <div>
          <h2 className="text md-text-2xl font-semibold mb-6 mt-2 ">Here are your bookings on your Properties</h2>
          <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-y-6">
             {bookingsIHaveMade.map(booking => <MyBookingsClient key={booking.id} booking={booking}/>)}
          </div>
        </div>}

         {!!bookingsFromVisitors?.length && <div>
          <h2 className="text md-text-2xl font-semibold mb-6 mt-2 ">Here are your bookings on VISITORS Properties</h2>
          <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-y-6">
             {bookingsFromVisitors.map(booking => <MyBookingsClient key={booking.id} booking={booking}/>)}
          </div>
        </div>}
    </div>
  )
}

export default MyBookings

