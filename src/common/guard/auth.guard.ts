import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerRepository } from '../../models/customer/customer.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    const payload = this.jwtService.verify<{
      _id: string;
      email: string;
      role: string;
    }>(authorization, {
      secret: this.configService.get('access').jwt_secret,
    });

    const customerExist = await this.customerRepository.getOne({
      _id: payload._id,
    });
    if (!customerExist) throw new NotFoundException('user not found');

    request.user = customerExist;
    return true;
  }
}
