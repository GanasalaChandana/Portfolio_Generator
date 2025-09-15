interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function maybeCache<T>(key: string, compute: () => T, enabled: boolean): T {
  if (!enabled) return compute();
  
  // Check if cached value exists and is not expired
  const cached = cache[key];
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.value;
  }
  
  // Compute new value
  const result = compute();
  cache[key] = {
    value: result,
    timestamp: Date.now()
  };
  
  // Simple cleanup: remove expired entries periodically
  if (Math.random() < 0.1) { // 10% chance
    cleanupExpiredEntries();
  }
  
  return result;
}

function cleanupExpiredEntries() {
  const now = Date.now();
  Object.keys(cache).forEach(key => {
    if ((now - cache[key].timestamp) > CACHE_TTL) {
      delete cache[key];
    }
  });
}
