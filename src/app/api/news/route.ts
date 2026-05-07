import { connectDB } from "@/lib/db";
import { createNewsWithEmbedding } from "@/services/embeddingServices";
import News from "@/models/news";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        await connectDB();
        console.log('[DEBUG] DB connected in /api/news');

        const news = await News.find({}).sort({ createdAt: -1 });
        console.log('[DEBUG] Found articles:', news.length);

        return NextResponse.json({
            success: true,
            data: news,
        });

    } catch (error) {
        console.error('[DEBUG] Error fetching news:', error);
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
        const requiredFields = ['title', 'coin', 'source', 'url'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({
                    success: false,
                    message: `Missing required field: ${field}`
                }, { status: 400 });
            }
        }

        if (!body.content && !body.description) {
            return NextResponse.json({
                success: false,
                message: 'Missing required field: content or description'
            }, { status: 400 });
        }

        const { news, created, embedded } = await createNewsWithEmbedding({
            title: body.title,
            content: body.content || body.description,
            source: body.source,
            publishedAt: new Date(body.publishedAt || Date.now()),
            url: body.url,
            coin: body.coin,
            category: body.category,
            sentiment: body.sentiment || 'Neutral',
        });

        return NextResponse.json({
            success: true,
            message: created ? "News stored successfully" : "News already exists",
            data: news,
            embedded,
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