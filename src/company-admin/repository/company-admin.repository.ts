import { JobPostDocument } from './../schema/job-post-schema.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  async getProfile(adminId: string): Promise<CompanyAdmin> {
    if (!adminId)
      throw new HttpException('An Error occured', HttpStatus.BAD_REQUEST);
    return this.companyAdminModel.findOne({ _id: adminId });
  }

  async addAJobPost(addAJobPost: AddAJobPost): Promise<JobPost> {
    const newPost = new this.jobPostModel(addAJobPost);
    return newPost.save();
  }

  async editAJob(addAJobPost: any): Promise<any> {
    const {
      job,
      jobDescription,
      jobQualification,
      image,
      benefits,
      aboutCompany,
      applications,
    } = addAJobPost;
    return this.jobPostModel.updateOne(
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
  }

  async getAllCompanyPosts(companyId: string): Promise<JobPost[]> {
    const job = await this.jobPostModel
      .find({ companyId: companyId })
      .populate('adminId');
    return job;
  }

  async getAJobPost(jobId: string): Promise<JobPost[]> {
    return this.jobPostModel.findOne({ _id: jobId });
  }

  async getCompanyAdminRequests(
    companyAdminId: string,
  ): Promise<CompanyAdminRequests[]> {
    return this.companyAdminRequests
      .find({ admin: companyAdminId })
      .populate('applicant')
      .populate('job')
      .sort({ createdAt: -1 });
  }

  async updateRequest(requestId: string): Promise<boolean> {
    await this.companyAdminRequests.updateOne(
      { _id: requestId },
      { $set: { reSchedule: true } },
    );
    return true;
  }
}
