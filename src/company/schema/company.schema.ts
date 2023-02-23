/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  establishedOn: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  panCardNumber: number;

  @Prop({ required: true })
  gstNumber: number;

  @Prop({ required: true })
  cinNumber: number;

  @Prop({ required: true })
  msmeCertificate: string;

  @Prop({ required: true })
  udhyogAdhar: string;

  @Prop({ required: true })
  fssaiLicense: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  approved: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
