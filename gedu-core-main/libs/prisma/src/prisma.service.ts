import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/client/client';

type QueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

type LogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
      errorFormat: 'pretty',
    });

    // Log queries in development
    // if (process.env.NODE_ENV === 'development') {
    //   this.$on('query', (e: QueryEvent) => {
    //     this.logger.debug(`Query: ${e.query}`);
    //     this.logger.debug(`Duration: ${e.duration}ms`);
    //   });
    // }

    // // Always log errors
    // this.$on('error', (e: LogEvent) => {
    //   this.logger.error(`Database error: ${e.message}`);
    // });
  }
  
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Successfully disconnected from database');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
      throw error;
    }
  }

  async cleanDatabase() {
    if (process.env['NODE_ENV'] === 'production') {
      throw new Error('cleanDatabase cannot be run in production');
    }
    
    const modelNames = Reflect.ownKeys(this).filter(
      (key: string | symbol) => 
        typeof key === 'string' && 
        key.startsWith('_') && 
        !key.startsWith('__') && 
        key !== '_baseDmmf'
    );

    return Promise.all(
      modelNames.map((modelName) => {
        const model = this[modelName as keyof typeof this];
        if (model && 'deleteMany' in (model as any)) {
          return (model as any).deleteMany();
        }
      })
    );
  }
} 