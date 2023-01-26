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
// import { Schema as MongooseSchema, Types } from 'mongoose';

@Injectable()
export class CompanyAdminRepository {
  constructor(
    @InjectModel(CompanyAdmin.name)
    private companyAdminModel: Model<CompanyAdminDocument>,
    @InjectModel(JobPost.name)
    private jobPostModel: Model<JobPostDocument>,
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
  async getAJobPost(jobId: string, user: boolean): Promise<JobPost[]> {
    if (!user) return this.jobPostModel.findOne({ _id: jobId });
    const users = await this.jobPostModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(jobId) },
      },
      {
        $project: {
          applicants: 1,
        },
      },
      {
        $unwind: {
          path: '$applicants',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'applicants',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          applicants: { $arrayElemAt: ['$user', 0] },
        },
      },
    ]);
    return users;
  }
}
