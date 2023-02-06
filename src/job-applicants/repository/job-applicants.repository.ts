import {
  CompanyRequests,
  CompanyRequestsDocument,
} from './../../requests/schema/companyRequests';
import { JobApplicantDocument } from './../schema/job-applicants.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobApplicant } from '../schema/job-applicants.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class JobApplicantRepository {
  constructor(
    @InjectModel(JobApplicant.name)
    private jobApplicantModel: Model<JobApplicantDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(CompanyRequests.name)
    private companyRequestsModel: Model<CompanyRequestsDocument>,
  ) {}

  async applyForJob(jobId: string, userId: string): Promise<boolean> {
    // To check the user have a resume
    const userResume = await this.userModel.findOne({ _id: userId });
    if (userResume.resume.length == 0)
      throw new HttpException(
        'Please update your profile with your Resume !',
        HttpStatus.BAD_REQUEST,
      );
    // To check the user is already applied or not
    const alreadyApplied = await this.jobApplicantModel.findOne({
      jobId: jobId,
      applicantId: userId,
    });
    if (alreadyApplied)
      throw new HttpException(
        'You already applied to this Job !',
        HttpStatus.BAD_REQUEST,
      );
    // To add the user as an applicant
    const newApplicant = await new this.jobApplicantModel({
      jobId: jobId,
      applicantId: userId,
    });
    await newApplicant.save();
    return true;
  }

  async getAllApplicants(jobId: string): Promise<User[]> {
    return this.jobApplicantModel
      .find({ jobId: jobId })
      .populate('applicantId');
  }

  async rejectApplicant(applicantId: string, jobId: string): Promise<boolean> {
    await this.jobApplicantModel.updateOne(
      { jobId: jobId, applicantId: applicantId },
      {
        $set: {
          accepted: false,
        },
      },
    );
    return true;
  }

  async acceptApplicant(applicantId: string, jobId: string): Promise<boolean> {
    await this.jobApplicantModel.updateOne(
      { jobId: jobId, applicantId: applicantId },
      {
        $set: {
          accepted: true,
        },
      },
    );
    return true;
  }

  async acceptApplicantAndSchedule(
    formData: any,
    applicantId: string,
    jobId: string,
    adminId: string,
    companyId: string,
  ): Promise<boolean> {
    // Update the jobPost by applicant information if it is a online interview
    if (formData.onlineInterviewDate) {
      const { onlineInterviewDate, onlineInterviewTime } = formData;
      if (
        new Date(onlineInterviewDate) < new Date() ||
        onlineInterviewDate.length == 0 ||
        onlineInterviewTime.length == 0
      ) {
        throw new HttpException(
          'Please Provide valid datas',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.jobApplicantModel.updateOne(
        { jobId: jobId, applicantId: applicantId },
        {
          $set: {
            accepted: true,
            online: {
              date: onlineInterviewDate,
              time: onlineInterviewTime,
              completed: false,
              companyApproved: false,
              userAccepted: false,
              scheduledAdmin: new Types.ObjectId(adminId),
              scheduledAt: Date.now(),
            },
          },
        },
      );
      // Check it is reScheduled,  if it is then update the request
      const requestExist = await this.companyRequestsModel.findOne({
        job: jobId,
        applicant: applicantId,
        type: 'online',
      });
      if (requestExist) {
        await this.companyRequestsModel.deleteOne({
          job: jobId,
          applicant: applicantId,
          type: 'online',
        });
        const request = await this.companyRequestsModel.create({
          company: companyId,
          message: `Accepted and rescheduled an online interview according to applicant request at ${onlineInterviewDate} ${onlineInterviewTime} for Applicant`,
          applicant: applicantId,
          admin: adminId,
          job: jobId,
          accepted: null,
          type: 'online',
        });
        await request.save();
        return true;
      }
      const request = await this.companyRequestsModel.create({
        company: companyId,
        message: `Accepted and scheduled an online interview at ${onlineInterviewDate} ${onlineInterviewTime} for Applicant`,
        applicant: applicantId,
        admin: adminId,
        job: jobId,
        accepted: null,
        type: 'online',
      });
      await request.save();
      return true;
    }

    // Update the jobPost by applicant information if it is a offline interview
    if (formData.offlineInterviewDate) {
      const {
        offlineInterviewDate,
        offlineInterviewTime,
        offlineInterviewPlace,
      } = formData;
      if (
        new Date(offlineInterviewDate) < new Date() ||
        !offlineInterviewDate.length ||
        !offlineInterviewTime.length ||
        !offlineInterviewPlace.length
      ) {
        throw new HttpException(
          'Please Provide valid datas',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.jobApplicantModel.updateOne(
        { jobId: jobId, applicantId: applicantId },
        {
          $set: {
            accepted: true,
            offline: {
              date: offlineInterviewDate,
              time: offlineInterviewTime,
              place: offlineInterviewPlace,
              completed: false,
              companyApproved: false,
              userAccepted: false,
              scheduledAdmin: new Types.ObjectId(adminId),
              scheduledAt: Date.now(),
            },
          },
        },
      );
      const requestExist = await this.companyRequestsModel.findOne({
        job: jobId,
        applicant: applicantId,
        type: 'offline',
      });
      if (requestExist) {
        await this.companyRequestsModel.deleteOne({
          job: jobId,
          applicant: applicantId,
          type: 'offline',
        });
        const request = await this.companyRequestsModel.create({
          company: companyId,
          message: `Accepted and rescheduled an offline interview according to applicant request on ${offlineInterviewPlace} at ${offlineInterviewDate} ${offlineInterviewTime} for Applicant`,
          applicant: applicantId,
          admin: adminId,
          job: jobId,
          accepted: null,
          type: 'offline',
        });
        await request.save();
        return true;
      }
      const request = await this.companyRequestsModel.create({
        company: companyId,
        message: `Accepted and scheduled an offline interview on ${offlineInterviewPlace} at ${offlineInterviewDate} ${offlineInterviewTime} for Applicant`,
        applicant: applicantId,
        admin: adminId,
        job: jobId,
        accepted: null,
        type: 'offline',
      });
      await request.save();
      return true;
    }
    // Update the jobPost by applicant information if admin directly hire the user
    if (formData.directHire) {
      await this.jobApplicantModel.updateOne(
        { jobId: jobId, applicantId: applicantId },
        {
          $set: {
            accepted: true,
            hired: {
              hire: true,
              companyApproved: false,
              userAccepted: false,
              hiredAdmin: new Types.ObjectId(adminId),
              scheduledAt: Date.now(),
            },
          },
        },
      );
      const request = await this.companyRequestsModel.create({
        company: companyId,
        message: `Accepted and Decided to Hire This applicant for this job`,
        applicant: applicantId,
        admin: adminId,
        job: jobId,
        accepted: null,
        type: 'hired',
      });
      await request.save();
      return true;
    }
    throw new HttpException(
      'Please Provide valid datas',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getAnApplicantSchedules(
    jobId: string,
    applicantId: string,
  ): Promise<JobApplicant> {
    return this.jobApplicantModel
      .findOne({ jobId, applicantId })
      .populate('jobId')
      .populate('applicantId');
  }

  async setAScheduleAsCompleted(
    jobId: string,
    applicantId: string,
    type,
  ): Promise<boolean> {
    await this.jobApplicantModel.updateOne(
      { jobId, applicantId },
      { $set: { [type + '.completed']: true } },
    );
    return true;
  }
}
