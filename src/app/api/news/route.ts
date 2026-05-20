import { connectDB } from "@/lib/db";
import { createNewsWithEmbedding } from "@/services/embeddingServices";
import News from "@/models/news";
import { NextResponse } from "next/server";



// GET /api/news?limit=20&page=1
// Fetch paginated news articles, sorted by published date (newest first)
// it retrievves all news from mongoDB with pagination
export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const news = await News.find({})
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await News.countDocuments({});

        return NextResponse.json({
            success: true,
            data: news,
            meta: {
                total,
                page,
                limit
            }
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


// POST /api/news
// Create a new news article with embedding
// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();

//         // Basic validation
//         const requiredFields = ['title', 'source', 'url'];
//         for (const field of requiredFields) {
//             if (!body[field]) {
//                 return NextResponse.json({
//                     success: false,
//                     message: `Missing required field: ${field}`
//                 }, { status: 400 });
//             }
//         }

//         if (!body.content && !body.description) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Missing required field: content or description'
//             }, { status: 400 });
//         }

//         const { news, created, embedded } = await createNewsWithEmbedding({
//             title: body.title,
//             content: body.content || body.description,
//             source: body.source,
//             publishedAt: new Date(body.publishedAt || Date.now()),
//             url: body.url,
//             coin: body.coin,
//             category: body.category,
//             sentiment: body.sentiment || 'Neutral',
//         });

//         return NextResponse.json({
//             success: true,
//             message: created ? "News stored successfully" : "News already exists",
//             data: news,
//             embedded,
//         });

//     } catch (error) {
//         console.error("Error creating news:", error);
//         return NextResponse.json({
//             success: false,
//             message: "Failed to store news",
//             error: error instanceof Error ? error.message : "Unknown error",
//         }, { status: 500 });
//     }
// }