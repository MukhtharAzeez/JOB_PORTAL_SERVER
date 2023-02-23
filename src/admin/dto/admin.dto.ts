import { IsNotEmpty } from 'class-validator';
export class AdminDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  image: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
