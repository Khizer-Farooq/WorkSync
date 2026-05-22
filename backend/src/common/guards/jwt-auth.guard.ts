import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '../enums/user-role.enum';
import type { CurrentUser } from '../types/current-user.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      const subject = decoded.sub as unknown;
      const userId = typeof subject === 'number' ? subject : Number(subject);
      const role = decoded.role as unknown;

      if (
        !Number.isInteger(userId) ||
        typeof decoded.email !== 'string' ||
        !Object.values(UserRole).includes(role as UserRole)
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user: CurrentUser = {
        id: userId,
        email: decoded.email,
        role: role as UserRole,
      };

      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
