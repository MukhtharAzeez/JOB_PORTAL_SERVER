/* eslint-disable prettier/prettier */
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as argon2 from 'argon2';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';
import { CreateUserWithProvidersDto } from 'src/user/dto/createUserWithProviders.dto';
import { Company, CompanyDocument } from 'src/company/schema/company.schema';
import { CompanyCreateDto } from 'src/company/dto/companyCreate.dto';
import {
  CompanyAdmin,
  CompanyAdminDocument,
} from 'src/company-admin/schema/company-admin.schema';
import { AdminDto } from 'src/admin/dto/admin.dto';
import { Admin, AdminDocument } from 'src/admin/schema/admin.schema';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyAdmin.name)
    private companyAdminModel: Model<CompanyAdminDocument>,
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async adminSignup(adminDto: AdminDto) {
    if (adminDto.password != adminDto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password must be same'
      );
    }
    const password = await argon2.hash(adminDto.password);
    adminDto.password = password;
    delete adminDto['confirmPassword'];
    const admin = new this.adminModel(adminDto);
    await admin.save();
  }
  async loginAdmin(email: string, password: string) {
    const admin = await this.adminModel.findOne({
      email: email,
    });
    if (admin) {
      const passwordCheck = await argon2.verify(admin.password, password);
      if (!passwordCheck)
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      else {
        return this.adminModel.findOne({ email: email }, { password: 0 });
      }
    }
    if (!admin) {
      throw new BadRequestException('You did not have a page');
    }
  }
  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userExist) {
      throw new HttpException(
        'You already have an account',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    let newUser;
    let userCreated;
    try {
      if (createUserDto.password != createUserDto.confirmPassword) {
        throw new BadRequestException(
          'Password and confirm password must be same',
        );
      }
      const password = await argon2.hash(createUserDto.password);
      createUserDto.password = password;
      delete createUserDto['confirmPassword'];
      newUser = new this.userModel(createUserDto);
      userCreated = await newUser.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    delete userCreated.password;
    delete userCreated.confirmPassword;
    return userCreated;
  }
  async registerWithProviders(
    createUserWithProvidersDto: CreateUserWithProvidersDto,
  ): Promise<any> {
    const userExist = await this.userModel.findOne({
      email: createUserWithProvidersDto.email,
    });
    if (!userExist) {
      try {
        if (
          createUserWithProvidersDto.password !=
          createUserWithProvidersDto.confirmPassword
        ) {
          throw new BadRequestException(
            'Password and confirm password must be same',
          );
        }
        const password = await argon2.hash(createUserWithProvidersDto.password);
        createUserWithProvidersDto.password = password;
        delete createUserWithProvidersDto['confirmPassword'];
        const newUser = await this.userModel.create(createUserWithProvidersDto);
        return newUser.save();
      } catch (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return userExist;
    }
  }
  async createABusinessPage(
    companyCreateDto: CompanyCreateDto,
  ): Promise<Company> {
    const companyExist = await this.companyModel.findOne({
      email: companyCreateDto.email,
    });
    if (companyExist)
      throw new HttpException(
        'You already have a business page',
        HttpStatus.CONFLICT,
      );
    if (companyCreateDto.password != companyCreateDto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password must be same',
      );
    }
    const password = await argon2.hash(companyCreateDto.password);
    companyCreateDto.password = password;
    companyCreateDto.approved = false;
    delete companyCreateDto['confirmPassword'];
    const company = new this.companyModel(companyCreateDto);
    return company.save();
  }
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (user) {
      const passwordCheck = await argon2.verify(
        user.password,
        loginUserDto.password,
      );
      if (!passwordCheck)
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      else {
        return this.userModel.findOne(
          { email: loginUserDto.email },
          { password: 0 },
        );
      }
    }

    if (!user) {
      throw new BadRequestException('User Not Found');
    }
  }
  async loginCompany(loginUserDto: LoginUserDto) {
    const company = await this.companyModel.findOne({
      email: loginUserDto.email,
    });
    if (company) {
      const passwordCheck = await argon2.verify(
        company.password,
        loginUserDto.password,
      );
      if (!passwordCheck)
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      if (company.approved) {
        return this.companyModel.findOne(
          { email: loginUserDto.email },
          { password: 0 },
        );
      } else
        throw new HttpException(
          'Your page is not approved yet Please wait until administrator approve your request',
          HttpStatus.NOT_ACCEPTABLE,
        );
    }

    if (!company) {
      throw new BadRequestException('You did not have a page');
    }
  }
  async loginCompanyAdmin(loginUserDto: LoginUserDto) {
    const companyAdmin = await this.companyAdminModel.findOne({
      email: loginUserDto.email,
    });
    if (companyAdmin) {
      const passwordCheck = await argon2.verify(
        companyAdmin.password,
        loginUserDto.password,
      );
      if (!passwordCheck)
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      else {
        return this.companyAdminModel.findOne(
          { email: loginUserDto.email },
          { password: 0 },
        );
      }
    }
    if (!companyAdmin) {
      throw new BadRequestException('You did not have a page');
    }
  }
}
