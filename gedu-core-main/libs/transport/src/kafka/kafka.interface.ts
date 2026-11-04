import { SASLOptions } from "kafkajs";

export interface KafkaOption {
  name?: string;
  clientId: string;
  brokers: string[];
  groupId?: string;
  ssl?: boolean;
  sasl?: SASLOptions;
  isGlobal?: boolean;
}