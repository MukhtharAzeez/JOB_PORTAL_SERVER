/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

export type CompanyAdminRequestsDocument = HydratedDocument<CompanyAdminRequests>;

@Schema({
  timestamps: true,
})
export class CompanyAdminRequests {
  @Prop({ required: true })
  message: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  applicant: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'CompanyAdmin',
    required: true,
  })
  admin: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  })
  job: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  adminAccepted: boolean;
}

export const CompanyAdminRequestsSchema = SchemaFactory.createForClass(CompanyAdminRequests);
