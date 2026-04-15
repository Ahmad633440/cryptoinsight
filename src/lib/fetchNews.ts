import axios from 'axios';
import { connectDB } from './db';
import News from '@/models/pastNews';
import type { NewsType } from '@/data/types';

const NEWSDATA_API_URL = 'https://newsdata.io/api/1/news';

export const fetchCryptoNews = async () => {
    try {
        const res = await axios.get(NEWSDATA_API_URL, {
            params: {
                apikey: process.env.NEWSDATA_API_KEY,
                q: 'cryptocurrency OR bitcoin OR ethereum OR crypto',
                category: 'business,technology',
                language: 'en',
                country: 'us',
            },
            timeout: 10000,
        });

        if (!res.data.results || !Array.isArray(res.data.results)) {
            console.warn('No news results found');
            return [];
        }

        return res.data.results.map((article: any) => ({
            title: article.title,
            content: article.description || article.content,
            source: article.source_id || article.source_name || 'Unknown',
            publishedAt: new Date(article.pubDate || article.published_at),
            url: article.link || article.url,
            coin: extractCoinFromTitle(article.title),
        }));
    } catch (error) {
        console.error('Error fetching news from NewsData API:', error);
        throw error;
    }
};

export const syncNews = async () => {
    try {
        await connectDB();
        
        const newsArticles = await fetchCryptoNews();
        
        if (newsArticles.length === 0) {
            console.log('No new articles to sync');
            return { synced: 0, failed: 0 };
        }

        let synced = 0;
        let failed = 0;

        for (const article of newsArticles) {
            try {
                // Check if article already exists
                const existingArticle = await News.findOne({ url: article.url });
                
                if (!existingArticle) {
                    await News.create({
                        title: article.title,
                        content: article.content,
                        source: article.source,
                        publishedAt: article.publishedAt,
                        url: article.url,
                        coin: article.coin,
                        sentiment: 'Neutral', // Can be enhanced with sentiment analysis
                    });
                    synced++;
                }
            } catch (error) {
                console.error(`Failed to save article: ${article.title}`, error);
                failed++;
            }
        }

        console.log(`News sync completed. Synced: ${synced}, Failed: ${failed}`);
        return { synced, failed };
    } catch (error) {
        console.error('Error syncing news:', error);
        throw error;
    }
};

function extractCoinFromTitle(title: string): string | undefined {
    const coins = ['bitcoin', 'ethereum', 'btc', 'eth', 'cardano', 'ada', 'solana', 'sol'];
    const lowerTitle = title.toLowerCase();
    
    for (const coin of coins) {
        if (lowerTitle.includes(coin)) {
            return coin;
        }
    }
    
    return undefined;
}