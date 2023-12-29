import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../auth/entity/user.entity';

export const LoggedInUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
