import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository.js';
import { Admin } from './admin.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AdminRepository extends AbstractRepository<Admin> {
  constructor(@InjectModel(Admin.name) adminModel: Model<Admin>) {
    super(adminModel);
  }
}
