import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_SERVICE } from "./kafka.constant";
import { lastValueFrom } from "rxjs";

@Injectable()
export class KafkaService implements OnModuleDestroy {

  private readonly logger = new Logger(KafkaService.name);
  private isConnected = false;
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;
  private connectionRetryCount = 0;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second


  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly clientKafka: ClientKafka
  ) {

  }

  async onModuleDestroy() {
    this.logger.log('KafkaService destroyed');
    if (this.isConnected) {
      await this.clientKafka.close();
      this.isConnected = false;
    }
  }

  /**
   * Check if the Kafka service is healthy (Kafka connection is working)
   */
  public async isHealthy(): Promise<boolean> {
    try {
      await this.ensureKafkaConnection();
      return this.isConnected;
    } catch (error: any) {
      this.logger.error(`Health check failed: ${error.message}`);
      return false;
    }
  }

  private async ensureKafkaConnection(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = this.connectToKafkaWithRetry();

    try {
      await this.connectionPromise;
      this.isConnected = true;
      this.isConnecting = false;
      this.connectionRetryCount = 0; // Reset retry count on successful connection
    } catch (error: any) {
      this.isConnecting = false;
      this.connectionPromise = null;
      throw error;
    }
  }

  private async connectToKafkaWithRetry(): Promise<void> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(
          `Connecting to Kafka... (attempt ${attempt}/${this.maxRetries})`,
        );
        await this.clientKafka.connect();
        this.logger.log('Successfully connected to Kafka');
        return;
      } catch (error: any) {
        this.logger.error(
          `Failed to connect to Kafka (attempt ${attempt}/${this.maxRetries}): ${error.message}`,
        );

        if (attempt === this.maxRetries) {
          throw new Error(
            `Failed to connect to Kafka after ${this.maxRetries} attempts: ${error.message}`,
          );
        }

        const backoffDelay = Math.min(
          this.retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
          30000 // Max 30 seconds
        );
        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, backoffDelay),
        );
      }
    }
  }

  async emit<TPayload = unknown>(topic: string, message: TPayload): Promise<void> {
    await this.ensureKafkaConnection();
    try {
      // Convert the emit operation to a Promise
      await new Promise<void>((resolve, reject) => {
        this.clientKafka.emit(topic, message)
          .subscribe({
            error: (err) => {
              this.isConnected = false;
              reject(err);
            },
            complete: () => {
              this.logger.log(`Event published successfully for topic: ${topic}`);
              resolve();
            }
          });
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to emit event ${topic}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async send<T = any>(topic: string, message: any): Promise<T> {
    await this.ensureKafkaConnection();
    return lastValueFrom(this.clientKafka.send<T, any>(topic, message));
  }
}