
import { syncNews } from '@/controllers/fetchNews';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        console.log('Manual news sync triggered...');
        const result = await syncNews();
        console.log('Sync result:', result);

        return NextResponse.json(
            { 
                message: 'News sync completed successfully', 
                data: result 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during news sync:', error);
        return NextResponse.json(
            { 
                message: 'Error syncing news', 
                error: String(error) 
            },
            { status: 500 }
        );
    }
}
