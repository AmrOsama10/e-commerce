import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactoryService } from './factory/index';
import { UserModule } from '@shared/index';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, JwtService],
})
export class AuthModule {}
