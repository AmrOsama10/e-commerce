import { User, UserRepository, userSchema } from '@models/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminRepository,
  adminSchema,
  Customer,
  CustomerRepository,
  CustomerSchema,
  Seller,
  SellerRepository,
  SellerSchema,
} from '../../models';

@Module({
  imports: [
  MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
        discriminators: [
          {
            name: Customer.name,
            schema: CustomerSchema,
          },
          {
            name: Admin.name,
            schema: adminSchema,
          },
          {
            name: Seller.name,
            schema: SellerSchema,
          },
          { name: User.name, schema: userSchema },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [
    CustomerRepository,
    AdminRepository,
    SellerRepository,
    UserRepository,
  ],
  exports: [
    CustomerRepository,
    AdminRepository,
    SellerRepository,
    UserRepository,
  ],
})
export class UserModule {}
