import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthService {   
  private readonly logger = new Logger(HealthService.name);

  constructor() {}

  async checkHealth() {
    this.logger.log('Health check started');
    return {
      status: 'ok',
    }
  }
}