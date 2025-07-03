import mongoose from "mongoose";
let cached = global.mongoose || {conn:null, promise:null};

export default async function connectDb() {
    if(cached.conn) return cached.conn;
    if(!cached.promise){
        cached.promise = mongoose.connect(process.env.MONGODB_URL).then((mongoose)=>mongoose);
        
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error("Error Connecting to MongoDB:",error);
        
    }
    return cached.conn
}