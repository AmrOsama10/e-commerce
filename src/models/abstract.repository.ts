import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
  constructor(private readonly model: Model<T>) {}
  public async create(item: Partial<T>) {
    const doc = new this.model(item);
    return doc.save();
  }
  async getOne(
    filter: RootFilterQuery<T>,
    projection?: ProjectionType<T>,
    option?: QueryOptions,
  ) {
    return this.model.findOne(filter, projection, option);
  }

  async update(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    return this.model.updateOne(filter, update, options);
  }
}