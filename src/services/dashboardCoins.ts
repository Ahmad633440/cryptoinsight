

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

/**
 * Fetch top 100 coins from CoinGecko API
 * @returns Array of market data for top 100 coins
 * @throws Error if API key is expired/invalid or API call fails
 */
export async function getLiveCoins(forceRefresh: boolean = false): Promise<CoinGeckoMarket[]> {
  const apiKey = process.env.COIN_GECKO_API_KEY;
  
  // Build URL with API key if available
  const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets';
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '100', // Fetch 100 coins as requested
    page: '1',
    sparkline: 'true',
    locale: 'en',
  });

  const url = apiKey ? `${baseUrl}?${params}&x_cg_demo_api_key=${apiKey}` : `${baseUrl}?${params}`;
 
  try {
    const fetchOptions: RequestInit = forceRefresh 
      ? { cache: 'no-store' } 
      : { next: { revalidate: 60 } };

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    });

    // Check for authentication errors
    if (res.status === 401 || res.status === 403) {
      const errorText = await res.text();
      console.error(`CoinGecko API Authentication Error ${res.status}: API key is expired or invalid`);
      console.error(`Error Details: ${errorText}`);
      throw new Error(`CoinGecko API Authentication Failed: ${res.status}. Check your COIN_GECKO_API_KEY`);
    }

    // Check for rate limit errors
    if (res.status === 429) {
      console.error(`CoinGecko API Rate Limit Hit - Too many requests`);
      throw new Error('CoinGecko API Rate Limit Exceeded. Please try again later.');
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`CoinGecko API Error ${res.status}: ${errorText}`);
      throw new Error(`CoinGecko API returned ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched ${data.length || 0} coins from CoinGecko API`);
    return data;

  } catch (error) {
    console.error('Error fetching live coins:', error instanceof Error ? error.message : error);
    throw error; 
  }
}