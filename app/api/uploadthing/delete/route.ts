import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi ();

export async function POST(req: Request) {
    const {userId} = auth()

    if (!userId) return new NextResponse("Unauthorised", {status:401});

    const {imageKey} = await req.json();

    try {
        const res = await utapi.deleteFiles(imageKey)
        return NextResponse.json(res)
    } catch (error) {
       console.log('error at uploadthing/dele:', error);
       return new NextResponse('Internal Server Error', {status:500}) ; 
    }
}