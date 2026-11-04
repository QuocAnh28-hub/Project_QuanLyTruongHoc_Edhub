export type PaginationRequest = {
  page: number;
  size: number;
};

export type Request = {
  query: Record<string, any>;
  headers: Record<string, any>;
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, any>;
  params?: Record<string, any>;
  user?: Record<string, any>;
}; 