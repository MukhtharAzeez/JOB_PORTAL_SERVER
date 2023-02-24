import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { AuthRepository } from './auth.repository';
import { CreateUserWithProvidersDto } from 'src/user/dto/createUserWithProviders.dto';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { CompanyCreateDto } from 'src/company/dto/companyCreate.dto';
import { Company } from 'src/company/schema/company.schema';
import { AdminDto } from 'src/admin/dto/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private authRepository: AuthRepository,
  ) {}

  // To create a JWT
  async createToken(email: string, _id: string) {
    const payLoad = {
      email,
      _id,
    };
    const secret = this.config.get('secret');
    const token = await this.jwt.signAsync(payLoad, {
      expiresIn: '1day',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }

  async adminSignup(adminDto: AdminDto) {
    return this.authRepository.adminSignup(adminDto);
  }
  async loginAdmin(email: string, password: string) {
    return this.authRepository.loginAdmin(email, password);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const result = await this.authRepository.create(createUserDto);
    if (result) {
      const accessToken = await this.createToken(result.email, result._id);
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
      const accessToken = await this.createToken(result.email, result._id);
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
      const accessToken = await this.createToken(
        result.email,
        result._id.toString(),
      );
      return {
        result,
        accessToken,
      };
    }
  }

  async loginCompany(loginUserDto: LoginUserDto): Promise<any> {
    const result = await this.authRepository.loginCompany(loginUserDto);
    if (result) {
      const accessToken = await this.createToken(
        result.email,
        result._id.toString(),
      );
      return {
        result,
        accessToken,
      };
    }
  }

  async loginCompanyAdmin(loginUserDto: LoginUserDto): Promise<any> {
    const result = await this.authRepository.loginCompanyAdmin(loginUserDto);
    if (result) {
      const accessToken = await this.createToken(
        result.email,
        result._id.toString(),
      );
      return {
        result,
        accessToken,
      };
    }
  }
}
