/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

export type UserRequestsDocument = HydratedDocument<UserRequests>;

@Schema({
  timestamps: true,
})
export class UserRequests {
  @Prop({ required: true })
  message: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  })
  job: Types.ObjectId;

  @Prop({})
  accepted: boolean;

  @Prop({})
  changeRequest: boolean;

  @Prop({ required: true })
  type: string;
}

export const UserRequestsSchema = SchemaFactory.createForClass(UserRequests);
