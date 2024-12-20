import { ICacheBackend } from './ICacheBackend';
import {
  createClient,
  RedisClientType,
  RedisDefaultModules,
  RedisModules,
  RedisScripts,
} from 'redis';

type RedisBackendConstructorParams = { host: string; port: number; password: string };

export class RedisCacheBackend implements ICacheBackend {
  private client: RedisClientType<RedisDefaultModules & RedisModules, RedisScripts>;

  protected constructor({ host, port, password }: RedisBackendConstructorParams) {
    this.client = createClient({ password, socket: { host, port, tls: true } });

    this.client.on('connect', async () => {
      console.log('Connected to redis');
    });

    this.client.on('error', err => {
      console.error('Failed to connect to redis: ', err);
    });
  }

  protected async connect() {
    await this.client.connect();
  }

  public static async create(params: RedisBackendConstructorParams): Promise<RedisCacheBackend> {
    const instance = new RedisCacheBackend(params);
    await instance.connect();
    return instance;
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
}
