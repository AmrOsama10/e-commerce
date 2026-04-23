import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PUBLIC } from '@common/decorator';
import { UserRepository } from '@models/index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      
    const request = context.switchToHttp().getRequest();

    const publicVal = this.reflector.get(PUBLIC, context.getHandler());
    if (publicVal) return true;

    const { authorization } = request.headers;

    const payload = this.jwtService.verify<{
      _id: string;
      email: string;
      role: string;
    }>(authorization, {
      secret: this.configService.get('access').jwt_secret,
    });

    const userExist = await this.userRepository.getOne({
      _id: payload._id,
    });
    if (!userExist) throw new NotFoundException('user not found');

    request.user = userExist;
    return true;

    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }
}
