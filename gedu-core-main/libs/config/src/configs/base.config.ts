import { ConfigFactory, ConfigObject } from "@nestjs/config";
import * as Joi from 'joi';
/**  
 * BaseConfig defines a typed wrapper for configuration sources.  
 * - key: unique key for the config namespace  
 * - configuration: factory returning a ConfigObject  
 * - validationSchema: Joi schema map for environment validation  
 */  
export type BaseConfig = {
  key: string;
  configuration: ConfigFactory<ConfigObject>;
  validationSchema: Record<string, Joi.AnySchema>;
}