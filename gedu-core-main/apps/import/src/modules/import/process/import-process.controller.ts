import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { ImportFactoryService } from './services/factory/import-factory.service';
import { ImportJob, importPayloadSchema } from '../types/import.types';
import { ImportRepository } from '../repositories/import.repository';
import { IMPORT_TOPIC } from '@gedu/shared';

interface DebeziumPayload {
  op: 'c' | 'u' | 'd' | 'r';
  after: ImportJob;
}

@Controller()
export class ImportProcessController {
  private readonly logger = new Logger(ImportProcessController.name);

  constructor(
    private readonly importFactory: ImportFactoryService,
    private readonly importRepository: ImportRepository,
  ) {}

  @MessagePattern(IMPORT_TOPIC)
  async handleImportJob(
    @Payload() message: DebeziumPayload,
    @Ctx() context: KafkaContext
  ) {
    const job = message.after;
    const partition = context.getPartition();
    const offset = context.getMessage().offset;
    try {
      // We only care about new jobs being created
      if (message?.op !== 'c') {
        // Commit offset for non-create operations
        await context.getConsumer().commitOffsets([{
          topic: context.getTopic(),
          partition,
          offset: (Number(offset) + 1).toString()
        }]);
        return;
      }
      
      this.logger.log(`Received new import job message`);
      const jobPayload = job.payload;

      // Validate payload structure using Joi
      const { error, value } = importPayloadSchema.validate(jobPayload, {
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        throw new Error(`Invalid import payload: ${error.message}`);
      }

      // Get the appropriate processor and process the import
      const processor = this.importFactory.getProcessor(job.type);
      await processor.process(job.id, value); // Use the validated and sanitized value
      
      // Commit the offset after successful processing
      await context.getConsumer().commitOffsets([{
        topic: context.getTopic(),
        partition,
        offset: (Number(offset) + 1).toString()
      }]);
      
    } catch (error) {
      this.logger.error(`Error processing import job from controller: ${error.message}`, error.stack);
      if (job?.id) {
        // If job has id but not processed, we need to update the job status to failed
        await this.importRepository.updateJobFailedBeforeProcessing(job.id, error.message);
        return;
      }      
      // Let the consumer group rebalance handle the retry
      throw error;
    }
  }
}
