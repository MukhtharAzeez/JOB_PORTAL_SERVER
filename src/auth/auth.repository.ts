/* eslint-disable prettier/prettier */
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import {
  BadRequestException,
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

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyAdmin.name)
    private companyAdminModel: Model<CompanyAdminDocument>,
  ) {}

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
      const password = await argon2.hash(createUserDto.password);
      const confirmPassword = await argon2.hash(createUserDto.confirmPassword);
      createUserDto.password = password;
      createUserDto.confirmPassword = confirmPassword;
      newUser = await new this.userModel(createUserDto);
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
        const password = await argon2.hash(createUserWithProvidersDto.password);
        const confirmPassword = await argon2.hash(
          createUserWithProvidersDto.confirmPassword,
        );
        createUserWithProvidersDto.password = password;
        createUserWithProvidersDto.confirmPassword = confirmPassword;
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
    const password = await argon2.hash(companyCreateDto.password);
    const confirmPassword = await argon2.hash(companyCreateDto.confirmPassword);
    companyCreateDto.password = password;
    companyCreateDto.confirmPassword = confirmPassword;
    companyCreateDto.approved = false;
    const company = await new this.companyModel(companyCreateDto);
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
        return this.userModel.findOne({ email: loginUserDto.email },{password:0});
      };
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
      if (company.approved){
        return this.companyModel.findOne({ email: loginUserDto.email },{password:0});
      } 
      else
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
      else{
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
