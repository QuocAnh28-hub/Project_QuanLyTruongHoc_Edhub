/**
 * Options for configuring MinIO connectivity via the MinioModule.
 * Note: `endpoint` here is an internal alias; ensure the service maps it to the MinIO client's `endPoint` option.
 * @property endpoint - The MinIO server endpoint (e.g., "localhost:9000")
 * @property port - The port number for the MinIO server
 * @property accessKey - The access key for authentication
 * @property secretKey - The secret key for authentication
 * @property useSSL - Whether to use SSL for the connection
 */
export type MinioOptions = {
  endpoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  useSSL: boolean;
};