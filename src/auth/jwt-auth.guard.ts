import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { verifyJwtHs256 } from './jwt.utils';
import type { JwtClaims } from './jwt.types';

export interface AuthenticatedRequest extends Request {
  user?: JwtClaims;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (
      request.path === '/docs-json' ||
      request.path === '/docs' ||
      request.path.startsWith('/docs/')
    ) {
      return true;
    }
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authHeader.slice('bearer '.length).trim();
    const secret = process.env.AUTH_JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException('AUTH_JWT_SECRET is not configured');
    }

    try {
      const claims = verifyJwtHs256(token, secret);
      if (!claims.email) {
        throw new UnauthorizedException('Token is missing email claim');
      }
      request.user = claims;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
