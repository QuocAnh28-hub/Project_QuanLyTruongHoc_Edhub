import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const DefaultPagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (req.query.page == null || req.query.page === "") {
      req.query.page = "1";
    }
    if (req.query.size == null || req.query.size === "") {
      req.query.size = "100";
    }
  return;
  }
);