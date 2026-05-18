
import { syncNews } from '@/controllers/fetchNews';
import { NextResponse } from 'next/server';


// POST /api/sync
// Manually trigger news synchronization from external API and store in MongoDB
// This endpoint is intended for testing and manual sync purposes. In production, consider using a scheduled job (e.g., with cron) for regular syncing.

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
