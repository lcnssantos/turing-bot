import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  save<T>(key: string, value: T, ttl?: number) {
    const cacheKey = key.trim().toUpperCase();
    return this.cacheManager.set<T>(
      cacheKey,
      { ...value, rawKey: key },
      { ttl },
    );
  }

  get<T>(key: string) {
    const cacheKey = key.trim().toUpperCase();
    return this.cacheManager.get<T>(cacheKey);
  }
}
