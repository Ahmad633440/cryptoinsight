

import cron from 'node-cron';
import { syncNews } from '@/lib/fetchNews';

// Run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        console.log('Starting news sync...');
        const result = await syncNews();
        console.log(`News sync completed. Result:`, result);
    } catch (error) {
        console.error('Cron job failed:', error);
    }
});

export default cron;