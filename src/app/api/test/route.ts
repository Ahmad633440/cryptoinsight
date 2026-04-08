import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(){
    try {
         
    await connectDB();
    
    return NextResponse.json({
        message: "DB connected successfully",
    });

    } catch (error) {
        return NextResponse.json(
            {message: "Failed to connect to database", error: error instanceof Error ? error.message : "Unknown error"},
            {status: 500}
        );
    }
}
