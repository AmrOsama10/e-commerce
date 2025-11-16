import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthFactoryService } from './factory/index';
import { UserModule } from '@shared/index';


@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService],
})
export class AuthModule {}
