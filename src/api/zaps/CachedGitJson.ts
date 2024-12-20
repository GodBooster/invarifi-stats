import { getKey, setKey } from '../../utils/cache';
import { isLocalPath, readFromFile } from '../../utils/fetch';
import { deferred, DeferredPromise } from '../../utils/promise';
import { serviceEventBus } from '../../utils/ServiceEventBus';

export type CachedGitJsonConfig = {
  readonly isCustomPath: boolean;

  readonly org: string;
  readonly repo: string;
  readonly branch: string;
  readonly path: string;
  /** Time in seconds before update is required */
  readonly updateOnInterval?: number;
  /** Always update when api restarts */
  readonly updateOnStart?: boolean;
  /** Print debug messages */
  readonly debug?: boolean;
};

export class CachedGitJson<T> {
  private readonly url: string;
  private readonly redisBaseKey: string;
  private readonly redisValueKey: string;
  private readonly redisFetchedKey: string;
  private readonly redisModifiedKey: string;
  private readonly redisEtagKey: string;
  private readonly availablePromise: Promise<unknown>;
  private currentValue: T | undefined;
  private lastFetched: Date | undefined;
  private lastModified: Date | undefined;
  private lastEtag: string | undefined;

  protected constructor(protected readonly config: CachedGitJsonConfig) {
    this.redisBaseKey = `git:${config.org}:${config.repo}:${config.branch}:${config.path}`;

    this.url = config.isCustomPath
      ? config.path
      : `https://raw.githubusercontent.com/${this.config.org}/${this.config.repo}/${this.config.branch}/${this.config.path}`;

    console.log(`CachedGitJson: using ${this.url} url for caching`);

    this.redisValueKey = `${this.redisBaseKey}:value`;
    this.redisFetchedKey = `${this.redisBaseKey}:fetched`;
    this.redisModifiedKey = `${this.redisBaseKey}:modified`;
    this.redisEtagKey = `${this.redisBaseKey}:etag`;
    this.availablePromise = serviceEventBus.waitForFirstEvent(`${this.redisBaseKey}/ready`);
  }

  public static async create<T>(config: CachedGitJsonConfig): Promise<CachedGitJson<T>> {
    const instance = new CachedGitJson<T>(config);
    await instance.init();
    return instance;
  }

  private async init() {
    const loadedFromRedis = await this.loadFromRedis();
    if (loadedFromRedis) {
      serviceEventBus.emit(`${this.redisBaseKey}/ready`);
    }

    if (this.config.updateOnStart) {
      await this.updateOnStart();
    }

    if (this.config.updateOnInterval !== undefined && this.config.updateOnInterval > 0) {
      setInterval(this.updateOnInterval.bind(this), this.config.updateOnInterval * 1000);
    }
  }

  private async updateOnStart() {
    if (this.config.debug) console.log(`> Updating ${this.config.path} on start`);
    return this.update();
  }

  private async updateOnInterval() {
    if (this.config.debug) console.log(`> Updating ${this.config.path} on interval`);
    // reload from redis in case another instance updated
    await this.loadFromRedis();
    return this.update();
  }

  private async _updateFromFile() {
    const url = this.url;
    this.lastFetched = new Date();
    return readFromFile(url);
  }

  private async _updateFromNetwork() {
    const url = this.url;

    const headers = this.available ? { 'If-None-Match': this.lastEtag } : {};
    const response = await fetch(url, { headers });
    this.lastFetched = new Date();

    if (this.available && response.status === 304) {
      await this.saveToRedis();
      throw new Error('Is not available');
    }

    if (response.status !== 200) {
      throw new Error(`Failed to fetch ${url} - ${response.status} ${response.statusText}`);
    }

    const etag = response.headers.get('etag');
    if (!etag) {
      throw new Error(`Failed to get etag for ${url}`);
    }

    this.lastEtag = etag;

    return await response.json();
  }

  private async update() {
    try {
      const url = this.url;

      const json: T = isLocalPath(url)
        ? await this._updateFromFile()
        : await this._updateFromNetwork();

      if (!this.lastModified || this.hasChanged(json)) {
        this.lastModified = new Date();
        this.currentValue = json;
        serviceEventBus.emit(`${this.redisBaseKey}/ready`);
      }
      await this.saveToRedis();
    } catch (e) {
      console.error(e.message ?? e?.toString() ?? e ?? 'CachedGitJson: unknown error');
      return;
    }
  }

  private hasChanged(newValue: T): boolean {
    return JSON.stringify(newValue) !== JSON.stringify(this.currentValue);
  }

  private async saveToRedis() {
    if (!this.available) {
      throw new Error('Cannot save to redis before fetching');
    }

    await Promise.all([
      setKey(this.redisValueKey, this.currentValue),
      setKey(this.redisFetchedKey, this.lastFetched.getTime()),
      setKey(this.redisModifiedKey, this.lastModified.getTime()),
      setKey(this.redisEtagKey, this.lastEtag),
    ]);
  }

  private async loadFromRedis() {
    const [value, fetched, modified, etag] = await Promise.all([
      getKey<T>(this.redisValueKey),
      getKey<string>(this.redisFetchedKey),
      getKey<string>(this.redisModifiedKey),
      getKey<string>(this.redisEtagKey),
    ]);

    if (
      value === undefined ||
      fetched === undefined ||
      modified === undefined ||
      etag === undefined ||
      value === null ||
      fetched === null ||
      modified === null ||
      etag === null
    ) {
      return false;
    }

    this.currentValue = value;
    this.lastFetched = new Date(Number(fetched));
    this.lastModified = new Date(Number(modified));
    this.lastEtag = etag;

    return true;
  }

  public async waitForAvailable() {
    await this.availablePromise;
  }

  get available(): boolean {
    return (
      this.currentValue !== undefined &&
      this.lastFetched !== undefined &&
      this.lastModified !== undefined &&
      (this.config.isCustomPath ? true : this.lastEtag !== undefined)
    );
  }

  get value(): T {
    if (!this.available) {
      throw new Error('Cannot get "value" before available');
    }

    return this.currentValue;
  }

  get fetched(): Date {
    if (!this.available) {
      throw new Error('Cannot get "fetched" before available');
    }

    return this.lastFetched;
  }

  get modified(): Date {
    if (!this.available) {
      throw new Error('Cannot get "modified" before available');
    }

    return this.lastModified;
  }

  get etag(): string {
    if (!this.available) {
      throw new Error('Cannot get "etag" before available');
    }

    return this.lastEtag;
  }
}
