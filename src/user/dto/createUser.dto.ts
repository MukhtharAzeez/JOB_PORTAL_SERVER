/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsMobilePhone, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
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
}
