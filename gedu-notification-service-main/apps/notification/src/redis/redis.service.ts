import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { MsGraphAccessTokenResponse } from "../ms-graph/ms-graph.interface";

const MS_GRAPH_ACCESS_TOKEN = 'MS_GRAPH_ACCESS_TOKEN';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async getAccessToken(): Promise<MsGraphAccessTokenResponse | null> {
    const token = await this.cacheManager.get<MsGraphAccessTokenResponse>(MS_GRAPH_ACCESS_TOKEN);
    if (token) {
      if (token.expires_on && token.expires_on < Date.now()) {
        await this.cacheManager.del(MS_GRAPH_ACCESS_TOKEN);
        return null;
      }
      return token;
    }
    return null;
  }

  async storeAccessToken(token: MsGraphAccessTokenResponse) {
    const expire_on = Date.now() + (token.expires_in - 10) * 1000;
    token.expires_on = expire_on;
    await this.cacheManager.set(MS_GRAPH_ACCESS_TOKEN, token, (token.expires_in - 10) * 1000);
  }

}