import { connectDB } from "@/lib/db";
import News from "@/models/pastNews";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        await connectDB();

        const news = await News.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: news,
        });

    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch news",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}



export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        // Basic validation
        const requiredFields = ['title', 'description', 'coin', 'source'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({
                    success: false,
                    message: `Missing required field: ${field}`
                }, { status: 400 });
            }
        }

        const news = await News.create(body);

        return NextResponse.json({
            success: true,
            message: "News stored successfully",
            data: news,
        });

    } catch (error) {
        console.error("Error creating news:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to store news",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}