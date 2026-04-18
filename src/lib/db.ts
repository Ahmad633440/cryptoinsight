import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI as string;

if(!MONGODB_URI){
    throw new Error("Getting Error in connecting with MongoDB");
}

export const connectDB = async () => {
    try {
        if(mongoose.connection.readyState >= 1){
            console.log('Already connected');
            return;
        };
 
        await mongoose.connect(MONGODB_URI);
 
        console.log("MONGODB connected", mongoose.connection.host);

    } catch (error) {
     console.error("MongoDB connection error", error)
     throw error;   
    }
}

