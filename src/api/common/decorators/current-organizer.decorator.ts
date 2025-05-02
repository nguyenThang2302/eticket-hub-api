import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentOrganizer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.auth.organizeConfig;
  },
);
