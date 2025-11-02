import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../models/common/user.schema.js';
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
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [CustomerRepository, AdminRepository, SellerRepository],
  exports: [CustomerRepository, AdminRepository, SellerRepository],
})
export class UserModule {}
