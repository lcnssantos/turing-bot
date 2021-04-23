import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { fromByteArray } from 'base64-js';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  save<T>(key: string, value: T, ttl?: number) {
    const cacheKey = fromByteArray(Buffer.from(key));
    return this.cacheManager.set<T>(cacheKey, value, { ttl });
  }

  get<T>(key: string) {
    const cacheKey = fromByteArray(Buffer.from(key));
    return this.cacheManager.get<T>(cacheKey);
  }
}
