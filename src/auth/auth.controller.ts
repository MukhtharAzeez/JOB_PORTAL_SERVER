import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { CreateUserWithProvidersDto } from 'src/user/dto/createUserWithProviders.dto';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import * as nodemailer from 'nodemailer';
import { EmailDto } from './dto/email.dto';
import { CompanyCreateDto } from 'src/company/dto/companyCreate.dto';
import { Company } from 'src/company/schema/company.schema';
import { AdminDto } from './../admin/dto/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('createAdmin')
  async adminSignup(@Body() adminDto: AdminDto) {
    this.authService.adminSignup(adminDto);
  }
  @Post('loginAdmin')
  async loginAdmin(@Body() object: { email: string; password: string }) {
    if (!object.email || !object.password) {
      throw new BadRequestException('Fill all fields');
    }
    this.authService.loginAdmin(object.email, object.password);
  }

  @Post('user/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserDto> {
    if (createUserDto.password != createUserDto.confirmPassword)
      throw new HttpException(
        'password must be equal to confirm password',
        HttpStatus.BAD_REQUEST,
      );

    const result = await this.authService.createUser(createUserDto);
    return result;
  }

  @Post('/user/registerWithProviders')
  async registerWithProviders(
    @Body() createUserWithProvidersDto: CreateUserWithProvidersDto,
  ): Promise<CreateUserWithProvidersDto> {
    const result = await this.authService.registerWithProviders(
      createUserWithProvidersDto,
    );
    return result;
  }

  @Post('/create')
  async createABusinessPage(
    @Body()
    companyCreateDto: CompanyCreateDto,
  ): Promise<Company> {
    if (companyCreateDto.password != companyCreateDto.confirmPassword) {
      throw new HttpException(
        'password must be equal to confirm password',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.authService.createABusinessPage(companyCreateDto);
    }
  }

  @Post('/user/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserDto> {
    const result = await this.authService.loginUser(loginUserDto);
    return result;
  }

  @Post('/company/login')
  async companyLogin(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserDto> {
    const result = await this.authService.loginCompany(loginUserDto);
    return result;
  }

  @Post('/company-admin/login')
  async companyAdminLogin(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserDto> {
    const result = await this.authService.loginCompanyAdmin(loginUserDto);
    return result;
  }

  async sendEmail(email: string, subject: string, text: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject,
        text,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/email')
  async emailSend(@Body() emailDto: EmailDto) {
    return this.sendEmail(emailDto.email, emailDto.subject, emailDto.message);
  }
}
