import { GrpcServiceConfig } from './grpc.interface';

// Service config for import gRPC services (school, staff, student)
export const GRPC_SERVICE = 'GRPC_IMPORT_SERVICE';

export const GRPC_SERVICE_CONFIG: GrpcServiceConfig = {
  name: GRPC_SERVICE,
  packages: ['school', 'staff', 'student'],
  protoPaths: ['v1/school.import.proto', 'v1/staff.import.proto', 'v1/student.import.proto'],
  host: process.env.GRPC_IMPORT_HOST || '0.0.0.0',
  port: parseInt(process.env.GRPC_IMPORT_PORT || '50001', 10),
};