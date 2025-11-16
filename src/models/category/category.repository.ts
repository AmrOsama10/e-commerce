import { AbstractRepository } from "@models/abstract.repository";
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
    constructor(@InjectModel(Category.name) private readonly categoryModel:Model<Category>){
        super(categoryModel)
    }
}