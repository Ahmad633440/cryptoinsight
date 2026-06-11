type CacheEntry<T> = {
  value: T;
  expiry: number;
};

// Global cache store
const cacheStore = new Map<string, CacheEntry<unknown>>();

/**
 * Gets a value from the cache if it hasn't expired yet.
 */
export function getCached<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiry) {
    cacheStore.delete(key);
    return null;
  }
  
  return entry.value as T;
}

/**
 * Sets a value in the cache with a Time-To-Live (TTL) in milliseconds.
 */
export function setCached<T>(key: string, value: T, ttlMs: number): void {
  cacheStore.set(key, {
    value,
    expiry: Date.now() + ttlMs,
  });
}

/**
 * Clear the entire cache (useful if forced refresh is triggered).
 */
export function clearCache(): void {
  cacheStore.clear();
}
