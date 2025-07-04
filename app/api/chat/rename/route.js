import connectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const {userId} = getAuth(req)
        if(!userId){
            return NextResponse.json({success:false,message:"User Not Authenticated"})

        }
        const {chatId,name}  = await req.json();
        //Connect to database and update the chat name

        await connectDb();
        await Chat.findByIdAndUpdate({_id:chatId.userId},{name});
        return NextResponse.json({success:true,message:"Chat Renamed"})
    } catch (error) {
       return NextResponse.json({success:false,error:error.message}) 
    }
}