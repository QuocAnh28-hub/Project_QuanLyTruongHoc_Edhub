export interface GrpcServiceConfig {
  name: string;
  packages: string[];
  protoPaths: string[];
  url?: string;
  host?: string;  
  port?: number;
}

export interface GrpcModuleOptions {
  services: GrpcServiceConfig[];
}

// Default configurations for each service
export const DEFAULT_GRPC_SERVICES: GrpcServiceConfig[] = []; 