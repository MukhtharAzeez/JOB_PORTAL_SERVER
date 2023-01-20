/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type CompanyAdminDocument = HydratedDocument<CompanyAdmin>;

@Schema({
  timestamps: true,
})
export class CompanyAdmin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobile: number;

}

export const CompanyAdminSchema = SchemaFactory.createForClass(CompanyAdmin);