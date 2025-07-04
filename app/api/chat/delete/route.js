import connectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const {userId} = getAuth(req)
        const {chatId} = await req.json()
        if(!userId){
            return NextResponse.json({success:false,message:"User Not Authenticated"})

        }
        //Connect to database and delete the chat

        await connectDb();
        await Chat.deleteOne({_id:chatId.userId});
        return NextResponse.json({success:true,message:"Chat Deleted"})
    } catch (error) {
       return NextResponse.json({success:false,error:error.message}) 
    }
}