import { connectDB } from '@/lib/db';
import News from '@/models/news';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        console.log('DB connected in /api/news/latest');

        const news = await News.find()
            .sort({ publishedAt: -1 })
            .limit(50)
            .lean();

        console.log('Found articles:', news.length);

        if (!news || news.length === 0) {
            return NextResponse.json(
                { message: 'No news found', data: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: 'Success', data: news },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { message: 'Error fetching news', error: String(error) },
            { status: 500 }
        );
    }
}