import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { AuthRepository } from './auth.repository';
import { CreateUserWithProvidersDto } from 'src/user/dto/createUserWithProviders.dto';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { CompanyCreateDto } from 'src/company/dto/companyCreate.dto';
import { Company } from 'src/company/schema/company.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private authRepository: AuthRepository,
  ) {}

  // To create a JWT
  async createToken(email: string, password: string) {
    const payLoad = {
      email,
      password,
    };
    const secret = this.config.get('secret');
    const token = await this.jwt.signAsync(payLoad, {
      expiresIn: '1h',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const result = await this.authRepository.create(createUserDto);
    if (result) {
      const accessToken = await this.createToken(result.email, result.password);
      return {
        result,
        accessToken,
      };
    }
  }

  async registerWithProviders(
    createUserWithProvidersDto: CreateUserWithProvidersDto,
  ): Promise<any> {
    const result = await this.authRepository.registerWithProviders(
      createUserWithProvidersDto,
    );
    if (result) {
      const accessToken = await this.createToken(result.email, result.password);
      return {
        result,
        accessToken,
      };
    }
  }

  async createABusinessPage(
    companyCreateDto: CompanyCreateDto,
  ): Promise<Company> {
    return this.authRepository.createABusinessPage(companyCreateDto);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const result = await this.authRepository.loginUser(loginUserDto);
    if (result) {
      const accessToken = await this.createToken(result.email, result.password);
      return {
        result,
        accessToken,
      };
    }
  }

  async loginCompany(loginUserDto: LoginUserDto): Promise<any> {
    const result = await this.authRepository.loginCompany(loginUserDto);
    if (result) {
      const accessToken = await this.createToken(result.email, result.password);
      return {
        result,
        accessToken,
      };
    }
  }
}
