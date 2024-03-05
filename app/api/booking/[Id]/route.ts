import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    {params}: {params: {Id : string}}){
  try {
       const {userId} = auth();

       if(!params.Id){
        return new NextResponse("Payment ID is Required", {status: 400})
       }

       if( !userId) {
        return new NextResponse('Unauthorised', {status:401})
       }

       const booking = await prismadb.booking.update({
         where: {
            paymentIntentId: params.Id,
        },
        data:{
          paymentStatus: true 
        },
       })

       return NextResponse.json(booking); 

  } catch (error) {
      console.log('Error at /api/booking/Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500} )
  }  

}


export async function DELETE(req: Request, {params}: {params: {Id : string}}){
  try {
       const {userId} = auth();

       if(!params.Id){
        return new NextResponse("Booking ID is Required", {status: 400})
       }

       if( !userId) {
        return new NextResponse('Unauthorised', {status:401})
       }

       const booking = await prismadb.booking.delete({
         where: {
            id: params.Id,
        }
        
       })

       return NextResponse.json(booking); 

  } catch (error) {
      console.log('Error at /api/booking/Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500} )
  }
}


export async function GET(req: Request, {params}: {params: {Id : string}}){
  try {
       const {userId} = auth();

       if(!params.Id){
        return new NextResponse("Booking ID is Required", {status: 400})
       }

       if( !userId) {
        return new NextResponse('Unauthorised', {status:401})
       }
         
       const yesterday = new Date()
        yesterday.setDate(yesterday.getDate( ) - 1)

       const bookings = await prismadb.booking.findMany({
         where: {
             paymentStatus: true,
            roomId: params.Id,
            endDate: {
              gt: yesterday
            }
        }
        
       })

       return NextResponse.json(bookings); 

  } catch (error) {
      console.log('Error at /api/booking/Id GET', error)
        return new NextResponse('Internal Server Error', {status: 500} )
  }
}