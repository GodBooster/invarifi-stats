import { Cache } from './Cache';
import { RedisCacheBackend } from './RedisCacheBackend';
import { DummyCacheBackend } from './DummyCacheBackend';
import { ICacheBackend } from './ICacheBackend';
import { FileCacheBackend } from './FileCacheBackend';
import { filter, mapValues, pickBy } from 'lodash';

let cache: Cache | undefined;

export async function initCache() {
  if (cache) return;

  let backend: ICacheBackend;

  // Redis backend
  if (
    process.env.REDIS_HOST &&
    typeof process.env.REDIS_HOST === 'string' &&
    process.env.REDIS_PASSWORD &&
    typeof process.env.REDIS_PASSWORD === 'string' &&
    process.env.REDIS_PORT &&
    typeof process.env.REDIS_PORT === 'string'
  ) {
    console.log('> Using Redis cache backend');
    backend = await RedisCacheBackend.create({
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      port: parseInt(process.env.REDIS_PORT, 10),
    });
  }

  // File backend
  if (!backend && process.env.FILE_CACHE_BACKEND) {
    console.log('> Using file cache backend');
    backend = new FileCacheBackend();
  }

  // Fallback backend
  if (!backend) {
    console.log('> No cache backend specified, cache disabled');
    backend = new DummyCacheBackend();
  }

  cache = new Cache(backend);
}

export async function setKey<T extends any>(key: string, value: T): Promise<void> {
  if (!cache) {
    throw new Error('Cache not initialized');
  }
  await cache.set(key, value);
}

export async function getKey<T extends any>(key: string): Promise<T | undefined> {
  if (!cache) {
    throw new Error('Cache not initialized');
  }
  return cache.get<T>(key);
}
