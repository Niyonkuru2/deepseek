export const maxDuration = 60;// for increasung response waiting time

import connectDb from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAi With Deepseek Api key and base url
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req) {
    try {
      const {userId} = getAuth(req) 

      // Extract chatid and prompt from the request body
      const {chatId,prompt} = await req.json();
      if(!userId){
        return NextResponse.json({success:false,message:"User Not Authenticated"})
      
    }
    // find the chat documment in the database based on userid
    await connectDb()
    const data = await Chat.findOne({userId,_id:chatId})
    //create user message object
    const userPrompt ={
        role:"user",
        content:prompt,
        timestamp:Date.now()
    };

    data.messages.push(userPrompt);
    // call the deepseek api for get chat completion
   
     const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "deepseek-chat",
    store:true,
  });
  const message = completion.choices[0].message;
  message.timestamp = Date.now()
  data.messages.push(message);
  data.save().Chat;
  return NextResponse.json({success:true,data:message})

    } catch (error) {
        return NextResponse.json({success:false,error:error.message})
    }
}