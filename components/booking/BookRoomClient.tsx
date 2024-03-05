'use client'

import useBookRoom from '@/hooks/useBookRoom'
import {StripeElementsOptions, loadStripe} from '@stripe/stripe-js'
import  {Elements} from '@stripe/react-stripe-js'
import RoomCard from '../room/RoomCard'
import RoomPaymentForm from './RoomPaymentForm'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const stripePromise =  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLICHABLE_KEY as string)
const BookingRoomClient = () => {
    const {bookingRoomData, clientSecret} = useBookRoom()
    const [paymentSucess, setPaymentSucess ] = useState(false)
    const [pageLoaded, setPageLoaded ] = useState(false)
    const {theme} = useTheme()
    const router = useRouter()

     useEffect(() => {
        setPageLoaded(true)
     }, [])
     

    const options: StripeElementsOptions= {
        clientSecret,
        appearance: {
            theme: theme === 'dark' ? 'night' : 'stripe',
            labels: 'floating'
        }

    }

    const handleSetPaymentSucesss = (value: boolean) => {
        setPaymentSucess(value)
    }

    if(pageLoaded && !paymentSucess  && (!bookingRoomData || !clientSecret)) return <div className="flex items-center flex-col gap-4">
        <div className="text-rose-500">Oops This Page Could Not Load Properly....</div>
         <div className="flex items-center gp-4">
              <Button variant="outline" onClick={() =>  router.push('/')}>Go Home</Button>
              <Button onClick={() =>  router.push('/my-bookings')}>View Bookings</Button>
         </div>
    </div>

    if(paymentSucess) return <div className='flex flex-col items-center gap-4'>
        <div className="text-teal-500 text-center">Payment Sucessfull</div>
        <Button onClick={() =>  router.push('/my-bookings')}>View Bookings</Button>
    </div>
    return (
         <div className='max-w-[700px] mx-auto'>
            {clientSecret && bookingRoomData && <div>
          <h3 className="text-2xl font-semibold mb-4">Complete payment to reserve this room!</h3>
           <div className="mb-6">
             <RoomCard room={bookingRoomData.room} />
           </div>
            <Elements stripe={stripePromise} options={options}>
               <RoomPaymentForm  clientSecret={clientSecret} handleSetPaymentSucesss={handleSetPaymentSucesss}/>
            </Elements>
      </div>}
    </div>
     );
}
 
export default BookingRoomClient;

