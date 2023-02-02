/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Types } from 'mongoose';

export class CompanyCreateDto {
  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  establishedOn: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  panCardNumber: number;

  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(15)
  gstNumber: number;

  @IsNotEmpty()
  @MaxLength(21)
  @MinLength(21)
  cinNumber: number;

  @IsNotEmpty()
  msmeCertificate: string;

  @IsNotEmpty()
  udhyogAdhar: string;

  @IsNotEmpty()
  fssaiLicense: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  confirmPassword: string;

  approved:boolean;
  _id:Types.ObjectId;
}
