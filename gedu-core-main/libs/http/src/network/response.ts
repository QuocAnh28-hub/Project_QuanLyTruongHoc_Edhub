import { Request } from './request';

const DEFAULT_SUCCESS_RESPONSE = {
  message: 'success',
  error: null,
} as const;

export type PaginationMeta = {
  itemsPerPage: number;
};

export type PrismaOrmResult = [object[], number];

export class Response<T = unknown> {
  response:
    | T
    | { data: T; total?: number; current?: number; size?: number }
    | null = null;

  private static isArrayResponseWithTotalItem(
    value: unknown | object[],
  ): boolean {
    return (
      !!value &&
      Array.isArray(value) &&
      value.length === 2 &&
      Array.isArray(value[0]) &&
      typeof value[1] === 'number'
    );
  }

  private static isPagination(
    value: unknown | object[],
    request: Request,
  ): boolean {
    return (
      Response.isArrayResponseWithTotalItem(value) &&
      'page' in request.query &&
      'size' in request.query
    );
  }

  private static isFetchingAllWithPaginationQuery(
    value: unknown | object[],
    request: Request,
  ): boolean {
    return (
      Response.isArrayResponseWithTotalItem(value) &&
      !('page' in request.query) &&
      !('size' in request.query)
    );
  }

  static parse<T = unknown>(
    value: unknown | object[],
    request: Request,
  ): Response<T> {
    if (Response.isPagination(value, request)) {
      const { page = 1, size } = request.query;
      const result = value as PrismaOrmResult;
      const data = result?.[0] ?? [];
      const totalItems = result?.[1] ?? 0;

      return {
        response: {
          data: data as T,
          current: +page,
          size: +size,
          total: totalItems,
        },
      };
    }

    if (Response.isFetchingAllWithPaginationQuery(value, request)) {
      if (Array.isArray(value) && value.length === 0)
        return {
          response: value[0] as T,
        };
    }

    return {
      response: value as T,
    };
  }
}
