import { GRPC_BUILT_IN_ARGS } from "@gedu/config";
import { GRPC_SERVICE } from "@gedu/transport";


/**  
 * gRPC registration args for the Import service.  
 * Packages: school, staff, student  
 * Protos: v1/* import protos  
 */  
export const GRPC_IMPORT_ARGS = GRPC_BUILT_IN_ARGS(
  GRPC_SERVICE,
  ['school', 'staff', 'student'],
  ['v1/school.import.proto', 'v1/staff.import.proto', 'v1/student.import.proto']
);