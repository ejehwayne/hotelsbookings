 'use client'

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";
import { FaSpa, FaSwimmer } from "react-icons/fa";


const HotelCard = ({hotel}: {hotel: HotelWithRooms}) => {

    const {getCountryByCode} = useLocation();
    const country = getCountryByCode(hotel.country)
    const pathname = usePathname()
    const router = useRouter()
    const isMyhotels = pathname.includes('my-hotels')
    return ( <div onClick={() => !isMyhotels && router.push(`/hotel-details/${hotel.id}`)} 
     className={cn('col-span-1 cursor-pointer transition hover:scale-105', isMyhotels && 'cursor-default')}
    >
     <div className="flex gap-2 bg-background/50 border-primary/10 rounded-lg">
     <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px ] rounded-s-lg">
        <Image 
        fill
        src={hotel.image}
        alt={hotel.title}
        className= 'w-full h-full object-cover'
        />
     </div>
     <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
        <h3 className="font-semibold ">{hotel.title}</h3>
        <div className="text-primary/90"> {hotel.description.substring(0, 45)}...</div>
        <div className="text-primary/90">
            <AmenityItem>
                 <MapPin className="w-4 h-4 "/>{country?.name},{hotel.city}
            </AmenityItem>
            {hotel.swimmingPool && <AmenityItem>
                <FaSwimmer size={18}/>Pool
            </AmenityItem>}
            {hotel.gym && <AmenityItem><Dumbbell className="w-4 h-4"/> gym </AmenityItem>}
            {hotel.spa && <AmenityItem><FaSpa size={18}/> Spa </AmenityItem>}
        </div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                {hotel?.rooms[0]?.roomPrice && <>
                 <div className="font-semibold text-base">${hotel?.rooms[0].roomPrice}</div>
                 <div className="text-xs">/ 24hrs</div>
                </>}
            </div>
            {isMyhotels && <Button variant='outline' onClick={() => router.push(`hotel/${hotel.id}`)}>Edit</Button>}
         </div>
     </div>
     </div>
    </div> );
}
                 
export default HotelCard;





