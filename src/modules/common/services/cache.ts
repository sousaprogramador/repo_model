import { Injectable, Logger } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import { RDStationService } from './rdstation';

@Injectable()
export class CacheService {
  logger: Logger;
  cache: NodeCache;
  constructor(private rdstationService: RDStationService) {
    this.cache = new NodeCache();
  }

  set(key, value, ttl = 3600) {
    return this.cache.set(key, value, ttl);
  }

  get(key) {
    return this.cache.get(key);
  }

  clearAllCache() {
    return this.cache.flushAll();
  }

  async getRDToken() {
    const token = this.get('rdstation:token');

    if (token) return token;

    const { access_token, expires_in } = await this.rdstationService.refreshTokenRDStation();

    if (!access_token) return null;

    this.set('rdstation:token', access_token, expires_in);
    // console.log('Salvando token no cache por 20 segundos');
    // this.set('rdstation:token', access_token, 20);

    return access_token;
  }
}
