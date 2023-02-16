/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({ required: true })
  receiver: Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
