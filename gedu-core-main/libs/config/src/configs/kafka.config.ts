import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const kafkaConfiguration = registerAs('kafka', () => ({
  brokers: (process.env['KAFKA_BROKERS'] || 'localhost:9092').split(','),
}));

const kafkaValidationSchema = {
  KAFKA_BROKERS: Joi.string().required(),
}; 

export const KAFKA_CONFIG_KEY = kafkaConfiguration.KEY;

export const kafkaConfig: BaseConfig = {
  key: KAFKA_CONFIG_KEY,
  configuration: kafkaConfiguration,
  validationSchema: kafkaValidationSchema,
};

export type KafkaConfiguration = ConfigType<typeof kafkaConfiguration>;

/**
 * Creates a Kafka configuration provider for dependency injection.
 * @param name - The name identifier for the Kafka configuration
 * @param clientId - The client ID for the Kafka connection
 * @param groupId - The consumer group ID
 * @param ssl - Whether to use SSL for the connection
 * @param sasl - SASL authentication configuration
 * @returns A provider configuration object for async module registration
 */
export const KAFKA_BUILT_IN_ARGS = (name: string, clientId: string, groupId: string, ssl: boolean, sasl: any) => ({
  name: name,
  useFactory: (kafkaConfig: KafkaConfiguration) => {
    return {
      name: name,
      clientId: clientId,
      brokers: kafkaConfig.brokers,
      groupId: groupId,
      ssl: ssl,
      sasl: sasl,
    }
  },
  inject: [KAFKA_CONFIG_KEY],
});