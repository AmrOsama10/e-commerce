import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Category {
  readonly _id: Types.ObjectId;
  @Prop({ type: String, trim: true, required: true, unique: true })
  name: string;

  @Prop({ type: String, trim: true, required: true, unique: true })
  slug: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
  updatedBy: Types.ObjectId;
  
  logo: object;
}

export const categorySchema = SchemaFactory.createForClass(Category)