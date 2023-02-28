import { JobApplicantDocument } from './../../job-applicants/schema/job-applicants.schema';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CompanyDocument } from '../schema/company.schema';
import { Company } from '../schema/company.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import {
  CompanyAdmin,
  CompanyAdminDocument,
} from 'src/company-admin/schema/company-admin.schema';
import { CompanyAdminDto } from 'src/company-admin/dto/companyAdmin.dto';
import {
  JobPost,
  JobPostDocument,
} from 'src/company-admin/schema/job-post-schema.schema';
import {
  CompanyRequests,
  CompanyRequestsDocument,
} from 'src/requests/schema/companyRequests';
import { JobApplicant } from 'src/job-applicants/schema/job-applicants.schema';
import {
  UserRequests,
  UserRequestsDocument,
} from 'src/requests/schema/userRequests.schema';
import {
  CompanyAdminRequests,
  CompanyAdminRequestsDocument,
} from 'src/requests/schema/companyAdminRequests';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyAdmin.name)
    private companyAdminModel: Model<CompanyAdminDocument>,
    @InjectModel(JobPost.name)
    private jobPostModel: Model<JobPostDocument>,
    @InjectModel(CompanyRequests.name)
    private companyRequestModel: Model<CompanyRequestsDocument>,
    @InjectModel(JobApplicant.name)
    private jobApplicantModel: Model<JobApplicantDocument>,
    @InjectModel(UserRequests.name)
    private userRequestsModel: Model<UserRequestsDocument>,
    @InjectModel(CompanyAdminRequests.name)
    private companyAdminRequestsModel: Model<CompanyAdminRequestsDocument>,
  ) {}

  async addAdmin(companyAdminDto: CompanyAdminDto): Promise<any> {
    const adminExist = await this.companyAdminModel.findOne(
      {
        email: companyAdminDto.email,
      },
      { password: 0 },
    );
    if (adminExist) {
      throw new BadRequestException('An Admin already exists with this email');
    }
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 8;
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    const newPassword = await argon2.hash(password);
    companyAdminDto.status = true;
    companyAdminDto.password = newPassword;
    const newAdmin = new this.companyAdminModel(companyAdminDto).save();
    (await newAdmin).password = password;
    return newAdmin;
  }

  async getAllCompanyAdmins(
    companyId: string,
    limit: number,
    skip: number,
  ): Promise<CompanyAdmin[]> {
    return this.companyAdminModel
      .find({ company: companyId }, { password: 0 })
      .skip(skip * limit)
      .limit(limit);
  }

  async getCountCompanyAdmins(companyId: string): Promise<number> {
    return this.companyAdminModel.find({ company: companyId }).count();
  }

  async getJobPosts(limit: number, skip: number): Promise<JobPost[]> {
    return this.jobPostModel
      .find({})
      .skip(skip * limit)
      .limit(limit)
      .populate('companyId')
      .sort({ createdAt: -1 });
  }

  async getAllRequests(companyId: string): Promise<CompanyRequests[]> {
    if (companyId == 'null') {
      throw new HttpException('Please try again', HttpStatus.BAD_REQUEST);
    }
    return this.companyRequestModel
      .find({ company: companyId }, { password: 0 })
      .populate(
        'company',
        '-password -approved -cinNumber -createdAt -updatedAt -establishedOn -gstNumber -incorporation -msmeCertificate -panCardNumber -udhyogAdhar',
      )
      .populate(
        'admin',
        '-password -address -businessMobile -employeeId -mobile -postalCode -status -createdAt -updatedAt',
      )
      .populate('job')
      .populate(
        'applicant',
        '-password -address -DOB -city -companies -country -createdAt -friends -gender -image -resume -signInWith -updatedAt -postalCode -mobile',
      )
      .sort({ createdAt: -1 });
  }

  async acceptSchedule(companyRequestId: string): Promise<boolean> {
    const requestCheck = await this.companyRequestModel.findOne({
      _id: companyRequestId,
    });
    if (!requestCheck)
      throw new HttpException('An Error Occurred', HttpStatus.BAD_REQUEST);
    await this.companyRequestModel.updateOne(
      {
        _id: companyRequestId,
      },
      {
        $set: {
          accepted: true,
        },
      },
    );
    await this.jobApplicantModel.updateOne(
      {
        jobId: requestCheck.job,
        applicantId: requestCheck.applicant,
        type: requestCheck.type,
      },
      {
        $set: {
          [requestCheck.type + '.companyApproved']: true,
        },
      },
    );
    const request = await this.userRequestsModel.create({
      company: requestCheck.company,
      message: requestCheck.message,
      user: requestCheck.applicant,
      job: requestCheck.job,
      admin: requestCheck.admin,
      accepted: null,
      changeRequest: false,
      type: requestCheck.type,
    });
    await request.save();
    return true;
  }

  async rejectSchedule(companyRequestId: string): Promise<boolean> {
    const requestCheck = await this.companyRequestModel.findOne({
      _id: companyRequestId,
    });
    if (!requestCheck)
      throw new HttpException('An Error Occurred', HttpStatus.BAD_REQUEST);
    await this.companyRequestModel.updateOne(
      {
        _id: companyRequestId,
      },
      {
        $set: {
          accepted: false,
        },
      },
    );

    await this.jobApplicantModel.updateOne(
      {
        jobId: requestCheck.job,
        applicantId: requestCheck.applicant,
        type: requestCheck.type,
      },
      {
        $set: {
          [requestCheck.type + '.companyApproved']: false,
        },
      },
    );

    const request = await this.companyAdminRequestsModel.create({
      company: requestCheck.company,
      message: requestCheck.message,
      applicant: requestCheck.applicant,
      job: requestCheck.job,
      admin: requestCheck.admin,
      companyApproved: false,
      type: requestCheck.type,
    });
    await request.save();

    const userGetRequest = await this.userRequestsModel.findOne({
      company: requestCheck.company,
      job: requestCheck.job,
      type: requestCheck.type,
    });
    if (userGetRequest) {
      await this.userRequestsModel.deleteOne({
        company: requestCheck.company,
        job: requestCheck.job,
        type: requestCheck.type,
      });
    }
    return true;
  }
}
