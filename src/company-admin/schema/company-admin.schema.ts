/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema , Types} from 'mongoose';

export type CompanyAdminDocument = HydratedDocument<CompanyAdmin>;

@Schema({
  timestamps: true,
})
export class CompanyAdmin {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobile: number;

  @Prop({ required: true })
  employeeId: string;

  @Prop({})
  businessMobile: number;

  @Prop({})
  address: string;

  @Prop({})
  postalCode: number;

  @Prop({ required: true })
  authority: string;

  @Prop({ required: true })
  status: true;

  @Prop({ required: true })
  password: string;
}

export const CompanyAdminSchema = SchemaFactory.createForClass(CompanyAdmin);
