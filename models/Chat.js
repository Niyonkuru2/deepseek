import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        messages:[
            {
                role: {type:String,required:true},
                content:{type:String,required:true},
                timestamp:{type:Number,required:true}
            }
        ],
        userId:{type:String,required:false}
    },
    {timestamps:true}
);

const Chat =mongoose.models.Chat || mongoose.model("User",ChatSchema)
export default Chat;