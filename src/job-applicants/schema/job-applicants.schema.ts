/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

export type JobApplicantDocument = HydratedDocument<JobApplicant>;

@Schema({
  timestamps: true,
})
export class JobApplicant {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  })
  jobId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  applicantId: Types.ObjectId;

  @Prop({ default: null })
  accepted: boolean;

  @Prop({ type: Object, required: false })
  online: object;

  @Prop({ type: Object, required: false })
  offline: object;

  @Prop({ type: Object, required: false })
  hired: object;
}

export const JobApplicantsSchema = SchemaFactory.createForClass(JobApplicant);
