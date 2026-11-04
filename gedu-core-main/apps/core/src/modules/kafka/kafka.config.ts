import { KAFKA_BUILT_IN_ARGS } from "@gedu/config";
import { KAFKA_SERVICE } from "@gedu/transport";

export const KAFKA_NAME = 'core-kafka'

// kafka only run internally, so we don't need to use sasl/ssl

export const KAFKA_CORE_ARGS = KAFKA_BUILT_IN_ARGS(
  KAFKA_SERVICE, 
  KAFKA_NAME, 
  KAFKA_NAME, 
  false, 
  undefined
);