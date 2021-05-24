import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  save<T>(key: string, value: T, ttl?: number) {
    this.logger.log(JSON.stringify({ type: 'cache.save', data: { key } }));

    const cacheKey = key.trim().toUpperCase();
    return this.cacheManager.set<T>(
      cacheKey,
      { ...value, rawKey: key },
      { ttl },
    );
  }

  get<T>(key: string) {
    this.logger.log(JSON.stringify({ type: 'cache.get', data: { key } }));
    const cacheKey = key.trim().toUpperCase();
    return this.cacheManager.get<T>(cacheKey);
  }
}
