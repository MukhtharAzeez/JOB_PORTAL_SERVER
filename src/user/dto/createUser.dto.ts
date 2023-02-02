/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail,MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  mobile?: number;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  confirmPassword: string;

  @IsNotEmpty()
  signInWith: string;

  accessToken:object;

  _id:string
}
