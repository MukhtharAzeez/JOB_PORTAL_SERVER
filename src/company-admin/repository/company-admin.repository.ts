import { JobPostDocument } from './../schema/job-post-schema.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddAJobPost } from '../dto/addAJobPost.dto';
import {
  CompanyAdmin,
  CompanyAdminDocument,
} from '../schema/company-admin.schema';
import { JobPost } from '../schema/job-post-schema.schema';
import {
  CompanyAdminRequests,
  CompanyAdminRequestsDocument,
} from 'src/requests/schema/companyAdminRequests';
import {
  JobApplicant,
  JobApplicantDocument,
} from 'src/job-applicants/schema/job-applicants.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';
// import { Schema as MongooseSchema, Types } from 'mongoose';

@Injectable()
export class CompanyAdminRepository {
  constructor(
    @InjectModel(CompanyAdmin.name)
    private companyAdminModel: Model<CompanyAdminDocument>,
    @InjectModel(JobPost.name)
    private jobPostModel: Model<JobPostDocument>,
    @InjectModel(CompanyAdminRequests.name)
    private companyAdminRequests: Model<CompanyAdminRequestsDocument>,
    @InjectModel(JobApplicant.name)
    private jobApplicantModel: Model<JobApplicantDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getProfile(adminId: string): Promise<CompanyAdmin> {
    if (!adminId)
      throw new HttpException('An Error occured', HttpStatus.BAD_REQUEST);
    return this.companyAdminModel
      .findOne({ _id: adminId }, { password: 0 })
      .populate(
        'company',
        '-password -approved -cinNumber -createdAt -updatedAt -establishedOn -gstNumber -incorporation -msmeCertificate -panCardNumber -udhyogAdhar',
      );
  }

  async addAJobPost(addAJobPost: AddAJobPost): Promise<boolean> {
    const newPost = new this.jobPostModel(addAJobPost);
    await newPost.save();
    return true;
  }

  async editAJob(addAJobPost: any): Promise<boolean> {
    const postExist = await this.jobPostModel.findOne({ _id: addAJobPost._id });
    if (!postExist) return false;
    const {
      job,
      jobDescription,
      jobQualification,
      image,
      benefits,
      aboutCompany,
      applications,
    } = addAJobPost;
    await this.jobPostModel.updateOne(
      { _id: addAJobPost._id },
      {
        $set: {
          job,
          jobDescription,
          jobQualification,
          image,
          benefits,
          aboutCompany,
          applications,
        },
      },
    );
    return true;
  }

  async getAllCompanyPosts(companyId: string): Promise<JobPost[]> {
    const job = await this.jobPostModel
      .find({ companyId: companyId }, { password: 0 })
      .populate('adminId', '-password -createdAt -updatedAt');
    return job;
  }

  async getAJobPost(jobId: string): Promise<JobPost[]> {
    return this.jobPostModel.findOne({ _id: jobId });
  }

  async getCompanyAdminRequests(
    companyAdminId: string,
  ): Promise<CompanyAdminRequests[]> {
    return this.companyAdminRequests
      .find({ admin: companyAdminId }, { password: 0 })
      .populate(
        'applicant',
        '-password -address -DOB -city -companies -country -createdAt -friends -gender -image -resume -signInWith -updatedAt -postalCode -mobile',
      )
      .populate('job')
      .populate('admin', '-password')
      .sort({ createdAt: -1 });
  }

  async updateRequest(requestId: string): Promise<boolean> {
    await this.companyAdminRequests.updateOne(
      { _id: requestId },
      { $set: { reSchedule: true } },
    );
    return true;
  }

  async getPendingSchedules(
    companyId: string,
    month: number,
    year: number,
  ): Promise<JobApplicant[]> {
    return this.jobApplicantModel.aggregate([
      { $match: { companyId: new Types.ObjectId(companyId) } },
      {
        $project: {
          jobId: 1,
          applicantId: 1,
          objects: {
            $map: {
              input: [
                { k: 'online', v: '$online' },
                { k: 'offline', v: '$offline' },
              ],
              as: 'obj',
              in: {
                type: '$$obj.k',
                data: '$$obj.v',
              },
            },
          },
        },
      },
      { $unwind: '$objects' },
      { $match: { 'objects.data.completed': false } },
      {
        $group: {
          _id: '$objects.data.date',
          objects: {
            $push: {
              type: '$objects.type',
              data: '$objects.data',
              applicantId: '$applicantId',
              jobId: '$jobId',
            },
          },
        },
      },
      {
        $addFields: {
          month: {
            $month: {
              $dateFromString: {
                dateString: '$_id',
                format: '%Y-%m-%d',
              },
            },
          },
          year: {
            $year: {
              $dateFromString: {
                dateString: '$_id',
                format: '%Y-%m-%d',
              },
            },
          },
          day: {
            $dayOfMonth: {
              $dateFromString: {
                dateString: '$_id',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },
      { $match: { month: month, year: year } },
      { $sort: { _id: 1 } },
    ]);
  }
  async getRandomUser(): Promise<User[]> {
    return this.userModel.aggregate([{ $sample: { size: 1 } }]);
  }
}
