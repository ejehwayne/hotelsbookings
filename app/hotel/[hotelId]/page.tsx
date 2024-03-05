import { getHotelById } from "@/actions/getHotelById";
import AddHotel from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs";


interface HotelPageProps {
    params: {
        hotelId: string
    }
}

const Hotel = async ({params} : HotelPageProps) => {
   const hotel = await getHotelById (params.hotelId)
   const {userId} = auth()

   if(!userId) return <div>Not Authenticated...</div>

   if(hotel && hotel?.userId !== userId)
       return <div>Access Denied....</div> 
    return ( 
        <div className="">
            <AddHotel hotel={hotel}/>
        </div>
     );
}
 
export default Hotel;