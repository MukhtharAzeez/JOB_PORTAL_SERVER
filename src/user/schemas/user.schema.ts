/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  mobile: number;

  @Prop({ default: '' })
  image: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmPassword: string;

  @Prop({ required: true })
  signInWith: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserPosts' })
  likedPosts: Array<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);