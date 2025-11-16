import { PUBLIC, ROLES } from '@common/decorator';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const publicVal = this.reflector.get(PUBLIC, context.getHandler());
    if (publicVal) return true;
    
    const roles = this.reflector.getAllAndMerge(ROLES, [context.getHandler(),context.getClass()]);
    if (!roles.includes(request.user.role))
      throw new UnauthorizedException('you are not allowed');
    
    return true;
  }
}
